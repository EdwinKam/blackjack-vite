import { Dispatch, SetStateAction, useState } from "react";
import Dropdown from "../components/Dropdown";
import { SelectChangeEvent } from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {
  Condition,
  simulateRequest,
} from "../controllers/BlackjackHttpController";

interface NewRequestProps {
  setRefreshDashboard: Dispatch<SetStateAction<number>>;
}

function NewRequest({ setRefreshDashboard }: NewRequestProps) {
  const [numOfGames, setNumOfGames] = useState("");
  const [conditions, setConditions] = useState<Condition[]>([
    { leftValue: "", comparisonOperator: "", rightValue: "", bet: "" },
  ]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const options = ["<", ">", ">=", "<=", "="];

  const handleDropdownChange = (
    event: SelectChangeEvent<string>,
    index: number
  ) => {
    const newConditions = [...conditions];
    newConditions[index].comparisonOperator = event.target.value;
    setConditions(newConditions);
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number,
    field: keyof Condition
  ) => {
    const newConditions = [...conditions];
    newConditions[index][field] = event.target.value;
    setConditions(newConditions);
  };

  const handleAddCondition = () => {
    setConditions([
      ...conditions,
      { leftValue: "", comparisonOperator: "", rightValue: "", bet: "" },
    ]);
  };

  const handleRemoveCondition = (index: number) => {
    const newConditions = [...conditions];
    newConditions.splice(index, 1);
    setConditions(newConditions);
  };

  const handleSubmit = async () => {
    setIsSubmitted(true);
    setRefreshDashboard((p) => p + 1);
    // Validate number of games
    if (numOfGames === "" || isNaN(Number(numOfGames))) {
      return;
    }

    // Validate conditions
    for (const condition of conditions) {
      if (
        condition.leftValue === "" ||
        condition.comparisonOperator === "" ||
        condition.rightValue === ""
      ) {
        return;
      }
    }

    // Log input
    console.log(`Number of Games: ${numOfGames}`);
    console.log("Conditions:");
    conditions.forEach((condition, index) => {
      console.log(
        `Condition ${index + 1}: ${condition.leftValue} ${
          condition.comparisonOperator
        } ${condition.rightValue} ${condition.bet}`
      );
    });
    console.log(await simulateRequest(numOfGames, conditions));
    // Continue processing...
  };

  return (
    <Box display="flex" flexDirection="column" gap={2} padding={2}>
      <TextField
        id="outlined-basic"
        label="Number of Games"
        variant="outlined"
        value={numOfGames}
        error={isSubmitted && (numOfGames === "" || isNaN(Number(numOfGames)))}
        helperText={
          isSubmitted &&
          (numOfGames === "" || isNaN(Number(numOfGames))) &&
          "Please enter a valid number"
        }
        onChange={(e) => setNumOfGames(e.target.value)}
        style={{ width: 300 }}
      />
      {conditions.map((condition, index) => (
        <Box key={index} display="flex" gap={2}>
          <TextField
            value={condition.leftValue}
            onChange={(e) => handleInputChange(e, index, "leftValue")}
            error={isSubmitted && condition.leftValue === ""}
            helperText={
              isSubmitted &&
              condition.leftValue === "" &&
              "Please enter a valid number"
            }
          />
          <Dropdown
            value={condition.comparisonOperator}
            label="Operator"
            options={options}
            handleChange={(e) => handleDropdownChange(e, index)}
            error={isSubmitted && condition.comparisonOperator === ""}
          />
          <TextField
            value={condition.rightValue}
            onChange={(e) => handleInputChange(e, index, "rightValue")}
            error={isSubmitted && condition.rightValue === ""}
            helperText={
              isSubmitted &&
              condition.rightValue === "" &&
              "Please enter a valid number"
            }
          />
          <TextField
            value={condition.bet}
            onChange={(e) => handleInputChange(e, index, "bet")}
            error={isSubmitted && condition.bet === ""}
            helperText={
              isSubmitted && condition.bet === "" && "Please enter a bet"
            }
          />
          <Button
            variant="contained"
            onClick={() => handleRemoveCondition(index)}
          >
            Remove
          </Button>
        </Box>
      ))}
      <Button variant="contained" onClick={handleAddCondition}>
        Add+
      </Button>
      <Button variant="contained" color="secondary" onClick={handleSubmit}>
        Submit
      </Button>
    </Box>
  );
}

export default NewRequest;
