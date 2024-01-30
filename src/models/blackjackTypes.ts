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
