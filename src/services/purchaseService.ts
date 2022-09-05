import Cryptr from "cryptr";
import bcrypt from "bcrypt";
import dayjs from "dayjs";
import dotenv from "dotenv";
import * as cardsRepository from "../repositories/cardRepository.js";
import * as paymentRepository from "../repositories/paymentRepository.js";
import * as businessRepository from "../repositories/businessRepository.js";
import * as cardService from "../services/cardService.js";

dotenv.config();
const crypt = new Cryptr(process.env.SECRETKEY || "secret");

export async function createTransaction(
  cardId: number,
  password: string,
  businessId: number,
  amount: number
) {
  const cardData = await cardsRepository.findById(cardId);

  await verifyIfCardExist(cardData);
  await verifyCardExpirationDate(cardData);
  await verifyCardPassword(password, cardData);
  await verifyExistingBusiness(businessId, cardData);
  await verifyIfUserHasCredit(cardId, amount);

  await paymentRepository.insert({ cardId, businessId, amount });
}

export async function createOnlineTransaction(
  cardId: number,
  businessId: number,
  amount: number,
  cardholderName: string,
  number: string,
  expirationDate: string
) {
  const cardData = await cardsRepository.findById(cardId);
  console.log(cardData);
  await verifyIfDataIsCorrect(number, cardholderName, expirationDate, cardData);
  await verifyIfCardExist(cardData);
  await verifyCardExpirationDate(cardData);
  await verifyExistingBusiness(businessId, cardData);
  await verifyIfUserHasCredit(cardId, amount);

  await paymentRepository.insert({ cardId, businessId, amount });
}

async function verifyCardExpirationDate(cardData: cardsRepository.Card) {
  const currentDate = dayjs().format("MM/YY");
  const expirationDate = cardData.expirationDate;
  const isWithinExpirationDate = dayjs(currentDate).isBefore(expirationDate);
  if (!isWithinExpirationDate)
    throw { type: "Unauthorized", message: "Your card has expired" };
}

async function verifyIfDataIsCorrect(
  number: string,
  cardholderName: string,
  expirationDate: string,
  cardData: cardsRepository.Card
) {
  let card = await cardsRepository.findByCardDetails(
    number,
    cardholderName,
    expirationDate
  );
  console.log(card);
  if (
    card.cardholderName !== cardData.cardholderName ||
    card.number !== cardData.number ||
    card.expirationDate !== cardData.expirationDate
  )
    throw { type: "Unauthorized", message: "Your card has expired" };
}

async function verifyCardPassword(
  password: string,
  cardData: cardsRepository.Card
) {
  if (!bcrypt.compareSync(password, cardData.password))
    throw { type: "Unauthorized", message: "incorrect password" };
}

async function verifyExistingBusiness(
  businessId: number,
  cardData: cardsRepository.Card
) {
  const business = await businessRepository.findById(businessId);

  if (!business)
    throw { type: "not_found", message: "establishment not found" };
  if (!business.type)
    throw { type: "not_found", message: "business type not found" };
  if (business.type !== cardData.type)
    throw {
      type: "not_found",
      message: "Business type not found for this user",
    };
}

async function verifyIfUserHasCredit(cardId: number, amount: number) {
  const amountAvailable = await cardService.getBalanceAndTransactions(cardId);
  if (amountAvailable.balance < amount)
    throw { type: "Unauthorized", message: "Check your balance" };
}

async function verifyIfCardExist(cardData: cardsRepository.Card) {
  if (!cardData) throw { type: "not_found", message: "Card not found" };
}
