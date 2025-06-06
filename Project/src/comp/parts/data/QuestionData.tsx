import axios from "axios";
import { useEffect, useState } from "react";
import config from "../../../config";
import CreateQues from "./CreateQues";

interface QuesData {
  id: number;
  ques: string;
  ans: string;
  questTypeId: number;
  statusId: number;
}

const QuestionData = () => {
  const [data, setData] = useState<QuesData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [singleQuestion, setSingleQuestion] = useState<boolean>(true);
  const [cQ, setCQ] = useState<string>("0");

  const link =
    "https://th.bing.com/th/id/OIP.vUmLIizCzBTpywBUvchoDgHaHa?rs=1&pid=ImgDetMain";

  const loadData = async () => {
    const rs = await axios.get(`${config.API_BASE_URL}getAllQuestions`, {
      headers: {
        Authorization: `Basic ${config.ACC_CODE}`,
      },
    });
    setData(rs.data);
    console.log(rs.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const paginate = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <div className="container-fluid">
        <div className="d-md-flex justify-content-between m-3 ">
          <div>
            <h4 className="h4">Questions</h4>
          </div>
          <div className="d-md-block d-flex justify-content-center">
            <button
              className="btn btn-warning me-2"
              data-bs-toggle="modal"
              data-bs-target="#staticBackdrop"
            >
              <i className="bi bi-file-earmark-plus me-2"></i> Create New
              Question
            </button>
          </div>
        </div>
        <div className="shadow-sm rounded-3 bg-white m-4 col p-3">
          {cQ === "0" ? (
            <>
              <div className="row justify-content-center mb-2">
                {currentItems.map((data, index) => (
                  <div
                    className="card m-3 shadow-sm "
                    style={{ width: "12rem" }}
                    key={index}
                  >
                    <div
                      className="d-flex justify-content-center text-center border border-2 bg-secondary-subtle rounded-2 mt-3"
                      style={{ height: "10rem" }}
                    >
                      <img src={link} className="card-img-top" alt="..." />
                    </div>
                    <div className="card-body">
                      <h5 className="card-title text-center">
                        No :00{data.id}
                      </h5>
                      <h5 className="card-text fw-medium fs-6">
                        {" "}
                        {data.ques.slice(0, 18)}{" "}
                      </h5>
                    </div>
                    <div className="d-flex justify-content-between px-3 mb-2">
                      <button
                        className="btn text-danger navbar-toggler"
                        style={{ fontSize: "22px" }}
                      >
                        <span className="fa-solid fa-trash-can"> </span>
                      </button>
                      <button
                        className="btn text-success navbar-toggler"
                        style={{ fontSize: "30px" }}
                      >
                        <span className="bi bi-toggle-on"> </span>
                      </button>
                      <button
                        className="btn text-primary-emphasis"
                        style={{ fontSize: "25px" }}
                        onClick={() => {
                          setCQ(data.id.toString());
                        }}
                      >
                        <span className="fa-solid fa-arrow-alt-circle-right">
                          {" "}
                        </span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="d-flex justify-content-center">
                <nav aria-label="Page navigation ">
                  <ul className="pagination">
                    {/* Previous Button */}
                    <li
                      className={`page-item ${
                        currentPage === 1 ? "disabled" : ""
                      }`}
                    >
                      <a
                        className="page-link text-dark"
                        href="#"
                        aria-label="Previous"
                        onClick={() => paginate(currentPage - 1)}
                      >
                        <span aria-hidden="true">&laquo;</span>
                      </a>
                    </li>

                    {/* Page Numbers */}
                    {Array.from({ length: totalPages }, (_, i) => (
                      <li
                        key={i + 1}
                        className={`page-item ${
                          currentPage === i + 1 ? "active" : ""
                        }`}
                      >
                        <a
                          className="page-link text-dark"
                          href="#"
                          onClick={() => paginate(i + 1)}
                        >
                          {i + 1}
                        </a>
                      </li>
                    ))}

                    {/* Next Button */}
                    <li
                      className={`page-item ${
                        currentPage === totalPages ? "disabled" : ""
                      }`}
                    >
                      <a
                        className="page-link text-dark"
                        href="#"
                        aria-label="Next"
                        onClick={() => paginate(currentPage + 1)}
                      >
                        <span aria-hidden="true">&raquo;</span>
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </>
          ) : (
            <CreateQues quesId={cQ}></CreateQues>
          )}
        </div>
      </div>
    </>
  );
};

export default QuestionData;
