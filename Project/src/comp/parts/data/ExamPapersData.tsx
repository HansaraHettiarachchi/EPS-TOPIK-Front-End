import React, { useState } from "react";
import PaperDetailsT from "./exams/PaperDetailsT";
import CreatePaper from "./exams/CreatePaper"; 
import { Link } from "react-router-dom";

type ComponentKey = "PaperDetailsT" | "CreatePaper";

const components: Record<ComponentKey, React.ComponentType> = {
  PaperDetailsT,
  CreatePaper, 
};

const ExamPapersData: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState<ComponentKey>("CreatePaper");
  const CurrentComponent = components[activeComponent];

  return (
    <div className="container-fluid">
      <div className="d-md-flex justify-content-between m-3">
        <div>
          <h4 className="h4">Create New Paper</h4>
        </div>
        <div className="d-md-block d-flex justify-content-center">
          <Link
          to="/newquestion"
            className="btn btn-outline-dark me-2"
            onClick={() => setActiveComponent("CreatePaper")}
          >
            <i className="bi bi-file-earmark-plus me-2"></i> Create New Question
          </Link>
          {/* <button
            className="btn btn-primary me-2"
            onClick={() => setActiveComponent("PaperDetailsT")}
          >
            <i className="bi bi-list me-2"></i> View Papers
          </button> */}
        </div>
      </div>
      <div className="shadow-sm rounded-3 bg-white m-4 col">
        <CurrentComponent />
      </div>
    </div>
  );
};

export default ExamPapersData;