import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import { toast } from "react-toastify";
import axios from "axios";

export default function Home() {
  const [data, setData] = useState([]);
  const loadData = async () => {
    const response = await axios.get("http://localhost:5000/employees");
    setData(response.data);
  };
  useEffect(() => {
    loadData();
  }, []);
  const deleteContact = () => {};
  return (
    <div style={{ marginTop: "150px" }}>
      <Link to="/addContact">
        <button className="btn btn-contact">Add Contact</button>
      </Link>

      <table className="styled-table">
        <thead>
          <tr>
            <th style={{ textAlign: "center" }}>No.</th>
            <th style={{ textAlign: "center" }}>profile</th>
            <th style={{ textAlign: "center" }}>Name</th>
            <th style={{ textAlign: "center" }}>Contact</th>
            <th style={{ textAlign: "center" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => {
            return (
              <tr key={item.id}>
                <th scope="row">{index + 1}</th>
                <td>
                  <img src={item.image} alt="avatar" className="avatar" />
                </td>
                <td>{item.name}</td>

                <td>{item.phone}</td>
                <td>
                  <Link to={`/update/${item.id}`}>
                    <button className="btn btn-edit">Edit</button>
                  </Link>
                  <button
                    className="btn btn-delete"
                    onClick={() => deleteContact(item.id)}
                    dd
                  >
                    Delete
                  </button>
                  <Link to={`/view/${item.id}`}>
                    <button className="btn btn-view">View</button>
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
