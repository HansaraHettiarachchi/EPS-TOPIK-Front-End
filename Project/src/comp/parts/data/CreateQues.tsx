import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import config from "../../../config";

interface QTypeD {
  id?: number;
  name?: string;
}

interface ValidData {
  question?: string;
  answers?: string[];
  images?: string;
  audio?: string;
}

interface Props {
  titleText?: string;
  endPoint?: string;
  quesId?: string;
}

type Question = {
  id: number;
  ques: string;
  ans: string;
  relation: number;
  questTypeId: number;
  statusId: number;
};

type Ans = {
  ansId: number;
  ans: string;
  isCorrect: boolean;
};

const CreateQues: React.FC<Props> = ({ titleText, quesId ="0" }) => {
console.log(quesId);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [qTypeData, setQTypeData] = useState<QTypeD[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [audio, setAudio] = useState<string | null>(null);
  const [selectedCreatingType, setSelectedCreatingType] = useState<number>(1);
  const [selectedQuestionType, setSelectedQuestionType] = useState<number>(1);
  const [ques, setQues] = useState<string>("");
  // const [ans, setAns] = useState<string[]>(["", "", "", ""]);

  const [ans, setAns] = useState<Ans[]>([
    { ansId: 1, ans: "", isCorrect: true },
    { ansId: 2, ans: "", isCorrect: false },
    { ansId: 3, ans: "", isCorrect: false },
    { ansId: 4, ans: "", isCorrect: false },
  ]);

  const [formErr, setFormErr] = useState<ValidData>({});

  const initialImagesRef = useRef<string[]>([]);
  const initialAudioRef = useRef<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [selectedQuestion, setSelectedQuestion] = useState<Question>();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [qData, setQData] = useState<Question[]>([]);
  const [text, setText] = useState<string>("");

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
        `${config.API_BASE_URL}getAllQuesByQues?ques=${text}&qType=${selectedQuestionType}`,
        // config.API_BASE_URL + "getAllQuesByQues?ques=" + text + "&qType=0",
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

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const debouncedFetchSuggestions = debounce(fetchSuggestions, 300);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    debouncedFetchSuggestions(e.target.value);
  };

  const handleClick = (ques: Question) => {
    setSelectedQuestion(ques);
    setText(ques.id + " : " + ques.ques);
    setIsDropdownOpen(false);
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

  const getQuestion = async (qId: number) => {
    if (qId > 0) {
      const rs = await axios.get(
        `${config.API_BASE_URL}getQuesDataById/${qId}`,
        {
          headers: {
            Authorization: `Basic ${config.ACC_CODE}`,
          },
        }
      );

      if (rs.status == 200) {
        return rs.data;
      }
    }
  };

  const loadQuestionData = async () => {
    try {
      const rs = await axios.get(
        `${config.API_BASE_URL}getQuesDataById/${quesId}`,
        {
          headers: {
            Authorization: `Basic ${config.ACC_CODE}`,
          },
        }
      );

      setSelectedQuestionType(rs.data.questType?.id || 0);

      setSelectedCreatingType(rs.data.ques === "Image Question" ? 2 : 1);

      setQues(rs.data.ques);

      setAns(
        rs.data.answers.map((element: string, index: number) => ({
          ansId: index + 1,
          ans: element,
          isCorrect: rs.data.ans === element,
        }))
      );

      const newImageUrls =
        rs.data.imageUrls?.map((imageUrl: string) => {
          return config.API_BASE_URL.replace("/api/v1/", "") + imageUrl;
        }) || [];
      setImages(newImageUrls);
      initialImagesRef.current = newImageUrls;

      const audioUrl = rs.data.audioUrl
        ? config.API_BASE_URL.replace("/api/v1/", "") + rs.data.audioUrl
        : null;
      setAudio(audioUrl);
      initialAudioRef.current = audioUrl;

      if (rs.data.relation) {
        const q = await getQuestion(rs.data.relation);
        if (q) {
          handleClick(q);
        }
      }
    } catch (error) {
      console.error("Error fetching question data:", error);

      setImages([]);
      setAudio(null);
    }
  };
  useEffect(() => {
    getQTypeData();
    if (quesId !== "0") {
      loadQuestionData();
    } else {
      initialImagesRef.current = [];
      initialAudioRef.current = null;
      setSelectedQuestionType(1);
    }
  }, [quesId]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const validFiles = Array.from(files).filter((file) =>
        file.type.startsWith("image/")
      );

      if (validFiles.length > 0) {
        const imageUrls = validFiles.map((file) => URL.createObjectURL(file));
        setImages(imageUrls);
      } else {
        alert("Please upload valid image files.");
      }
    }
  };

  const removeImage = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleDivClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("audio/")) {
      setAudio(URL.createObjectURL(file));
    } else {
      alert("Please upload a valid audio file.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    if (id === "quesInput") {
      setQues(value);
    } else if (id.startsWith("answer")) {
      const i = parseInt(id.replace("answer", ""), 10);
      console.log(i);

      setAns((nAns) =>
        nAns.map((data) =>
          data.ansId == i
            ? {
                ...data,
                ansId: data.ansId,
                ans: value,
                isCorrect: data.isCorrect,
              }
            : data
        )
      );

      console.log(ans);
    }
    setFormErr({});
  };

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { id, value } = e.target;
    const val = parseInt(value, 10);
    if (id.startsWith("cType0")) {
      setSelectedCreatingType(val);
      val === 1 ? setQues("") : setQues("Image Question");
    } else if (id.startsWith("cType1")) {
      setSelectedQuestionType(val);
    }

    selectedQuestionType == 1 && setAudio(null);
  };

  const removeAudio = () => {
    setAudio(null);
  };

  const validation = (): boolean => {
    const regex = /^[ㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z0-9\s{}.,\/()_+\-=?]+$/;
    const errors: ValidData = {};

    if (!ques.trim()) {
      errors.question = "Question is required";
    } else if (!regex.test(ques)) {
      errors.question = "Invalid characters in the question";
    }

    const answerErrors: string[] = [];
    ans.forEach((answer, index) => {
      if (!answer.ans.trim()) {
        answerErrors[index] = `Answer ${index + 1} is required`;
      } else if (!regex.test(answer.ans)) {
        answerErrors[index] = `Invalid characters in Answer ${index + 1}`;
      }
    });

    ans.filter((d) => d.isCorrect == true).length != 1 &&
      alert("Please Select the correct answer");

    if (answerErrors.length > 0) {
      errors.answers = answerErrors;
    }

    if (selectedCreatingType === 2 && images.length === 0) {
      errors.images = "At least one image is required for Uploading Image type";
    }

    if (selectedQuestionType === 2 && !audio) {
      errors.audio = "Audio is required for Listening type";
    }

    setFormErr(errors);

    return Object.keys(errors).length === 0;
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url); // This will throw an error if the URL is invalid
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validation()) {
      console.log("Form validation failed");
      return;
    }

    const formData = new FormData();
    formData.append("id", quesId === "0" ? "0" : quesId);
    formData.append("question", ques);
    formData.append(
      "relation",
      selectedQuestion?.id ? selectedQuestion.id.toString() : " "
    );
    formData.append("questionType", selectedQuestionType.toString());
    ans.map((item, i) =>
      formData.append("answers" + i, `${item.ansId} : ${item.ans}`)
    );

    const correctAnswer = ans.find((d) => d.isCorrect == true)?.ans;
    formData.append("ans", correctAnswer ? correctAnswer : "");

    if (fileInputRef.current?.files) {
      const files = fileInputRef.current.files;
      for (let i = 0; i < files.length; i++) {
        formData.append("images", files[i]);
      }
    }

    // Validate and fetch audio file
    if (audio && isValidUrl(audio)) {
      try {
        const audioFile = await fetch(audio)
          .then((res) => res.blob())
          .then((blob) => new File([blob], "audio.mp3", { type: "audio/mp3" }));
        formData.append("audio", audioFile);
      } catch (error) {
        console.error("Error fetching audio file:", error);
      }
    } else {
      console.warn("No valid audio file provided. Skipping audio upload.");
    }

    // Log form data for debugging
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }

    try {
      const response = await axios.post(
        config.API_BASE_URL +
          (quesId === "0" ? "createQuestion" : "updateQuestion"),
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Basic ${config.ACC_CODE}`,
          },
        }
      );

      console.log(response.data);

      // if (response.status === 200) {
      //   alert(quesId === "0" ? "Question created successfully!" : "Question updated successfully!");
      //   handleReset();
      // } else if (response.status === 202) {
      //   alert(response.data.message);
      // }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred while submitting the form.");
    }
  };

  const handleReset = () => {
    setImages([]);
    setAudio(null);
    setQues("");
    setAns([
      { ansId: 1, ans: "", isCorrect: true },
      { ansId: 2, ans: "", isCorrect: true },
      { ansId: 3, ans: "", isCorrect: true },
      { ansId: 4, ans: "", isCorrect: true },
    ]);
    setSelectedCreatingType(1);
    setSelectedQuestionType(1);
    setFormErr({});
  };

  return (
    <>
      <div
        className="h5 ms-3 pt-3"
        onClick={() => {
          console.log(images);
          console.log(audio);
          console.log(initialAudioRef);
          console.log(initialImagesRef);
        }}
      >
        {titleText}
      </div>
      <form className="row g-3 p-3" onSubmit={handleSubmit}>
        {["Creating Type", "Question Type"].map((item, index) => (
          <div className="col-md-6" key={item}>
            <label htmlFor={`cType${index}`} className="form-label">
              {item}
            </label>
            <select
              onChange={handleSelect}
              id={`cType${index}`}
              className="form-select"
              value={
                item === "Question Type" && qTypeData.length > 0
                  ? selectedQuestionType
                  : selectedCreatingType
              }
            >
              {item === "Question Type" ? (
                qTypeData.length > 0 &&
                qTypeData.map((qTypeItem) => (
                  <option key={qTypeItem.id} value={qTypeItem.id}>
                    {qTypeItem.name}
                  </option>
                ))
              ) : (
                <>
                  <option value="1">Creating New</option>
                  <option value="2">Uploading Image</option>
                </>
              )}
            </select>
          </div>
        ))}

        <div className="col-12">
          <label htmlFor="quesInput" className="form-label">
            Question
          </label>
          <input
            type="text"
            className={`form-control ${formErr.question ? "is-invalid" : ""}`}
            id="quesInput"
            value={ques}
            onChange={handleChange}
            placeholder=""
            disabled={selectedCreatingType === 2}
          />
          {formErr.question && (
            <div className="invalid-feedback">{formErr.question}</div>
          )}
        </div>
        {ans.map((item) => (
          <div key={item.ansId} className="col-lg-3 col-12 col-sm-6">
            <label
              htmlFor={`answer${item.ansId}`}
              className="form-label cursor-pointer"
              onClick={() => {
                setAns((nAns) =>
                  nAns.map((data) =>
                    data.ansId == item.ansId
                      ? {
                          ...data,
                          ansId: data.ansId,
                          ans: data.ans,
                          isCorrect: true,
                        }
                      : {
                          ...data,
                          ansId: data.ansId,
                          ans: data.ans,
                          isCorrect: false,
                        }
                  )
                );
              }}
            >
              Answer
              {item.isCorrect && (
                <small className="text-secondary">{"(Correct Answer)"}</small>
              )}
            </label>
            <input
              type="text"
              className={`form-control ${
                formErr.answers && formErr.answers[item.ansId - 1]
                  ? "is-invalid"
                  : ""
              }`}
              onChange={handleChange}
              value={item.ans}
              id={`answer${item.ansId}`}
            />
            {formErr.answers && formErr.answers[item.ansId - 1] && (
              <div className="invalid-feedback">
                {formErr.answers[item.ansId - 1]}
              </div>
            )}
          </div>
        ))}

        <div className="mb-2">
          <h6 className="fw-normal text-dark mt-3 ">
            Plese Select Question if this is Related to Any other Question
          </h6>
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
                          selectedQuestion == item
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

        <div className="col-12">
          <p className="form-label">
            Upload Required Files{" "}
            <small className="text-secondary">
              {"(Like Images and Voice Recordings)"}
            </small>
          </p>
          <div className="container-fluid gap-3 justify-content-center">
            <div className="col-12">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                ref={fileInputRef}
                className={`form-control mb-3 d-none ${
                  formErr.images ? "is-invalid" : ""
                }`}
                multiple
              />
              <div
                className="border p-3 text-center cursor-pointer shadow-sm cusBgColor"
                onClick={handleDivClick}
                style={{ cursor: "pointer" }}
              >
                <p className="my-auto">Click here to upload Images</p>
              </div>
              {formErr.images && (
                <div className="invalid-feedback">{formErr.images}</div>
              )}
              <div className="my-3">
                <div className="d-flex flex-wrap gap-2">
                  {images.length > 0 &&
                    images.map((image, index) => (
                      <div key={index} className="position-relative">
                        <img
                          src={image}
                          alt={`Uploaded ${index + 1}`}
                          className="img-thumbnail"
                          style={{
                            height: "100px",
                            objectFit: "cover",
                          }}
                        />
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm position-absolute top-0 end-0"
                          onClick={() => removeImage(index)}
                          style={{ padding: "2px 5px" }}
                        >
                          <i className="bi bi-x-lg"></i>
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div
              className={`col-12 mt-2 ${selectedQuestionType == 1 && `d-none`}`}
            >
              <input
                type="file"
                accept="audio/*"
                onChange={handleAudioUpload}
                className={`form-control mb-3 d-none ${
                  formErr.audio ? "is-invalid" : ""
                }`}
                id="audioInput"
              />
              <div
                className="border p-3 text-center cursor-pointer shadow-sm cusBgColor"
                onClick={() => document.getElementById("audioInput")?.click()}
                style={{ cursor: "pointer" }}
              >
                <p className="my-auto">Click here to upload audio</p>
              </div>
              {formErr.audio && (
                <div className="invalid-feedback">{formErr.audio}</div>
              )}
              {audio && (
                <div className="mt-3 position-relative">
                  <audio controls src={audio} className="w-100">
                    Your browser does not support the audio element.
                  </audio>
                  <button
                    type="button"
                    className="btn btn-success btn-sm position-absolute top-0 end-0"
                    onClick={removeAudio}
                    style={{ padding: "2px 5px" }}
                  >
                    &times;
                  </button>
                </div>
              )}
            </div>

            <div className="p-3 row justify-content-end">
              <button
                className="btn btn-secondary col-12 col-md-3 col-lg-2 mb-3 mb-md-0"
                type="button"
                onClick={handleReset}
              >
                Reset
              </button>
              <button
                className="btn btn-warning col-12 col-md-3 col-lg-2 ms-3"
                type="submit"
              >
                {quesId === "0" ? "Create" : "Update"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default React.memo(CreateQues);
