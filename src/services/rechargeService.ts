import dayjs from "dayjs";
import * as cardsRepositories from "../repositories/cardRepository.js";
import * as rechargeRepository from "../repositories/rechargeRepository.js";
import * as employeeRepository from "./../repositories/employeeRepository.js";
import { verifyIfCardActivated, verifyIfCardIsBlocked } from "./cardService.js";

export async function rechargeCard(cardId: number, amount: number) {
  const cardData = await cardsRepositories.findById(cardId);
  if (!cardData)
    throw { type: "not_found", message: "This cardId doesn't exist " };
  const currentDate = dayjs(Date.now()).format("MM/YY");
  const expirationDate = cardData.expirationDate;
  const isWithinExpirationDate = dayjs(currentDate).isBefore(expirationDate);
  if (!isWithinExpirationDate)
    throw { type: "Unauthorized", message: "Your card has expired" };
  await verifyIfCardActivated(cardData);
  await verifyIfCardIsBlocked(cardData);
  await verifyIfCardIsVirtual(cardData);
  await rechargeRepository.insert({ cardId, amount });
}

//local functions

async function verifyIfCardIsVirtual(cardData: cardsRepositories.Card) {
  if (cardData.isVirtual)
    throw { type: "Bad_Request", message: "This card is already blocked!" };
}
