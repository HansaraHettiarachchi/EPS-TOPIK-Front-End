import { useState } from "react";
import axios from "axios";
import config from "../../config";

const In = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    if (name === "email") {
      setErrors({ ...errors, email: validateEmail(value) ? "" : "Invalid email address" });
    }

    if (name === "password") {
      setErrors({ ...errors, password: validatePassword(value) ? "" : "Password must be at least 6 characters" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      email: validateEmail(formData.email) ? "" : "Invalid email address",
      password: validatePassword(formData.password) ? "" : "Password must be at least 6 characters",
    };

    setErrors(newErrors);

    if (newErrors.email || newErrors.password) return;

    try {
      const response = await axios.post(config.API_USER_URL + "signin", formData, {
        headers: {
          Authorization: `Basic ${config.ACC_CODE}`,
        },
      });
      console.log("Signin successful:", response.data);
    } catch (error) {
      console.error("Signin failed:", error);
    }
  };

  return (
    <form className="row g-3" onSubmit={handleSubmit}>
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
        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
      </div>
      <div className="col-12">
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
        {errors.password && <div className="invalid-feedback">{errors.password}</div>}
      </div>
      <div className="text-end text-primary cursor-pointer">Forget Password</div>
      <div className="col-12">
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            id="rememberMe"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleInputChange}
          />
          <label className="form-check-label" htmlFor="rememberMe">
            Remember Me
          </label>
        </div>
      </div>
      <div className="col-12 d-flex justify-content-end mb-3">
        <button type="submit" className="btn btn-primary">
          Sign In
        </button>
      </div>
    </form>
  );
};

export default In;