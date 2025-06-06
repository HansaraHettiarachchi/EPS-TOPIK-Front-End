const PaperDetailsT = () => {
  const items = [
    {
      no: "01",
      pId: "03",
      name: "Galle Class Paper",
      status: "active",
      cE: "[EX/KOR/02/02] [EX/KOR/02/02] [EX/KOR/02/02]",
    },
    {
      no: "01",
      pId: "03",
      name: "Galle Class Paper",
      status: "active",
      cE: "EX/KOR/02/02",
    },
    {
      no: "02",
      pId: "03",
      name: "Colombo Class Paper",
      status: "deactive",
      cE: "EX/KOR/02/02",
    },
    {
      no: "03",
      pId: "03",
      name: "Galle Class Paper",
      status: "active",
      cE: "EX/KOR/02/02",
    },
    {
      no: "04",
      pId: "03",
      name: "Mathara Class Paper",
      status: "active",
      cE: "EX/KOR/02/02",
    },
    {
      no: "05",
      pId: "03",
      name: "Galle Class Paper",
      status: "deactive",
      cE: "EX/KOR/02/02",
    },
    {
      no: "01",
      pId: "03",
      name: "Sussecs Class Paper",
      status: "active",
      cE: "EX/KOR/02/02",
    },
    {
      no: "02",
      pId: "03",
      name: "Galle Class Paper",
      status: "deactive",
      cE: "EX/KOR/02/02",
    },
  ];

  return (
    <div className="card mb-4">
      <div className="card-header d-flex justify-content-between ">
        <h6 className="mt-auto">
          <i className="fas fa-table me-2"></i> Papers
        </h6>
        <div>
          <div className="input-group ">
            <label className="input-group-text" htmlFor="inputGroupSelect02">
              Order By
            </label>
            <select className="form-select" id="inputGroupSelect02">
              <option defaultValue={"All"}>Choose </option>
              <option value="1">All</option>
              <option value="2">Active</option>
              <option value="3">Deactive</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card-body bg-light">
        <div className="mb-3">
          <div className=" d-flex justify-content-end">
            <div className="">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Paper Name or Paper ID"
                  aria-label="Paper Name or ID"
                  aria-describedby="button-addon2"
                />
                <button
                  className="btn btn-warning"
                  type="button"
                  id="button-addon2"
                >
                  <i className="fa-solid fa-magnifying-glass"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="table-responsive">
          <table id="" className="table  table-striped table-hover">
            <thead>
              <tr className="table-secondary ">
                <th>No.</th>
                <th>Paper Id</th>
                <th>Paper Name</th>
                <th>Current Status</th>
                <th>Conducted Exmainations</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, key) => (
                <tr key={key}>
                  <td>{item.no}</td>
                  <td>{item.pId}</td>
                  <td>{item.name}</td>
                  <td
                    className={`fw-bold ${
                      item.status == "active" ? "text-success" : "text-danger"
                    } text-uppercase`}
                  >
                    {item.status}
                  </td>
                  <td>{item.cE}</td>
                  <td className="d-flex justify-content-center">
                    <button
                      className="btn text-danger navbar-toggler me-4"
                      style={{ fontSize: "22px" }}
                    >
                      <span className="fa-solid fa-trash-can"> </span>
                    </button>
                    <button
                      className="btn text-primary navbar-toggler  me-4"
                      style={{ fontSize: "30px" }}
                    >
                      <span className="bi bi-toggle-on"> </span>
                    </button>
                    <button
                      className="btn text-warning navbar-toggler "
                      style={{ fontSize: "25px" }}
                    >
                      <span className="fa-solid fa-arrow-alt-circle-right"></span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="d-flex justify-content-center">
          <nav aria-label="Page navigation ">
            <ul className="pagination">
              <li className="page-item ">
                <a
                  className="page-link text-dark"
                  href="#"
                  aria-label="Previous"
                >
                  <span aria-hidden="true">&laquo;</span>
                </a>
              </li>
              <li className="page-item">
                <a className="page-link text-dark" href="#">
                  1
                </a>
              </li>
              <li className="page-item">
                <a className="page-link text-dark" href="#">
                  2
                </a>
              </li>
              <li className="page-item">
                <a className="page-link text-dark" href="#">
                  3
                </a>
              </li>
              <li className="page-item">
                <a className="page-link text-dark" href="#" aria-label="Next">
                  <span aria-hidden="true">&raquo;</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default PaperDetailsT;
