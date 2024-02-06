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
  Grid,
  Paper,
  Box,
} from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import ErrorIcon from "@mui/icons-material/Error";
import {
  GameResult,
  SimulateRequestHistory,
  StatusMessage,
} from "../models/blackjackTypes";
import CircularProgressWithLabel from "../components/LoadingIcon";

interface DashboardProps {
  refreshDashboard: number;
}

function Dashboard({ refreshDashboard }: DashboardProps) {
  const [results, setResults] = useState(new Map<string, GameResult>());
  const [allRequests, setAllRequest] = useState<SimulateRequestHistory[]>([]);
  const [selectedRequest, setSelectedRequest] =
    useState<SimulateRequestHistory>();
  const [nonCompleteUuids, setNonCompleteUuids] = useState<string[]>([]);
  const [uuidStatusMap, setUuidStatusMap] = useState(new Map<string, string>());

  useEffect(() => {
    console.log("refresh uuid");
    const fetchAllTrackingUuid = async () => {
      try {
        const results = await getAllRequests();
        setAllRequest(results);
        setNonCompleteUuids(results.map((request) => request.trackingUuid));
      } catch (error) {
        console.error(`Failed to fetch tracking UUIDs: ${error}`);
      }
    };

    fetchAllTrackingUuid();
  }, [refreshDashboard]);

  useEffect(() => {
    const fetchAllSimulateResult = async () => {
      try {
        const resultMap = new Map(results);
        console.log("trying to fetch");
        await Promise.all(
          allRequests
            .filter(
              (request) =>
                !results.get(request.trackingUuid) &&
                uuidStatusMap.get(request.trackingUuid) ===
                  StatusMessage.COMPLETED.toString()
            )
            .map(async (request) => {
              const result = await getSimulateResult(request.trackingUuid);
              resultMap.set(request.trackingUuid, result);
            })
        );
        setResults(resultMap);
      } catch (error) {
        console.error(`Failed to fetch tracking UUIDs: ${error}`);
      }
    };

    fetchAllSimulateResult();
  }, [nonCompleteUuids]);

  useEffect(() => {
    const fetchSimulateRequestStatus = async () => {
      if (nonCompleteUuids.length === 0) return;
      const simulateStatus = await getBatchSimulateStatus(nonCompleteUuids);
      const newNonCompletedList = Object.entries(simulateStatus)
        .filter(
          ([, value]) =>
            value !== StatusMessage.COMPLETED.toString() &&
            value !== StatusMessage.FAILURE.toString()
        )
        .map(([key]) => key);
      setNonCompleteUuids(newNonCompletedList);
      const newUuidStatusMap = new Map(uuidStatusMap);
      for (const [key, value] of Object.entries(simulateStatus)) {
        newUuidStatusMap.set(key, value);
      }
      setUuidStatusMap(newUuidStatusMap);
    };

    const intervalId = setInterval(() => {
      fetchSimulateRequestStatus();
    }, 1000);

    return () => clearInterval(intervalId); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  });

  function getLastGameRecord(gameResult: GameResult | undefined) {
    if (!gameResult) {
      return undefined;
    }
    return gameResult.gameRecords[gameResult.gameRecords.length - 1];
  }

  function getLoadingOrCompleteIcon(progress: string | undefined) {
    if (progress === undefined) return null;
    if (progress === StatusMessage.COMPLETED.toString()) {
      return <DoneIcon />;
    } else if (progress === StatusMessage.FAILURE.toString()) {
      return <ErrorIcon />;
    } else {
      return (
        <CircularProgressWithLabel value={Number(progress?.slice(0, -1))} />
      );
    }
  }

  function getDateTime(timestamp: number | undefined) {
    console.log(timestamp);
    if (timestamp === undefined) {
      return "N/A";
    } else {
      return new Date(timestamp).toLocaleString();
    }
  }

  return (
    <>
      {" "}
      {/* You can adjust the elevation prop to control the depth of the paper */}
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Paper elevation={3}>
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
                  {allRequests
                    .sort((a, b) => {
                      const timeA = a.creationTimeStamp;
                      const timeB = b.creationTimeStamp;

                      if (timeA === undefined) return -1;
                      if (timeB === undefined) return 1;

                      return timeB - timeA; // For descending order
                    })
                    .map((request) => (
                      <TableRow
                        key={request.trackingUuid}
                        onClick={() => {
                          setSelectedRequest(request);
                        }}
                        style={{
                          background:
                            selectedRequest?.trackingUuid ===
                            request.trackingUuid
                              ? "#f0f0f0"
                              : "",
                        }}
                      >
                        <TableCell>{request.trackingUuid}</TableCell>
                        <TableCell>
                          {getLoadingOrCompleteIcon(
                            uuidStatusMap.get(request.trackingUuid)
                          )}
                        </TableCell>
                        <TableCell>{request.numOfGame}</TableCell>
                        <TableCell>
                          {
                            getLastGameRecord(
                              results?.get(request.trackingUuid)
                            )?.playerAfterGameAsset
                          }
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper elevation={3}>
            {selectedRequest && (
              <>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Creation Time</TableCell>
                        <TableCell>request</TableCell>
                        <TableCell>numOfDecks</TableCell>
                        <TableCell>cutOff</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow key={2}>
                        <TableCell>
                          {getDateTime(selectedRequest.creationTimeStamp)}
                        </TableCell>
                        <TableCell>
                          <Box>
                            ß
                            {selectedRequest?.customPlayerBetStrategies.map(
                              (s, index) => (
                                <div key={index}>
                                  {`${s.leftValue} ${s.comparisonOperator} ${s.rightValue} bet: ${s.bet}`}
                                </div>
                              )
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>{selectedRequest.numOfDecks}</TableCell>
                        <TableCell>{selectedRequest.cutOff}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
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
                        ?.get(selectedRequest?.trackingUuid)
                        ?.gameRecords.flatMap((record, index) =>
                          record.playerAllHands.map((hand, handIndex) => (
                            <TableRow key={`${index}-${handIndex}`}>
                              <TableCell component="th" scope="row">
                                {record.gameNumber}
                              </TableCell>
                              <TableCell>{hand.cards}</TableCell>
                              <TableCell>{record.dealer.cards}</TableCell>
                              <TableCell>{record.results}</TableCell>
                              <TableCell>
                                {record.playerAfterGameAsset}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}

export default Dashboard;
