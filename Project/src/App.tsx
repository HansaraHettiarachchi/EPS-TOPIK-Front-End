import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./comp/dashborad/Dashboard";
import ExamPapers from "./comp/dashborad/ExamPapers";
// import SideBarElements from "./comp/parts/SideBarElements";
import Students from "./comp/dashborad/Students";
import Examinations from "./comp/dashborad/Examinations";
import Questions from "./comp/dashborad/Questions";
import NewQuestion from "./comp/dashborad/NewQuestion";
import PaperStruc from "./comp/parts/data/exams/PaperStruc";
import Sign from "./comp/signUpIn/sign";

function App() {
  return (
    <BrowserRouter>
      <div className="container-fluid" style={{ padding: "0", margin: "0" }}>
        {/* <SideBarElements /> */}
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/examinations" element={<Examinations />} />
          <Route path="/exam-papers" element={<ExamPapers />} />
          <Route path="/questions" element={<Questions />} />
          <Route path="/newquestion" element={<NewQuestion />} />
          <Route path="/students" element={<Students />} />
          <Route path="/paperstruc" element={<PaperStruc  />} />
          <Route path="/sign" element={<Sign />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
        {/* <div className="flex-grow-1 ">
        </div> */}
      </div>
    </BrowserRouter>
  );
}

export default App;
