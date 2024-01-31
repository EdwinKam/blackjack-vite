import { Condition } from "../controllers/BlackjackHttpController";

export interface CardHand {
  bet: number;
  cardCount: number;
  cards: string;
  handCount: number;
  hardSum: number;
  hasAce: boolean;
  soft17: boolean;
  sum: number;
}

export interface GameRecord {
  dealer: CardHand;
  gameNumber: number;
  playerAfterGameAsset: number;
  playerAllHands: CardHand[];
  playerOriginalAsset: number;
  results: string[];
}

export interface GameResult {
  gameRecords: GameRecord[];
}

export interface SimulateRequestHistory {
  customPlayerBetStrategies: Condition[];
  numOfGame: number;
  trackingUuid: string;
  creationTimeStamp: number;
}

export enum StatusMessage {
  COMPLETED = "COMPLETED",
  FAILURE = "FAILURE",
}
