import axios from "axios";
import { useEffect, useRef, useState } from "react";
import config from "../../../../config";

type Question = {
  id: number;
  ques: string;
  ans: string;
  questTypeId: number;
  statusId: number;
};

type QTypeD = {
  id?: number;
  name?: string;
};

const GetQuestion = () => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [qData, setQData] = useState<Question[]>([]);
  const [text, setText] = useState<string>("");
  const [sQType, setSQType] = useState<number>(1);

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
    console.log(sQType);
    setText(e.target.value);
    debouncedFetchSuggestions(e.target.value);
  };

  const handleClick = (ques: Question) => {
    if (!checkIfQuestionExists(ques)) {
      const arr = [...selectedQuestions];

      arr.push(ques);
      setSelectedQuestions(arr);
    }
  };

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

  return (
    <>
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
    </>
  );
};

export default GetQuestion;
