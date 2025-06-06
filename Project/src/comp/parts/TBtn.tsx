
const TBtn = () => {
  return (
    <>
      <button
        className="navbar-toggler fs-5 d-none d-lg-block bg-light"
        data-bs-toggle="collapse"
        data-bs-target="#dsfdsds"
        aria-expanded="false"
        aria-controls="dsfdsds"
        type="button"
      >
        <span className="fa-solid fa-sliders"></span>
      </button>
      <button
        className="navbar-toggler fs-5 d-block d-lg-none bg-light"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#sidebar"
        aria-controls="sidebar"
        aria-expanded="true"
        aria-label="Toggle navigation"
      >
        <span className="fa-solid fa-sliders"></span>
      </button>
    </>
  );
};

export default TBtn;
