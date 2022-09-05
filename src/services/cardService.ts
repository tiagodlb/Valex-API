import dayjs from "dayjs";
import { faker } from "@faker-js/faker";
import Cryptr from "cryptr";
import dotenv from "dotenv";
import * as cardsRepositories from "../repositories/cardRepository.js";
import * as employeeRepository from "../repositories/employeeRepository.js";
import * as paymentRepository from "../repositories/paymentRepository.js";
import * as rechargesRepository from "../repositories/rechargeRepository.js";

dotenv.config();

const crypt = new Cryptr(process.env.SECRETKEY || "secret");

export async function createCard(
  employeeId: number,
  type: cardsRepositories.TransactionTypes
) {
  const cardData = await formatCardData(employeeId, type);
  await cardsRepositories.insert(cardData);
}

export async function activateCard(
  securityCode: string,
  password: string,
  originalCardId: number
) {
  const cardData = await cardsRepositories.findById(originalCardId);
  if (!cardData) throw { type: "not_found", message: "card not found" };

  await verifyCardExpirationDate(cardData);
  await verifyCVC(securityCode, cardData);
  await verifyIfCardActivated(cardData);

  const hashedPassword = encryptData(password);
  const cardDataValid = {
    password: hashedPassword,
    originalCardId: originalCardId,
  };
  await cardsRepositories.update(originalCardId, cardDataValid);
  return;
}

export async function getBalanceAndTransactions(id: number) {
  const cardData = await cardsRepositories.findById(id);
  if (!cardData)
    throw { type: "not_found", message: "The card is not registered" };

  const transactions = await paymentRepository.findByCardId(id);
  const recharges = await rechargesRepository.findByCardId(id);

  const cardTransactions = transactions
    .map((transaction) => transaction.amount)
    .reduce((curr: number, sum: number) => curr + sum, 0);
  const cardRecharges = recharges
    .map((recharge) => recharge.amount)
    .reduce((curr: number, sum: number) => curr + sum, 0);

  return {
    balance: cardRecharges - cardTransactions,
    transactions,
    recharges,
  };
}

//local functions

export async function validateCreation(
  employeeId: number,
  companyId: number,
  type: cardsRepositories.TransactionTypes
) {
  const employee = await employeeRepository.findById(employeeId);
  if (employee === undefined)
    throw { type: "not_found", message: "employee not found" };
  if (employee.companyId !== companyId)
    throw { type: "Unauthorized", message: "unauthorized to create card" };

  const cardData = await cardsRepositories.findByTypeAndEmployeeId(
    type,
    employeeId
  );
  if (cardData)
    throw { type: "Unauthorized", message: "unauthorized to create card" };
}

async function formatCardData(
  employeeId: number,
  type: cardsRepositories.TransactionTypes
) {
  const number = faker.finance.creditCardNumber("mastercard");
  const cardholderName = await formatEmployeeName(employeeId);
  const securityCode = String(await createCriptoCVV());
  const expirationDate = dayjs(Date.now()).add(5, "year").format("MM/YY");

  return {
    employeeId: employeeId,
    number,
    cardholderName,
    securityCode,
    expirationDate,
    password: null,
    isVirtual: false,
    originalCardId: null,
    isBlocked: true,
    type,
  };
}

function formatName(name: string) {
  const nameToArray = name.toUpperCase().split(" ");
  let cardholderName = nameToArray[0];

  for (let i = 1; i < nameToArray.length - 1; i++) {
    if (nameToArray[i].length >= 3) cardholderName += ` ${nameToArray[i][0]}`;
  }

  return cardholderName + ` ${nameToArray[nameToArray.length - 1]}`;
}

async function formatEmployeeName(employeeId: number) {
  const { fullName } = await employeeRepository.findById(employeeId);
  return formatName(fullName);
}

async function createCriptoCVV() {
  const securityCode = faker.finance.creditCardCVV();
  const hashedSecurityCode = crypt.encrypt(securityCode);
  return hashedSecurityCode;
}

async function verifyCVC(
  securityCode: string,
  cardData: cardsRepositories.Card
) {
  if (securityCode !== decryptData(cardData.securityCode))
    throw { type: "Unauthorized", message: "Invalid CVV." };
}

async function verifyIfCardActivated(cardData: cardsRepositories.Card) {
  if (cardData.password)
    throw { type: "conflict", message: "This card is already active!" };
}

async function verifyCardExpirationDate(cardData: cardsRepositories.Card) {
  const currentDate = dayjs(Date.now()).format("MM/YY");
  const expirationDate = cardData.expirationDate;
  const isWithinExpirationDate = dayjs(currentDate).isBefore(expirationDate);
  if (!isWithinExpirationDate)
    throw { type: "Unauthorized", message: "Your card has expired." };
}

function encryptData(data: string): string {
  const hashedData = crypt.encrypt(data);
  return hashedData;
}

function decryptData(cryptedData: string): string {
  const decryptedData = crypt.decrypt(cryptedData);
  return decryptedData;
}
