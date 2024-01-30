import { useEffect, useState } from "react";
import {
  getAllRequests,
  getSimulateResult,
  getBatchSimulateStatus,
} from "../controllers/BlackjackHttpController";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { GameResult } from "../models/blackjackTypes";

function Dashboard() {
  const [results, setResults] = useState(new Map<string, GameResult>());
  const [trackingUuids, setTrackingUuids] = useState<string[]>([]);
  const [selectedTrackingUuid, setSelectedTrackingUuid] = useState<string>();
  const [nonCompleteUuids, setNonCompleteUuids] = useState<string[]>([]);
  const [uuidStatusMap, setUuidStatusMap] = useState(new Map<string, string>());
  const [requestMap, setRequestMap] = useState(new Map<string, any>());

  useEffect(() => {
    const fetchAllTrackingUuid = async () => {
      try {
        const results = await getAllRequests();
        console.log(results);
        setRequestMap(results);
        setTrackingUuids(Array.from(results.keys()));
        setNonCompleteUuids(Array.from(results.keys()));
      } catch (error) {
        console.error(`Failed to fetch tracking UUIDs: ${error}`);
      }
    };

    fetchAllTrackingUuid();
  }, []);

  useEffect(() => {
    const fetchAllTrackingUuidResult = async () => {
      try {
        const resultMap = new Map(results);
        await Promise.all(
          trackingUuids
            .filter(
              (uuid) =>
                !results.get(uuid) && uuidStatusMap.get(uuid) === "completed"
            )
            .map(async (trackingUuid) => {
              const result = await getSimulateResult(trackingUuid);
              resultMap.set(trackingUuid, result);
            })
        );
        setResults(resultMap);
      } catch (error) {
        console.error(`Failed to fetch tracking UUIDs: ${error}`);
      }
    };

    fetchAllTrackingUuidResult();
  }, [trackingUuids, nonCompleteUuids]);

  useEffect(() => {
    const fetchSimulateResult = async () => {
      if (nonCompleteUuids.length === 0) return;
      console.log(nonCompleteUuids);
      const simulateResults = await getBatchSimulateStatus(nonCompleteUuids);
      const newNonCompletedList = Object.entries(simulateResults)
        .filter(([, value]) => value !== "completed")
        .map(([key]) => key);
      setNonCompleteUuids(newNonCompletedList);
      const newUuidStatusMap = new Map(uuidStatusMap);
      for (const [key, value] of Object.entries(simulateResults)) {
        newUuidStatusMap.set(key, value);
      }
      setUuidStatusMap(newUuidStatusMap);
    };

    const intervalId = setInterval(() => {
      fetchSimulateResult();
    }, 1000);

    return () => clearInterval(intervalId); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  });

  function getLastGameRecord(gameResult: GameResult | undefined) {
    if (!gameResult) {
      return undefined;
    }
    return gameResult.gameRecords[gameResult.gameRecords.length - 1];
  }

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>UUIDs</TableCell>
              <TableCell>status</TableCell>
              <TableCell>Game number</TableCell>
              <TableCell>Final asset</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {trackingUuids.map((uuid) => (
              <TableRow key={uuid}>
                <TableCell
                  onClick={() => {
                    setSelectedTrackingUuid(uuid);
                  }}
                >
                  {uuid}
                </TableCell>
                <TableCell>{uuidStatusMap.get(uuid)}</TableCell>
                <TableCell>{requestMap.get(uuid).numOfGame}</TableCell>
                <TableCell>
                  {getLastGameRecord(results?.get(uuid))?.playerAfterGameAsset}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {selectedTrackingUuid && (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Game</TableCell>
                <TableCell>Player</TableCell>
                <TableCell>Dealer</TableCell>
                <TableCell>Result</TableCell>
                <TableCell>Player after game asset</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {results
                ?.get(selectedTrackingUuid)
                ?.gameRecords.flatMap((record, index) =>
                  record.playerAllHands.map((hand, handIndex) => (
                    <TableRow key={`${index}-${handIndex}`}>
                      <TableCell component="th" scope="row">
                        {record.gameNumber}
                      </TableCell>
                      <TableCell>{hand.cards}</TableCell>
                      <TableCell>{record.dealer.cards}</TableCell>
                      <TableCell>{record.results}</TableCell>
                      <TableCell>{record.playerAfterGameAsset}</TableCell>
                    </TableRow>
                  ))
                )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
}

export default Dashboard;
