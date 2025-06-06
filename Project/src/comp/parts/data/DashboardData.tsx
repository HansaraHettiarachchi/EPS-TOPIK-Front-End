const DashboardData = () => {
  return (
    <>
      <div className="container-fluid">
        <div className="d-md-flex justify-content-between m-3 ">
          <div>
            <h4 className="h4">Current Examination Papers</h4>
          </div>
          <div className="d-md-block d-flex justify-content-center">
            <button className="btn btn-success me-2">
              <i className="bi bi-file-earmark-plus me-2"></i> Create New
            </button>
          </div>
        </div>
        <div className="shadow-sm rounded-4 bg-white m-4 col"></div>
      </div>
    </>
  );
};

export default DashboardData;
