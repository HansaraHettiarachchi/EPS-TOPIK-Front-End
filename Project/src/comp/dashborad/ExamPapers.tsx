import Sidebar from "../parts/Sidebar";
import Header from "../parts/Header";
import ExamPapersData from "../parts/data/ExamPapersData";

const ExamPapers = () => {

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
          <Header htmlElement={ExamPapersData} />
        </div>
      </div>
    </>
  );
};

export default ExamPapers;
