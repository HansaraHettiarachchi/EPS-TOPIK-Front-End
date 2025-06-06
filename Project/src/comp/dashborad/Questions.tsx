import Sidebar from "../parts/Sidebar";
import Header from "../parts/Header";
import QuestionData from "../parts/data/QuestionData";

const Questions = () => {
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
          <Header htmlElement={QuestionData}/>
        </div>
      </div>
    </>
  );
};

export default Questions;
