import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import config from "../../../../config";

type paper = {
  id: number;
  paperName: string;
};

type User = {
  id: number;
  index: number;
  firstName: string;
  lastName: string;
};

type lData = {
  id: number;
  name: string;
};

type FormData = {
  exId: string;
  exName: string;
  dFrom: string;
  dTo: string;
  paperId: number;
  paperName: string;
  students: User[];
};

type Errors = {
  exId?: string;
  exName?: string;
  dFrom?: string;
  dTo?: string;
  paperId?: string;
  students?: string;
};

const NewExam = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [paperDetails, setPaperDetails] = useState<paper[]>([]);
  const [classes, setClasses] = useState<lData[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [pName, setPName] = useState<paper>({ id: 0, paperName: "" });
  const [students, setStudents] = useState<User[]>([]);
  const [formData, setFormData] = useState<FormData>({
    exId: "",
    exName: "",
    dFrom: "",
    dTo: "",
    paperId: 0,
    paperName: "",
    students: [],
  });
  const [errors, setErrors] = useState<Errors>({});

  const loadData = async () => {
    try {
      const classesD = await axios.get(config.API_USER_URL + "getClasses", {
        headers: {
          Authorization: `Basic ${config.ACC_CODE}`,
        },
      });
      setClasses(classesD.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getStuData = async (cId: number) => {
    try {
      const stuD = await axios.get(
        config.API_USER_URL + "getUserData?classesId=" + cId,
        {
          headers: {
            Authorization: `Basic ${config.ACC_CODE}`,
          },
        }
      );
      setStudents(stuD.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadData();
    getStuData(0);
  }, []);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsDropdownOpen(false);
    }
  };

  const getData = async (data: string) => {
    try {
      const rs = await axios(config.API_BASE_URL + "getPaperD?text=" + data, {
        headers: {
          Authorization: `Basic ${config.ACC_CODE}`,
        },
      });
      if (rs.status === 200) {
        setPaperDetails(rs.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const debounce = (func: Function, delay: number) => {
    let timeoutId: number;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay) as unknown as number;
    };
  };

  const debouncedFetchSuggestions = debounce(getData, 300);

  const handelInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });

    // Clear the related error when the user starts typing
    setErrors((prevErrors) => ({ ...prevErrors, [id]: "" }));

    if (id === "paperName") {
      let p = { ...pName };
      p.id = 0;
      p.paperName = value;
      setPName(p);
      debouncedFetchSuggestions(value);
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    getStuData(parseInt(value));
  };

  const validateForm = () => {
    const newErrors: Errors = {};
    if (!formData.exId) newErrors.exId = "Exam ID is required";
    if (!formData.exName) newErrors.exName = "Exam Name is required";
    if (!formData.dFrom) newErrors.dFrom = "Start date is required";
    if (!formData.dTo) newErrors.dTo = "End date is required";
    if (!pName.id) newErrors.paperId = "Paper is required";
    if (students.length === 0)
      newErrors.students = "At least one student is required";

    if (formData.exId.length > 20)
      newErrors.exId = "Exam ID must not exceed 20 characters";
    if (formData.exName.length > 45)
      newErrors.exName = "Exam Name must not exceed 45 characters";

    const today = new Date();
    const fromDate = new Date(formData.dFrom);
    const toDate = new Date(formData.dTo);

    if (fromDate <= today) newErrors.dFrom = "Start date must be after today";
    if (toDate <= today) newErrors.dTo = "End date must be after today";
    if (fromDate >= toDate) newErrors.dTo = "End date must be after start date";

    const timeDifference =
      (toDate.getTime() - fromDate.getTime()) / (1000 * 60);
    if (timeDifference < 70)
      newErrors.dTo =
        "There must be at least 70 minutes between start and end dates";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      ...formData,
      paperId: pName.id,
      paperName: pName.paperName,
      students: students,
    };

    console.log(JSON.stringify(payload));

    try {
      const response = await axios.post(
        config.API_BASE_URL + "scheduleExam",
        payload,
        {
          headers: {
            Authorization: `Basic ${config.ACC_CODE}`,
          },
        }
      );

      response.status == 200
        ? alert(response.data)
        : response.status == 400
        ? alert(response.data.message)
        : alert("Opperation Unsuccessful");

      console.log("Exam scheduled successfully:", response.data);
    } catch (error) {
      console.error("Failed to schedule exam:", error);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="py-4">
      <h5 className="fw-semibold mb-4 h4">Schedule New Exam</h5>
      <form className="row g-3 px-3" onSubmit={handleSubmit}>
        <div className="col-md-6">
          <label htmlFor="exId" className="form-label">
            Exam ID
          </label>
          <input
            type="text"
            className={`form-control ${errors.exId ? "is-invalid" : ""}`}
            id="exId"
            value={formData.exId}
            onChange={handelInputChange}
          />
          {errors.exId && <div className="invalid-feedback">{errors.exId}</div>}
        </div>
        <div className="col-md-6">
          <label htmlFor="exName" className="form-label">
            Exam Name
          </label>
          <input
            type="text"
            className={`form-control ${errors.exName ? "is-invalid" : ""}`}
            id="exName"
            value={formData.exName}
            onChange={handelInputChange}
          />
          {errors.exName && (
            <div className="invalid-feedback">{errors.exName}</div>
          )}
        </div>

        <label htmlFor="availability" className="fw-bold">
          Availability
        </label>
        <div className="col-6" id="availability">
          <label htmlFor="dFrom" className="form-label">
            From
          </label>
          <input
            type="datetime-local"
            className={`form-control ${errors.dFrom ? "is-invalid" : ""}`}
            id="dFrom"
            value={formData.dFrom}
            onChange={handelInputChange}
          />
          {errors.dFrom && (
            <div className="invalid-feedback">{errors.dFrom}</div>
          )}
        </div>
        <div className="col-6" id="availability">
          <label htmlFor="dTo" className="form-label">
            To
          </label>
          <input
            type="datetime-local"
            className={`form-control ${errors.dTo ? "is-invalid" : ""}`}
            id="dTo"
            value={formData.dTo}
            onChange={handelInputChange}
          />
          {errors.dTo && <div className="invalid-feedback">{errors.dTo}</div>}
        </div>

        <div className="col">
          <label htmlFor="inputState" className="form-label fw-bold">
            Select Paper
          </label>
          <div className="input-group">
            <input
              type="text"
              id="paperName"
              className={`form-control ${errors.paperId ? "is-invalid" : ""}`}
              placeholder="Question Number or Question"
              aria-label="Question Number or Question"
              aria-describedby="button-addon2"
              value={pName.paperName}
              onChange={handelInputChange}
              onFocus={() => setIsDropdownOpen(true)}
            />
          </div>
          {isDropdownOpen && (
            <div className="col-12 dropdown" ref={dropdownRef}>
              <div className="border border-1 p-2 col-12 bg-light dropdown-menu show">
                <div className="d-block mt-1 text-secondary">
                  {paperDetails.map((item) => (
                    <div
                      className="row px-3 "
                      key={item.id}
                      onClick={() => {
                        setPName({
                          id: item.id,
                          paperName: item.paperName,
                        });
                        setIsDropdownOpen(false);
                        setErrors((prevErrors) => ({
                          ...prevErrors,
                          paperId: "",
                        }));
                      }}
                    >
                      <h5 className="h6 rounded-2 py-2 cursor-pointer currentActive">
                        {item.id} : {item.paperName}
                      </h5>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {errors.paperId && (
            <div className="invalid-feedback">{errors.paperId}</div>
          )}
        </div>

        <div className="col-12">
          <h5 className="h6 fw-bold mb-3">Select Students</h5>
          <div className="card mb-4">
            <div className="card-header d-flex justify-content-between ">
              <h6 className="mt-auto">
                <i className="fas fa-table me-2"></i> Students
              </h6>
              <div>
                <div className="input-group ">
                  <label
                    className="input-group-text"
                    htmlFor="inputGroupSelect02"
                  >
                    Order By
                  </label>
                  <select
                    className="form-select"
                    id="inputGroupSelect02"
                    onChange={handleSelectChange}
                  >
                    <option value="0">All</option>
                    {classes.map((item) => (
                      <option value={item.id} key={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="card-body bg-light">
              {/* <div className="mb-3">
                <div className=" d-flex justify-content-end">
                  <div className="">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Paper Name or Paper ID"
                        aria-label="Paper Name or ID"
                        aria-describedby="button-addon2"
                      />
                      <button
                        className="btn btn-warning"
                        type="button"
                        id="button-addon2"
                      >
                        <i className="fa-solid fa-magnifying-glass"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div> */}
              <div className="table-responsive">
                <table id="" className="table  table-striped table-hover">
                  <thead>
                    <tr className="table-secondary ">
                      <th>No.</th>
                      <th>Student Id</th>
                      <th>Student Name</th>
                      <th className="text-center">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((item, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td className="d-none">{item.id}</td>
                        <td>{item.index}</td>
                        <td>{item.firstName + " " + item.lastName}</td>
                        <td className="d-flex justify-content-center">
                          <button
                            className="btn text-danger navbar-toggler me-4 cursor-pointer"
                            style={{ fontSize: "22px" }}
                            onClick={() => {
                              setStudents((prev) =>
                                prev.filter(
                                  (student) => student.index !== item.index
                                )
                              );
                              setErrors((prevErrors) => ({
                                ...prevErrors,
                                students: "",
                              }));
                            }}
                          >
                            <span className="fa-solid fa-xmark"> </span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="d-flex justify-content-center">
                <nav aria-label="Page navigation ">
                  <ul className="pagination">
                    <li className="page-item ">
                      <a
                        className="page-link text-dark"
                        href="#"
                        aria-label="Previous"
                      >
                        <span aria-hidden="true">&laquo;</span>
                      </a>
                    </li>
                    <li className="page-item">
                      <a className="page-link text-dark" href="#">
                        1
                      </a>
                    </li>
                    <li className="page-item">
                      <a className="page-link text-dark" href="#">
                        2
                      </a>
                    </li>
                    <li className="page-item">
                      <a className="page-link text-dark" href="#">
                        3
                      </a>
                    </li>
                    <li className="page-item">
                      <a
                        className="page-link text-dark"
                        href="#"
                        aria-label="Next"
                      >
                        <span aria-hidden="true">&raquo;</span>
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 d-flex justify-content-end">
          <button type="submit" className="btn btn-primary">
            Schedule Exam
          </button>
        </div>
      </form>
    </div>
  );
};
export default NewExam;
