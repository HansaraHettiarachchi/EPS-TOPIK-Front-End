import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import config from "../../../../config";

interface QTypeD {
  id?: number;
  name?: string;
}

type Question = {
  id: number;
  ques: string;
  ans: string;
  questTypeId: number;
  statusId: number;
};

type HardQues = {
  qId: number;
  isHQ: boolean;
};

type Time = {
  qId: number;
  time: string;
};

type FormData = {
  question: Question;
  qdifficultyId: number;
  time: string;
};

const CreatePaper = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [text, setText] = useState<string>("");
  const [sQType, setSQType] = useState<number>(1);
  const [qTypeData, setQTypeData] = useState<QTypeD[]>([]);
  const [qData, setQData] = useState<Question[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [paperName, setPaperName] = useState<string>("");
  const [hardQuestions, setHardQuestions] = useState<HardQues[]>([]);
  const [time, setTime] = useState<Time[]>([]);
  const [errors, setErrors] = useState<number[]>([]);

  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);

  const checkIfQuestionExists = (newQuestion: Question): boolean => {
    return selectedQuestions.some(
      (question) =>
        question.id === newQuestion.id &&
        question.ques === newQuestion.ques &&
        question.ans === newQuestion.ans &&
        question.questTypeId === newQuestion.questTypeId &&
        question.statusId === newQuestion.statusId
    );
  };

  const link =
    "https://th.bing.com/th/id/OIP.vUmLIizCzBTpywBUvchoDgHaHa?rs=1&pid=ImgDetMain";

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsDropdownOpen(false);
    }
  };

  const getQTypeData = async () => {
    try {
      const rs = await axios.get(config.API_BASE_URL + "getQType", {
        headers: {
          Authorization: `Basic ${config.ACC_CODE}`,
        },
      });

      if (rs.status === 200) {
        setQTypeData(rs.data);
      } else {
        alert("An error occurred during the process.");
      }
    } catch (error) {
      console.log(error);
      console.log("Failed to fetch question types. Please try again later.");
    }
  };

  useEffect(() => {
    getQTypeData();
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { id, value } = e.target;

    if (id == "qTypeId") {
      setSQType(parseInt(value, 10));
      setText("");
      setQData([]);
    }
  };

  const debounce = (func: Function, delay: number) => {
    let timeoutId: number;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay) as unknown as number;
    };
  };

  const fetchSuggestions = async (text: string) => {
    if (!text) {
      setIsDropdownOpen(true);
      setQData([]);
      return;
    }

    try {
      const rs = await axios(
        config.API_BASE_URL +
          "getAllQuesByQues?ques=" +
          text +
          "&qType=" +
          sQType,
        {
          headers: {
            Authorization: `Basic ${config.ACC_CODE}`,
          },
        }
      );

      if (rs.status == 200) {
        setQData(rs.data);
        rs.data.length > 0 && setIsDropdownOpen(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const debouncedFetchSuggestions = debounce(fetchSuggestions, 300);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(sQType);
    setText(e.target.value);
    debouncedFetchSuggestions(e.target.value);
  };

  const removeques = (index: number) => {
    setSelectedQuestions((prevquess) =>
      prevquess.filter((_, i) => i !== index)
    );
  };

  const handleClick = (ques: Question) => {
    if (!checkIfQuestionExists(ques)) {
      const arr = [...selectedQuestions];

      arr.push(ques);
      setSelectedQuestions(arr);
    }
  };

  const handleInputTimeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    qId: number
  ) => {
    let inputValue = e.target.value.replace(/\D/g, ""); // Remove non-digit characters

    if (inputValue.length > 2) {
      inputValue = `${inputValue.slice(0, 2)}:${inputValue.slice(2, 4)}`;
    }

    setTime((prevTime) => {
      const existingIndex = prevTime.findIndex((t) => t.qId === qId);
      const newTime: Time = { qId, time: inputValue };

      if (existingIndex !== -1) {
        const updatedTime = [...prevTime];
        updatedTime[existingIndex] = newTime;
        return updatedTime;
      } else {
        return [...prevTime, newTime];
      }
    });

    setErrors([]);
  };

  const handleBtnClick = async () => {
    const formData = {
      paperName: paperName,
      data: makeReadyFormData(),
    };

    if (!validate()) {
      console.log(JSON.stringify(time, null, 2));

      try {
        const response = await axios.post(
          config.API_BASE_URL + "setPaper",
          formData,
          {
            headers: {
              Authorization: `Basic ${config.ACC_CODE}`,
            },
          }
        );
        console.log(response);
        console.log(response.data);

        if (response.status === 200) {
          alert(response.data);
        } else if (response.status === 202) {
          alert(response.data);
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        alert("An error occurred while submitting the form.");
      }
    }
  };

  const convertToSqlTime = (timeString: string): string => {
    if (!timeString) return "00:00:00";
    const [minutes, seconds] = timeString.split(":").map(Number);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${String(hours).padStart(2, "0")}:${String(
      remainingMinutes
    ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const makeReadyFormData = (): FormData[] => {
    let readyQData: FormData[] = [];

    selectedQuestions.map((q) => {
      let i = 1;
      if (hardQuestions.filter((cq) => cq.qId == q.id && cq.isHQ).length == 1) {
        i = 2;
      }

      let t = time.findIndex((t) => t.qId === q.id);
      let duration = "";

      t == -1
        ? (duration = "00:00:00")
        : (duration = convertToSqlTime(time[t].time));

      readyQData.push({ question: q, qdifficultyId: i, time: duration });
    });

    return readyQData;
  };

  const quesCount = (qType: number): number => {
    let i = 0;
    selectedQuestions
      .filter((q) => q.questTypeId == qType)
      .map((q) => {
        hardQuestions.filter((cq) => cq.isHQ && cq.qId === q.id && i++);
      });
    return i;
  };

  const sumTime = (timeArray: { qId: number; time: string }[]): string => {
    const totalSeconds = timeArray.reduce((acc, { time }) => {
      const [minutes, seconds] = time.split(":").map(Number);
      return acc + minutes * 60 + seconds;
    }, 0);

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  const validate = (): boolean => {
    let rQCount = 0;
    let lQCount = 0;

    selectedQuestions.forEach((ques) => {
      if (ques.questTypeId === 1) {
        rQCount++;
      } else {
        lQCount++;
      }
    });

    const rQ = quesCount(1);
    const lQ = quesCount(2);

    if (!paperName) {
      alert("Please enter Name for Paper");
    }
    if (!/^[ㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z0-9\s{}.,\/()_+\-=?]+$/.test(paperName)) {
      alert("Paper Name Contains unnessary Charactors");
    }
    if (rQCount != 20) {
      alert("There should be 20 Reading Questions");
      return false;
    }
    if (lQCount != 20) {
      alert("There should be 20 Listening Questions");
      return false;
    }
    if (rQ != 10) {
      alert(
        "There should be 10 Hard Reading question and you have selected " + rQ
      );
      return false;
    }
    if (lQ != 10) {
      alert(
        "There should be 10 Hard Listening question and you have selected " + lQ
      );
      return false;
    }

    time.forEach((t) => {
      const regex = /^([0-5][0-9]):([0-5][0-9])$/;

      !regex.test(t.time) &&
        setErrors(() => {
          const err = [...errors];
          err.push(t.qId);
          return err;
        });
    });

    if (errors.length > 0) {
      return false;
    }

    const t = sumTime(time);

    if (t !== "25:00") {
      alert(
        "The total of audio length should be 25 minutes and current is :" +
          t +
          " minutes"
      );
      return false;
    }

    return rQCount == 20 && lQCount == 20;
  };

  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>, qId: number) => {
    const updatedQuestions = [...hardQuestions];
    const existingIndex = updatedQuestions.findIndex((q) => q.qId === qId);

    const updatedQuestion: HardQues = {
      qId: qId,
      isHQ: e.target.checked,
    };

    if (existingIndex !== -1) {
      updatedQuestions.splice(existingIndex, 1, updatedQuestion);
    } else {
      updatedQuestions.push(updatedQuestion);
    }

    setHardQuestions(updatedQuestions);
  };

  return (
    <>
      <div className="p-4">
        <div className="col-12">
          <div className="mb-3">
            <label
              htmlFor="paperName"
              className="form-label text-danger fw-bold h6"
            >
              Please enter Name for the Paper
            </label>
            <input
              type="text"
              className="form-control"
              id="paperName"
              value={paperName}
              onChange={(e) => {
                setPaperName(e.target.value);
              }}
              placeholder="Name for paper"
            />
          </div>
        </div>
        <p className="text-danger h6 fw-semibold ">Add Questions Here</p>
        <div className="col-md-8 col-12 mx-auto mb-4">
          <div className="col-12">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Question Number or Question"
                aria-label="Question Number or Question"
                aria-describedby="button-addon2"
                value={text}
                onChange={handleInputChange}
                onFocus={() => setIsDropdownOpen(true)}
              />
              <select
                className="form-control"
                id="qTypeId"
                style={{ maxWidth: "95px" }}
                onChange={handleSelect}
              >
                {qTypeData.map((item) => (
                  <option value={item.id} key={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
              {/* <button
                className="btn btn-primary"
                type="button"
                id="button-addon2"
              >
                <span className="fa-solid fa-magnifying-glass"></span>
              </button> */}
            </div>
          </div>
          {isDropdownOpen && (
            <div className="col-12 dropdown" ref={dropdownRef}>
              <div className="border border-1 p-2 col-12 bg-light dropdown-menu show">
                <div className="d-block mt-1 text-secondary">
                  {qData.map((item, index) => (
                    <div className="row px-3 " key={index}>
                      <h5
                        key={index}
                        onClick={() => handleClick(item)}
                        className={`h6 rounded-2 py-2 cursor-pointer ${
                          checkIfQuestionExists(item)
                            ? "customActiveLi"
                            : "currentActive"
                        }`}
                      >
                        {item.id} : {item.ques}
                      </h5>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="row justify-content-center">
          {selectedQuestions.length > 0 && (
            <div>
              <h5 className="text-warning-emphasis h6 fw-semibold">
                Reading Questions
              </h5>
            </div>
          )}
          {selectedQuestions.map(
            (data, index) =>
              data.questTypeId == 1 && (
                <div
                  className="card m-3 shadow-sm  px-3 "
                  style={{ width: "12rem" }}
                  key={index}
                >
                  <div
                    className="border border-2 bg-secondary-subtle rounded-2 mt-3"
                    style={{ height: "10rem" }}
                  >
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm top-0 end-0 position-absolute mt-2 me-2"
                      onClick={() => removeques(index)}
                      style={{ padding: "2px 5px" }}
                    >
                      <i className="bi bi-x-lg"></i>
                    </button>
                    <img src={link} className="card-img-top" alt="..." />
                  </div>
                  <div className="card-body">
                    <h5 className="card-title text-center">No :00{data.id}</h5>
                    <h5 className="card-text fw-medium fs-6">
                      {data.ques.slice(0, 18)}
                    </h5>
                  </div>
                  <div className="form-check form-switch mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="flexSwitchCheckChecked"
                      onChange={(e) => {
                        handleCheck(e, data.id);
                      }}
                    />
                    <label
                      className="form-check-label fs-6 fw-semibold text-warning-emphasis"
                      htmlFor="flexSwitchCheckChecked"
                    >
                      Hard Question
                    </label>
                  </div>
                </div>
              )
          )}
          {selectedQuestions.length > 0 && (
            <div>
              <h5 className="text-warning-emphasis h6 fw-semibold">
                Listening Questions
              </h5>
            </div>
          )}
          {selectedQuestions.map(
            (data, index) =>
              data.questTypeId == 2 && (
                <div
                  className="card m-3 shadow-sm  px-3 "
                  style={{ width: "12rem" }}
                  key={index}
                >
                  <div
                    className="border border-2 bg-secondary-subtle rounded-2 mt-3"
                    style={{ height: "10rem" }}
                  >
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm top-0 end-0 position-absolute mt-2 me-2"
                      onClick={() => removeques(index)}
                      style={{ padding: "2px 5px" }}
                    >
                      <i className="bi bi-x-lg"></i>
                    </button>
                    <img src={link} className="card-img-top" alt="..." />
                  </div>
                  <div className="card-body ">
                    <h5 className="card-title text-center">No :00{data.id}</h5>
                    <h5 className="card-text fw-medium fs-6">
                      {data.ques.slice(0, 18)}
                    </h5>
                  </div>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="flexSwitchCheckChecked"
                      onChange={(e) => {
                        handleCheck(e, data.id);
                      }}
                    />
                    <label
                      className="form-check-label fs-6 fw-semibold text-warning-emphasis"
                      htmlFor="flexSwitchCheckChecked"
                    >
                      Hard Question
                    </label>
                  </div>
                  <div className="col-12 mb-3">
                    <input
                      type="text"
                      className={`form-control text-center mt-2 fw-semibold fs-6 ${
                        errors.filter((err) => err == data.id).length > 0 &&
                        "is-invalid"
                      }`}
                      key={data.id}
                      value={time.find((t) => t.qId === data.id)?.time || ""}
                      onChange={(e) => {
                        handleInputTimeChange(e, data.id);
                      }}
                      placeholder="Duration"
                    />
                  </div>
                </div>
              )
          )}
        </div>

        <div className="d-flex justify-content-end">
          <button className="btn btn-secondary me-3 ">Close</button>
          <button className="btn btn-success" onClick={handleBtnClick}>
            Create Paper
          </button>
        </div>
      </div>
    </>
  );
};

export default CreatePaper;
