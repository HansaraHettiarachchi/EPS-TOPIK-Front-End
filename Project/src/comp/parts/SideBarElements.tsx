
import { Link, useLocation } from "react-router-dom";

const items = [
  { name: "Dashboard", path: "/dashboard", icon: "bi bi-speedometer2" },
  {
    name: "Examinations",
    path: "/examinations",
    icon: "fa-regular fa-newspaper",
  },
  { name: "Exam Papers", path: "/exam-papers", icon: "bi bi-pencil-square" },
  { name: "Questions", path: "/questions", icon: "bi bi-patch-question" },
  { name: "NewQuestions", path: "/newquestion", icon: "bi bi-patch-question" },
  { name: "Students", path: "/students", icon: "fa-solid fa-graduation-cap" },
];

const SideBarElements = () => {
  const location = useLocation();
  return (
    <>
      <ul className="nav nav-pills flex-column mb-auto">
        {items.map((item, key) => (
          <li className="nav-item" key={key}>
            <Link
              style={{ fontSize: "17px" }}
              to={item.path}
              className={`nav-link mb-2 fw-semibold ${
                location.pathname === item.path
                  ? "customActiveLi text-light"
                  : "text-secondary"
              }`}
            >
              <i className={`${item.icon} me-2`}></i>
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};

export default SideBarElements;
