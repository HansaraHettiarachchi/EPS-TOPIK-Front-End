import SideBarElements from "./SideBarElements";

const Sidebar = () => {
  return (
    <>
      <div className="d-none d-lg-block">
        <div
          // className={`d-none bg-light vh-100 p-3 col-4 col-md-3 border ${toggle ? 'd-lg-block' : ''}`}
          className="bg-white border-end collapse show collapse-horizontal"
          id="dsfdsds"
          style={{
            minHeight: "100vh",
            minWidth: "250px",
            transition: "width 0.2s ease-in-out",
          }}
        >
          <div className="border-bottom ">
            <img
              src="src/comp/images/logo1.png "
              className="ms-4 mt-2 mb-2 "
              style={{ height: "66.5px" }}
              alt=""
            />
          </div>
          <div className="ms-3 me-3 mt-1 mb-3">
            <SideBarElements></SideBarElements>
          </div>
        </div>
      </div>

      <div
        className="offcanvas offcanvas-start"
        tabIndex={-1}
        id="sidebar"
        aria-labelledby="sidebarLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="sidebarLabel">
            <img
              src="src/comp/images/logo1.png "
              className="ms-2"
              style={{ width: "100px" }}
              alt=""
            />
          </h5>
          <button
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <hr />
        <div className="offcanvas-body">
          <SideBarElements></SideBarElements>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
