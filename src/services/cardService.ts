import dayjs from "dayjs";
import { faker } from "@faker-js/faker";
import Cryptr from "cryptr";
import dotenv from "dotenv";
import * as cardsRepositories from "../repositories/cardRepository.js";
import * as employeeRepository from "../repositories/employeeRepository.js";

dotenv.config();

const cryptrSecret = process.env.SECRETKEY || 'secret';

export async function validateCreation(
  employeeId: number,
  companyId: number,
  type: cardsRepositories.TransactionTypes
) {
  const employee = await employeeRepository.findById(employeeId);
  if (employee === undefined) throw { type: "not_found", message: "employee not found" };
  if (employee.companyId !== companyId)
    throw { type: "Unauthorized", message: "unauthorized to create card" };

  const cardData = await cardsRepositories.findByTypeAndEmployeeId(
    type,
    employeeId
  );
  if (cardData)
    throw { type: "Unauthorized", message: "unauthorized to create card" };
}

export async function createCard(
  employeeId: number,
  type: cardsRepositories.TransactionTypes
) {
  const cardData = await formatCardData(employeeId, type);
  await cardsRepositories.insert(cardData);
}

async function formatCardData(
  employeeId: number,
  type: cardsRepositories.TransactionTypes
) {
  const number = faker.finance.creditCardNumber("mastercard");
  const cardholderName = await formatEmployeeName(employeeId);
  const securityCode = String( await createCriptoCVV());
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
  const hashedSecurityCode = new Cryptr(cryptrSecret).encrypt(
    securityCode
  );
  return hashedSecurityCode;
}
