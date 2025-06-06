import StudentData from "../parts/data/StudentData";
import Header from "../parts/Header";
import Sidebar from "../parts/Sidebar";

const Students = () => {
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
          <Header htmlElement={StudentData} />
        </div>
      </div>
    </>
  );
};
export default Students;
