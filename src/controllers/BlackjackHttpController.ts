import axios from "axios";
import { GameResult, SimulateRequestHistory } from "../models/blackjackTypes";

const url = "https://blackjack-service-render.onrender.com/blackjack";
// const url = "http://localhost:8080/blackjack";

export type Condition = {
  leftValue: string;
  comparisonOperator: string;
  rightValue: string;
  bet: string;
};

export const simulateRequest = async (
  numOfGames: string,
  betStrategies: Condition[]
): Promise<string> => {
  try {
    const response = await axios.post(
      `${url}/simulateRequest`,
      betStrategies.map((s) => [
        s.leftValue,
        s.comparisonOperator,
        s.rightValue,
        s.bet,
      ]),
      {
        params: {
          numOfGame: numOfGames,
        },
      }
    );

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Request failed with status code ${response.status}`);
    }
  } catch (error) {
    console.error(`Error in SimulateRequest: ${error}`);
    throw error;
  }
};

export const getSimulateResult = async (
  trackingUuid: string
): Promise<GameResult> => {
  try {
    const response = await axios.post(
      `${url}/checkResult`,
      {},
      {
        params: {
          trackingUuid: trackingUuid,
        },
      }
    );

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Request failed with status code ${response.status}`);
    }
  } catch (error) {
    console.error(`Error in getSimulateResult: ${error}`);
    throw error;
  }
};

export const getBatchSimulateStatus = async (
  trackingUuids: string[]
): Promise<Map<string, string>> => {
  if (trackingUuids === null) {
    return new Map();
  }
  const response = await axios.post(
    url + "/batchCheckProgress/",
    trackingUuids.map((uuid) => uuid),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (response.status === 200) {
    return response.data;
  } else {
    throw new Error(`Request failed with status code ${response.status}`);
  }
};

export const getAllRequests = async (): Promise<SimulateRequestHistory[]> => {
  try {
    const response = await axios.get(`${url}/getAllSimulateRequest`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      return response.data as SimulateRequestHistory[];
    } else {
      throw new Error(`Request failed with status code ${response.status}`);
    }
  } catch (error) {
    console.error(`Error in getAllTrackingUuid: ${error}`);
    throw error;
  }
};
