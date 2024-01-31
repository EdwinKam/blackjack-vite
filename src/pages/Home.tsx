import { useState } from "react";
import Dashboard from "../sections/Dashboard";
import NewRequest from "../sections/NewRequest";

function Home() {
  const [refreshDashboard, setRefreshDashboard] = useState<number>(0);
  return (
    <>
      <NewRequest setRefreshDashboard={setRefreshDashboard} />
      <Dashboard refreshDashboard={refreshDashboard} />
    </>
  );
}

export default Home;
