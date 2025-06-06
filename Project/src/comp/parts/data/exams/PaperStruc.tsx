import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import config from "../../../../config";

type Questions = {
  id: number;
  ques: string;
  ans: string;
  questTypeId: number;
  qdifficultyId: number;
  answers: an[];
  quesImage: loc[];
  quesRecoding: loc;
  time: string;
};

interface Props {
  pId?: number;
}

type an = {
  ans: string;
};

type User = {
  id: number;
  index: number;
  firstName: string;
  lastName: string;
};

type loc = {
  location: string;
};

type Summary = {
  id: number;
  qId?: number;
  ansIndex?: number;
  ans?: string;
};

const PaperStruc: React.FC<Props> = ({ pId = 2 }) => {
  const [readingQ, setReadingQ] = useState<Questions[]>([]);
  const [listeningQ, setlisteningQ] = useState<Questions[]>([]);
  const [status, setStatus] = useState<boolean>(false);
  const [time, setTime] = useState<number>(0);
  const [fTime, setfTime] = useState<number>(1500000);
  const [stringTime, setSTime] = useState<string>();
  const [cQT, setcQT] = useState(true);
  const [cQ, setcQ] = useState<number>(1);
  const ausioref = useRef<HTMLAudioElement>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const [stages, setStages] = useState<number>(2);

  const [rQuestions, setRQuestions] = useState<Summary[]>(
    Array.from({ length: 20 }, (_, i) => ({ id: i + 1 }))
  );
  const [lQuestions, setlQuestions] = useState<Summary[]>(
    Array.from({ length: 20 }, (_, i) => ({ id: i + 1 }))
  );

  //User Data
  const [stuIndex, setStuIndex] = useState<string>("");
  const [student, setStudent] = useState<User>();

  const enterFullScreen = () => {
    const element = divRef.current;
    if (element) {
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if ((element as any).webkitRequestFullscreen) {
        // Safari
        (element as any).webkitRequestFullscreen();
      } else if ((element as any).msRequestFullscreen) {
        // IE/Edge
        (element as any).msRequestFullscreen();
      }
    }
  };

  // Exit full-screen mode
  const exitFullScreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if ((document as any).webkitExitFullscreen) {
      // Safari
      (document as any).webkitExitFullscreen();
    } else if ((document as any).msExitFullscreen) {
      // IE/Edge
      (document as any).msExitFullscreen();
    }
  };

  // Check if the document is in full-screen mode
  const isFullScreen = () => {
    return (
      document.fullscreenElement ||
      (document as any).webkitFullscreenElement ||
      (document as any).msFullscreenElement
    );
  };

  const shuffleArray = <T,>(array: T[]): T[] => {
    if (!array || array.length === 0) return [];

    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    return shuffledArray;
  };

  const getQuestins = async () => {
    try {
      const rs = await axios.get(
        `${config.API_BASE_URL}getQuestionsByPId/${pId}`,
        {
          headers: {
            Authorization: `Basic ${config.ACC_CODE}`,
          },
        }
      );

      const rQE: Questions[] = [];
      const rQH: Questions[] = [];
      const lQE: Questions[] = [];
      const lQH: Questions[] = [];

      rs.data.forEach((element: Questions) => {
        if (element.questTypeId === 1) {
          // Reading questions
          if (element.qdifficultyId === 1) {
            rQE.push(element);
          } else {
            rQH.push(element);
          }
        } else {
          // Listening questions
          if (element.qdifficultyId === 1) {
            lQE.push(element);
          } else {
            lQH.push(element);
          }
        }
      });

      setReadingQ([...shuffleArray(rQE), ...shuffleArray(rQH)]);
      setlisteningQ([...shuffleArray(lQE), ...shuffleArray(lQH)]);
    } catch (e) {
      console.error("Error fetching questions:", e);
    }
  };

  const handleSelect = (e: React.MouseEvent<HTMLHeadingElement>) => {
    e.preventDefault();
    const clickedElement = e.currentTarget;
    const index = clickedElement.getAttribute("data-index");
    const answer = clickedElement.getAttribute("data-answer");

    if (cQT) {
      const ansIndex = index !== null ? Number(index) : undefined;

      const updatedQuestions = rQuestions.map((question) => {
        if (question.id === cQ && question.ans == undefined) {
          return {
            ...question,
            ans: answer || undefined,
            ansIndex,
            qId: readingQ[cQ - 1].id,
          };
        }
        return question;
      });

      setRQuestions(updatedQuestions);
    } else {
      const ansIndex = index !== null ? Number(index) : undefined;

      const updatedQuestions = lQuestions.map((question) => {
        if (question.id === cQ && question.ans == undefined) {
          return {
            ...question,
            ans: answer || undefined,
            ansIndex,
            qId: listeningQ[cQ - 1].id,
          };
        }
        return question;
      });

      setlQuestions(updatedQuestions);
    }
  };

  const formatTime = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  function timeToMiliSec(timeString: string | undefined): number {
    if (!timeString) {
      return 1500000;
    }

    const [hours, minutes, seconds] = timeString.split(":");

    const hoursInMs = parseInt(hours, 10) * 60 * 60 * 1000;
    const minutesInMs = parseInt(minutes, 10) * 60 * 1000;
    const secondsInMs = parseInt(seconds, 10) * 1000;

    return hoursInMs + minutesInMs + secondsInMs;
  }

  let t = 25 * 60 * 1000;

  const timer = () => {
    t -= 1000;
    setSTime(formatTime(t));
    setTime(t);

    if (t == 0) {
      t = 25 * 60 * 1000;
      setcQT(false);
    }
  };
  const handleBeforeUnload = (event: BeforeUnloadEvent) => {
    event.preventDefault();
  };
  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
    getQuestins();

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    if (!cQT) {
      let lTime = fTime - timeToMiliSec(listeningQ[cQ - 1].time);

      if (lTime == time) {
        setcQ(cQ + 1);
        setfTime(lTime);
      }
    }
  }, [time]);

  useEffect(() => {
    if (!cQT) {
      if (ausioref.current) {
        ausioref.current.currentTime = 0;
        ausioref.current.play();
      }
    }
  }, [cQ]);

  if (!status) {
    return (
      <div className="bg-white container-fluid" style={{ minHeight: "100vh" }}>
        {stages == 0 ? (
          <div className="container">
            <div className="row" style={{ minHeight: "100vh" }}>
              <div className="m-auto shadow-lg col-md-10 col-lg-8 rounded-5">
                <div className="row">
                  <div className="row">
                    <img
                      src="src/comp/images/Logo1.png"
                      className="mx-auto my-3 "
                      style={{ height: "150px", width: "300px" }}
                      alt=""
                    />
                  </div>
                  <div className="hstack gap-3 col-md-8 mx-auto my-3 py-3 border border-2 rounded-3">
                    <input
                      className="form-control me-auto"
                      type="text"
                      placeholder="Your Index Number"
                      aria-label="Your Index Number"
                      value={stuIndex && stuIndex}
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        if (
                          (/^\d+$/.test(inputValue) || inputValue === "") &&
                          inputValue.length <= 6
                        ) {
                          setStuIndex(inputValue);
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={async () => {
                        if (stuIndex.length === 6) {
                          const rs = await axios.get(
                            config.API_USER_URL +
                              "getStuDetails?stuIndex=" +
                              stuIndex,
                            {
                              headers: {
                                Authorization: `Basic ${config.ACC_CODE}`,
                              },
                            }
                          );

                          console.log(rs);
                          
                        }
                      }}
                    >
                      Confirm
                    </button>
                    <div className="vr"></div>
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      onClick={() => {
                        setStuIndex("");
                      }}
                    >
                      Reset
                    </button>
                  </div>
                  <div
                    className="mx-auto col-md-7 mb-5 mt-3 text-center alert alert-danger fw-bold"
                    role="alert"
                  >
                    Sorry...! You'er not allowed to face this exam. <br /> Try
                    Again later.
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : stages == 1 ? (
          <div className="container">
            <div className="row" style={{ minHeight: "100vh" }}>
              <div className="m-auto col-md-10 col-lg-8">
                <div className="row">
                  <img
                    src="src/comp/images/instructions-1.png"
                    className="mx-auto mt-3"
                  />
                  <button
                    className="btn btn-primary fw-semibold fs-4 mt-3 mx-auto"
                    style={{ width: "160px", height: "60px" }}
                    onClick={() => {
                      setStages(2);
                    }}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          stages == 2 && (
            <div className="container">
              <div className="row" style={{ minHeight: "100vh" }}>
                <div className="m-auto col-md-10 col-lg-8">
                  <div className="row">
                    <img
                      src="src/comp/images/instructions-2.jpg"
                      className="mx-auto mt-3"
                    />
                    {readingQ.length == 20 && (
                      <button
                        className="btn btn-primary fw-semibold fs-4 mt-3 mx-auto"
                        style={{ width: "160px", height: "60px" }}
                        onClick={() => {
                          setStatus(true);
                          setInterval(timer, 1000);
                        }}
                      >
                        Ready
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    );
  }

  return (
    <div className="cusPaperBgC-1">
      <div className="pt-1 cusPaperBgC">
        {/* <div className="m-1 rounded-top-5 cusPaperBgC-1"> */}
        <div className="m-1 rounded-top-5 cusPaperBgC-1">
          <div className="row">
            <div className="col"></div>
            <div className="col">
              <h4 className="text-center pt-3 pb-2 fw-semibold cusFont">
                Test of proficiency in Korean
              </h4>
            </div>
            <div className="col">
              <h6 className="text-end me-4 pt-3">Student Index No: 002154</h6>
            </div>
          </div>
          <div className="col-12 bg-light" ref={divRef}>
            <div className="row col-12" style={{ margin: "0", padding: "0" }}>
              <div className="col paperBg">
                <div className="col-12 d-flex justify-content-center mt-5">
                  <div
                    className="col-10 bg-light mt-4"
                    style={{ minHeight: "550px" }}
                  >
                    <h4 className="h5 mt-4 ms-5 fw-normal">
                      {cQT
                        ? `[${cQ}] ${
                            readingQ[cQ - 1].ques !== "Image Question"
                              ? readingQ[cQ - 1].ques
                              : ""
                          }`
                        : `[${cQ}] ${
                            listeningQ[cQ - 1].ques !== "Image Question"
                              ? listeningQ[cQ - 1].ques
                              : ""
                          }`}
                    </h4>
                    {cQT
                      ? readingQ[cQ - 1].quesImage.map((item, i) => (
                          <div className="row px-5" key={i}>
                            <img
                              className={
                                readingQ[cQ - 1].ques === "Image Question"
                                  ? i == 0
                                    ? "w-100"
                                    : "imgWidth"
                                  : `imgWidth`
                              }
                              src={
                                config.API_BASE_URL.replace("/api/v1/", "") +
                                item.location
                              }
                            />
                          </div>
                        ))
                      : listeningQ[cQ - 1].quesImage.map((item, i) => (
                          <div className="row px-5" key={i}>
                            <audio
                              src={
                                config.API_BASE_URL.replace("/api/v1/", "") +
                                listeningQ[cQ - 1].quesRecoding.location
                              }
                              controls
                              ref={ausioref}
                              autoPlay
                              id="rec"
                              className="w-100 px-5 d-none"
                            ></audio>
                            <img
                              className={
                                listeningQ[cQ - 1].ques === "Image Question"
                                  ? i == 0
                                    ? "w-100"
                                    : "imgWidth"
                                  : `imgWidth`
                              }
                              src={
                                config.API_BASE_URL.replace("/api/v1/", "") +
                                item.location
                              }
                            />
                          </div>
                        ))}
                    <div className="ms-5 mt-4">
                      {cQT
                        ? readingQ[cQ - 1].answers.map((item, index) => (
                            <h6
                              className={`cursor-pointer ${
                                rQuestions.filter((v) => v.id == cQ)[0].ans &&
                                rQuestions.filter((v) => v.id == cQ)[0].ans ==
                                  item.ans &&
                                "text-decoration-underline text-success"
                              }`}
                              key={index}
                              data-index={index}
                              data-answer={item.ans}
                              onClick={handleSelect}
                            >
                              ({index + 1}) {item.ans}
                            </h6>
                          ))
                        : listeningQ[cQ - 1].answers.map((item, index) => (
                            <h6
                              key={index}
                              className={`cursor-pointer ${
                                lQuestions.filter((v) => v.id == cQ)[0].ans &&
                                lQuestions.filter((v) => v.id == cQ)[0].ans ==
                                  item.ans &&
                                "text-decoration-underline text-success"
                              }`}
                              data-index={index}
                              data-answer={item.ans}
                              onClick={handleSelect}
                            >
                              ({index + 1}) {item.ans}
                            </h6>
                          ))}
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="cusPaperBgC-1 border-top border-2"
                style={{
                  margin: "0",
                  padding: "0",
                  height: "100vh",
                  width: "350px",
                }}
              >
                <div className="m-3 shadow-sm border border-2 p-1 rounded border-primary-subtle">
                  <button
                    className="btn btn-primary fw-semibold w-100 px-5 fs-6"
                    onClick={() => {}}
                  >
                    Submit Answers
                  </button>
                </div>
                <div className="mx-3 rounded row bg-light shadow-sm">
                  <div
                    className="col border-end border-2"
                    style={{ padding: "0" }}
                  >
                    <div className="rounded-start bg-dark-subtle">
                      <h5 className="fw-semibold fs-6 text-center text-uppercase pt-2">
                        <small>Reading (25 min)</small>
                      </h5>
                      <div className="border-top border-2 col-12 pb-1">
                        <div className="shadow p-1 rounded mx-2 my-2">
                          <h6
                            className="text-center mx-2 py-2 shadow-sm"
                            style={{ fontSize: "14px" }}
                          >
                            Remaining Time
                          </h6>
                          <h6
                            className="text-center mx-2 py-2 shadow-sm"
                            style={{ fontSize: "14px" }}
                          >
                            {cQT ? stringTime : "00:00"}
                          </h6>
                        </div>
                      </div>
                    </div>
                    <div className="col-12">
                      {rQuestions.map((item) => (
                        <div
                          key={item.id}
                          className={`border border-1 row ${
                            cQ == item.id && cQT && "bg-info"
                          }`}
                          style={{
                            margin: "0",
                            padding: "0",
                            fontSize: "13px",
                          }}
                          onClick={() => {
                            cQT && setcQ(item.id);
                          }}
                        >
                          <div className="col-4 text-center border-end border-2">
                            {item.id}
                          </div>
                          <div className="col text-center">
                            {item.ansIndex != undefined && (
                              <>
                                <i
                                  className="fa-solid fa-bowling-ball "
                                  style={{ fontSize: "8px" }}
                                ></i>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="col" style={{ padding: "0" }}>
                    <div className="rounded-end rounded-0 bg-dark-subtle">
                      <h5 className="fw-semibold fs-6 text-center text-uppercase pt-2">
                        <small>Listening (25 min)</small>
                      </h5>
                      <div className="border-top border-2 col-12 pb-1">
                        <div className="shadow p-1 rounded mx-2 my-2">
                          <h6
                            className="text-center mx-2 py-2 shadow-sm"
                            style={{ fontSize: "14px" }}
                          >
                            Remaining Time
                          </h6>
                          <h6
                            className="text-center mx-2 py-2 shadow-sm"
                            style={{ fontSize: "14px" }}
                          >
                            {!cQT ? stringTime : "25:00"}
                          </h6>
                        </div>
                      </div>
                    </div>
                    <div className="col-12">
                      {lQuestions.map((item) => (
                        <div
                          key={item.id}
                          className={`border border-1 row ${
                            cQ == item.id && !cQT && "bg-info"
                          }`}
                          style={{
                            margin: "0",
                            padding: "0",
                            fontSize: "13px",
                          }}
                        >
                          <div className="col-4 text-center border-end border-2">
                            {item.id}
                          </div>
                          <div className="col text-center">
                            {item.ansIndex != undefined && (
                              <>
                                <i
                                  className="fa-solid fa-bowling-ball "
                                  style={{ fontSize: "8px" }}
                                ></i>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="col-12 border-top border-2">
                    <div className="row my-3">
                      {cQT && (
                        <>
                          <div className="col d-flex justify-content-center">
                            <button
                              className="btn btn-secondary btn-sm rounded-5"
                              style={{ width: "100px" }}
                              onClick={() => {
                                let i = cQ - 1;
                                if (i == 0) {
                                  i = 1;
                                }
                                setcQ(i);
                              }}
                            >
                              Previous
                            </button>
                          </div>
                          <div className="col d-flex justify-content-center">
                            <button
                              className="btn btn-secondary btn-sm rounded-5"
                              style={{ width: "100px" }}
                              onClick={() => {
                                let i = cQ + 1;
                                if (i == 21) {
                                  setcQT(false);
                                  i = 1;
                                }
                                setcQ(i);
                              }}
                            >
                              Next
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                    <div className="row col-8 mx-auto">
                      <button
                        className="btn btn-dark mb-2 rounded-2 "
                        style={{ fontSize: "14px" }}
                        onClick={() => {
                          isFullScreen() ? exitFullScreen() : enterFullScreen();
                        }}
                      >
                        {isFullScreen()
                          ? "Exit From Full Screen"
                          : "Full Screen"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaperStruc;
