import NewQuestionData from "../parts/data/NewQuestionData";
import Header from "../parts/Header";
import Sidebar from "../parts/Sidebar";

const NewQuestion = () => {
  return (
    <div
      className="container-fluid rounded-2"
      style={{
        padding: "0",
        margin: "0",
      }}
    >
      <div className="d-flex col">
        <Sidebar></Sidebar>
        <Header htmlElement={NewQuestionData} />
      </div>
    </div>
  );
};

export default NewQuestion;
