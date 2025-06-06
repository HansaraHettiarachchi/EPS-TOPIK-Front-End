import Sidebar from "../parts/Sidebar";
import Header from "../parts/Header";
import DashboardData from "../parts/data/DashboardData";

const Dashboard = () => {
  return (
    <>
      <div
        className="container-fluid rounded-2"
        style={{
          padding: "0",
          margin: "0",
        }}
      >
        <div className="d-flex col">
          <Sidebar></Sidebar>
          <Header htmlElement={DashboardData}/>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
