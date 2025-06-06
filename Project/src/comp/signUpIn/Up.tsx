import axios from "axios";
import { useEffect, useState } from "react";
import config from "../../config";

type lData = {
  id: number;
  name: string;
};

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  userType: number;
  nic: string;
  gender: number;
  classesId: number;
  dob: string;
  agreeToTerms: boolean;
};

type FormErrors = {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  userType?: string;
  nic?: string;
  gender?: string;
  classesId?: string;
  dob?: string;
  agreeToTerms?: string;
};

const Up = () => {
  const [rs, setRs] = useState<boolean>();
  const [gender, setGender] = useState<lData[]>([]);
  const [classes, setClasses] = useState<lData[]>([]);
  const [userType, setUserType] = useState<lData[]>([]);
  const [fDisabled, setDisabled] = useState<boolean>();

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    userType: 0,
    nic: "",
    gender: 0,
    classesId: 0,
    dob: "",
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const loadData = async () => {
    try {
      const genderD = await axios.get(config.API_USER_URL + "getGender", {
        headers: {
          Authorization: `Basic ${config.ACC_CODE}`,
        },
      });
      const userTypeD = await axios.get(config.API_USER_URL + "getUType", {
        headers: {
          Authorization: `Basic ${config.ACC_CODE}`,
        },
      });
      const classesD = await axios.get(config.API_USER_URL + "getClasses", {
        headers: {
          Authorization: `Basic ${config.ACC_CODE}`,
        },
      });

      setClasses(classesD.data);
      setGender(genderD.data);
      setUserType(userTypeD.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]:
        // type === "checkbox" ? (e.target as HTMLInputElement).checked : name === "userType" ? (e.target as HTMLSelectElement).value === 1 && se :,
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });

    if (name === "userType" && value != "") {
      if (parseInt(value,10) == 1) {
        setDisabled(true);
        setFormData({
          ...formData,
          classesId: 0,
          userType: parseInt(value,10),
        });
      } else {
        setDisabled(false);
      }
    }

    setErrors({
      ...errors,
      [name]: "",
    });

    if (name === "password") {
      setErrors({
        ...errors,
        password: validatePassword(value)
          ? ""
          : "Password must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters.",
      });
    }

    if (name === "nic") {
      setErrors({
        ...errors,
        nic: validateNIC(value)
          ? ""
          : "NIC must be either 9 digits followed by 'V' or 'v', or exactly 12 digits.",
      });
    }
  };

  const validatePassword = (password: string) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const validateNIC = (nic: string) => {
    const regex = /^(\d{9}[Vv]|\d{12})$/;
    return regex.test(nic);
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.firstName) newErrors.firstName = "First Name is required";
    if (!formData.lastName) newErrors.lastName = "Last Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.userType == 0) newErrors.userType = "User Type is required";
    if (!formData.nic) newErrors.nic = "NIC is required";
    if (formData.gender == 0) newErrors.gender = "Gender is required";
    if (formData.classesId == 0 && formData.userType != 1)
      newErrors.classesId = "Class is required";
    if (!formData.dob) newErrors.dob = "Date of Birth is required";
    if (!formData.agreeToTerms)
      newErrors.agreeToTerms = "You must agree to the terms";

    if (formData.password && !validatePassword(formData.password)) {
      newErrors.password =
        "Password must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters.";
    }

    if (formData.nic && !validateNIC(formData.nic)) {
      newErrors.nic =
        "NIC must be either 9 digits followed by 'V' or 'v', or exactly 12 digits.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    console.log(JSON.stringify(formData));
    // console.log(formData);

    try {
      const response = await axios.post(
        config.API_USER_URL + "signUp",
        formData,
        {
          headers: {
            Authorization: `Basic ${config.ACC_CODE}`,
          },
        }
      );

      if (response.status == 200) {
        alert(response.data);
        if (response.data === "Regitration Successfull") {
          window.location.reload();
        }

        return <div>Hansara</div>;
      }

      console.log("Signup successful:", response.data);
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  return (
    <div>
      <form className="row g-3" onSubmit={handleSubmit}>
        <div className="col-md-6">
          <label htmlFor="firstName" className="form-label">
            First Name
          </label>
          <input
            type="text"
            className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
          />
          {errors.firstName && (
            <div className="invalid-feedback">{errors.firstName}</div>
          )}
        </div>
        <div className="col-md-6">
          <label htmlFor="lastName" className="form-label">
            Last Name
          </label>
          <input
            type="text"
            className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
          />
          {errors.lastName && (
            <div className="invalid-feedback">{errors.lastName}</div>
          )}
        </div>
        <div className="col-12">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
          {errors.email && (
            <div className="invalid-feedback">{errors.email}</div>
          )}
        </div>
        <div className="col-md-8">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className={`form-control ${errors.password ? "is-invalid" : ""}`}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
          />
          {errors.password && (
            <div className="invalid-feedback">{errors.password}</div>
          )}
        </div>
        <div className="col-md-4">
          <label htmlFor="userType" className="form-label">
            User Type
          </label>
          <select
            id="userType"
            className={`form-select ${errors.userType ? "is-invalid" : ""}`}
            name="userType"
            value={formData.userType}
            onChange={handleInputChange}
          >
            <option value="">Select User Type</option>
            {userType.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          {errors.userType && (
            <div className="invalid-feedback">{errors.userType}</div>
          )}
        </div>
        <div className="col-md-7">
          <label htmlFor="nic" className="form-label">
            NIC
          </label>
          <input
            type="text"
            className={`form-control ${errors.nic ? "is-invalid" : ""}`}
            id="nic"
            name="nic"
            value={formData.nic}
            onChange={handleInputChange}
          />
          {errors.nic && <div className="invalid-feedback">{errors.nic}</div>}
        </div>
        <div className="col-md-5">
          <label htmlFor="gender" className="form-label">
            Gender
          </label>
          <select
            id="gender"
            className={`form-select ${errors.gender ? "is-invalid" : ""}`}
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
          >
            <option value="">Select Gender</option>
            {gender.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          {errors.gender && (
            <div className="invalid-feedback">{errors.gender}</div>
          )}
        </div>

        <div className="col-md-6">
          <label htmlFor="classes" className="form-label">
            Classes
          </label>
          <select
            id="classes"
            className={`form-select ${errors.classesId ? "is-invalid" : ""}`}
            name="classesId"
            disabled={fDisabled}
            value={formData.classesId}
            onChange={handleInputChange}
          >
            <option value="">Select Class</option>
            {classes.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          {errors.classesId && (
            <div className="invalid-feedback">{errors.classesId}</div>
          )}
        </div>
        <div className="col-md-6">
          <label htmlFor="dob" className="form-label">
            Date of Birth
          </label>
          <input
            type="date"
            className={`form-control ${errors.dob ? "is-invalid" : ""}`}
            id="dob"
            name="dob"
            value={formData.dob}
            onChange={handleInputChange}
          />
          {errors.dob && <div className="invalid-feedback">{errors.dob}</div>}
        </div>
        <div className="col-12">
          <div className="form-check">
            <input
              className={`form-check-input ${
                errors.agreeToTerms ? "is-invalid" : ""
              }`}
              type="checkbox"
              id="agreeToTerms"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleInputChange}
            />
            <label className="form-check-label" htmlFor="agreeToTerms">
              Agree to T&C
            </label>
            {errors.agreeToTerms && (
              <div className="invalid-feedback">{errors.agreeToTerms}</div>
            )}
          </div>
        </div>
        <div className="col-12 d-flex justify-content-end mb-3">
          <button type="submit" className="btn btn-primary">
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};

export default Up;
