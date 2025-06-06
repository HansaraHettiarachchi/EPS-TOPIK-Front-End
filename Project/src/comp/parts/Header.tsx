import TBtn from "./TBtn";

interface Props {
  htmlElement?: React.ElementType;
}

const Header = ({ htmlElement: HtmlElement = "div" }: Props) => {
  return (
    <>
      <div className="container-fluid" >
        <div
          style={{ height: "83px" }}
          className="row bg-white p-4 border-bottom border-start border-start-2"
        >
          <div className="d-flex justify-content-between align-content-center h-100 ">
            <div className="my-auto ms-2">
              <TBtn />
            </div>
            <div className="my-auto d-flex " style={{ fontSize: "22px" }}>
              <div className="border-end border-2 border-secondary">
                <button className="navbar-toggler btn ms-3">
                  <span className="fa-regular fa-bell"></span>
                </button>
                <button className="navbar-toggler btn ms-3">
                  <span className="fa-solid fa-list-check"></span>
                </button>
                <button className="navbar-toggler btn me-3 ms-3">
                  <span className="fa-regular fa-envelope-open"></span>
                </button>
              </div>
              <div className="ms-3">
                <div
                  className="rounded-circle bg-danger"
                  style={{
                    backgroundImage: 'url("src/comp/images/user.jpeg")',
                    backgroundSize: "cover",
                    minWidth: "38px",
                    minHeight: "38px",
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <HtmlElement />
          
        </div>
      </div>
    </>
  );
};

export default Header;
