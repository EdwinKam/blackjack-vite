import axios from "axios";

// const url = 'https://blackjack-service-render.onrender.com/blackjack';
const url = "http://localhost:8080/blackjack";

export type Condition = {
  left: string;
  operator: string;
  right: string;
  bet: string;
};

export const simulateRequest = async (
  numOfGames: string,
  betStrategies: Condition[]
): Promise<string> => {
  try {
    const response = await axios.post(
      `${url}/simulateRequest`,
      betStrategies.map((s) => [s.left, s.operator, s.right, s.bet]),
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
    console.error(`Error in simulateRequest: ${error}`);
    throw error;
  }
};
