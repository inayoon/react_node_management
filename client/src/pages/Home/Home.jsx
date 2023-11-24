import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SearchBar from "../../components/SearchBar";
import { toast } from "react-toastify";
import "./Home.css";
import axios from "axios";

export default function Home() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const recordsPerPage = 5;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = filteredData.slice(firstIndex, lastIndex);
  const npage = Math.ceil(filteredData.length / recordsPerPage);
  const numbers = [...Array(npage + 1).keys()].slice(1);

  const loadData = async () => {
    const response = await axios.get("http://localhost:5000/employees");
    setData(response.data);
    setFilteredData(response.data);
  };

  useEffect(() => {
    loadData();
  }, []);
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      axios.delete(`http://localhost:5000/employees/${id}`);
      toast.success("employee deleted successfully");
      setTimeout(() => loadData(), 300);
    }
  };
  const handleSearch = (filteredData) => {
    setFilteredData(filteredData);
    setCurrentPage(1);
  };
  const handleChange = (id) => {
    if (selectedEmployees.includes(id)) {
      setSelectedEmployees(
        selectedEmployees.filter((selectedId) => selectedId !== id)
      );
    } else {
      setSelectedEmployees([...selectedEmployees, id]);
    }
  };
  const handleAllDelete = async () => {
    if (selectedEmployees.length > 0) {
      try {
        await axios.delete("http://localhost:5000/employees", {
          data: { ids: selectedEmployees },
        });
        loadData();
        setSelectedEmployees([]);
      } catch (error) {
        console.error("Error deleting employees", error);
      }
    }
  };
  return (
    <div style={{ marginTop: "150px" }}>
      <div className="search">
        <SearchBar data={data} onSearch={handleSearch} />
        <Link to="/add">
          <button className="btn btn-contact">Add Employee</button>
        </Link>
        <button className="btn btn-delete-2" onClick={handleAllDelete}>
          Delete more than one Employees
        </button>
      </div>
      <table className="styled-table">
        <thead>
          <tr>
            <th style={{ textAlign: "center" }}>Checked</th>
            <th style={{ textAlign: "center" }}>No.</th>
            <th style={{ textAlign: "center" }}>profile</th>
            <th style={{ textAlign: "center" }}>Name</th>
            <th style={{ textAlign: "center" }}>Profession</th>
            <th style={{ textAlign: "center" }}>Branch</th>
            <th style={{ textAlign: "center" }}>Contact</th>
            <th style={{ textAlign: "center" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {records.map((item, index) => {
            const uniqueIndex = firstIndex + index + 1;
            return (
              <tr key={item.id}>
                <td>
                  <input
                    type="checkbox"
                    onChange={() => handleChange(item.id)}
                    checked={selectedEmployees.includes(item.id)}
                  />
                </td>
                <td scope="row">{uniqueIndex}</td>
                <td>
                  <img
                    src={
                      item.image
                        ? `http://localhost:5000/images/` + item.image
                        : "https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-for-website-design-or-mobile-app-no-photo-available_87543-11093.jpg?w=826"
                    }
                    alt="avatar"
                    className="avatar"
                  />
                </td>
                <td>{item.name}</td>
                <td>{item.profession}</td>
                <td>{item.branch}</td>
                <td>{item.phone}</td>
                <td>
                  <Link to={`/update/${item.id}`} state={{ item: item }}>
                    <button className="btn btn-edit">Edit</button>
                  </Link>
                  <button
                    className="btn btn-delete"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <nav>
        <ul className="pagination footer">
          <li className="page-item">
            <a href="#" className="page-link" onClick={prePage}>
              Prev
            </a>
          </li>
          {numbers.map((n, i) => (
            <li
              className={`page-item ${currentPage === n ? "active" : ""}`}
              key={i}
            >
              <a href="#" className="page-link" onClick={() => changeCPage(n)}>
                {n}
              </a>
            </li>
          ))}
          <li className="page-item">
            <a href="#" className="page-link" onClick={nextPage}>
              Next
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );

  function prePage() {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  }
  function changeCPage(id) {
    setCurrentPage(id);
  }
  function nextPage() {
    if (currentPage !== npage) {
      setCurrentPage(currentPage + 1);
    }
  }
}
