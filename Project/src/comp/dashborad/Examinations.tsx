import ExamData from "../parts/data/ExamData";
import Header from "../parts/Header";
import Sidebar from "../parts/Sidebar";

const Examinations = () => {
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
          <Header htmlElement={ExamData} />
        </div>
      </div>
    </>
  );
};

export default Examinations;
