import { useState } from "react";
import In from "./In";
import Up from "./Up";

const Sign = () => {
  const [signIn, setSignIn] = useState<boolean>(true);

  return (
    <div className="container">
      <div className="row" style={{ minHeight: "100vh" }}>
        <div
          className={`shadow bg-light m-auto rounded-5 ${
            signIn ? "col-md-8 col-lg-4" : "col-md-10 col-lg-6"
          }`}
        >
          <div className="row">
            <img
              src="src/comp/images/Logo1.png"
              className="mx-auto mt-3"
              style={{ height: "120px", width: "270px" }}
              alt=""
            />
          </div>
          <h4 className="text-center mt-2 fw-semibold text-uppercase">
            Wellcome
          </h4>

          <div className="col-12 p-3">
            {signIn ? <In></In> : <Up></Up>}

            <p className="text-center">
              Already have an Accout...?{" "}
              <b
                className="cursor-pointer text-primary-emphasis"
                onClick={() => {
                  setSignIn(!signIn);
                }}
              >
                {" "}
                Sign {signIn ? "Up" : "In"}
              </b>{" "}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sign;
