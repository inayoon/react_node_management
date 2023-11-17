import React, { useState, useEffect } from "react";
import "./UpdateEmployee.css";
import axios from "axios";
import { useParams } from "react-router-dom";

const initialState = {
  name: "",
  profession: "",
  city: "",
  phone: "",
  branch: "",
  image: null,
  fileName: "",
};

export default function UpdateEmployee() {
  const [state, setState] = useState(initialState);

  // const { item } = location.state;
  // const { name } = item;
  const { id } = useParams();
  useEffect(() => {
    axios.get(`http://localhost:5000/employees/${id}`).then((response) => {
      setState({ ...response.data[0] });
    });
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", state.image);
    formData.append("name", state.name);
    formData.append("profession", state.profession);
    formData.append("city", state.city);
    formData.append("phone", state.phone);
    formData.append("branch", state.branch);
    console.log(formData.toString());

    axios.put(`http://localhost:5000/update/${id}`, formData).then((res) => {
      console.log(res.data);
      if (res.data.Status === "Success") {
        console.log("Succeeded!");
      } else {
        console.log("Failed!");
      }
    });
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleFile = (e) => {
    const file = e.target.files[0];
    const fileName = e.target.value;
    setState({ ...state, image: file, fileName });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="image">Profile Image</label>
        <input
          type="file"
          id="image"
          name="file"
          file={state.image}
          value={state.fileName}
          onChange={handleFile}
        />
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          value={state.name}
          onChange={handleChange}
        />
        <label htmlFor="city">City</label>
        <input
          type="text"
          id="city"
          value={state.city}
          onChange={handleChange}
        />
        <label htmlFor="branch">Branch</label>
        <input
          type="text"
          id="branch"
          value={state.branch}
          onChange={handleChange}
        />
        <label htmlFor="phone">Contact</label>
        <input
          type="text"
          id="phone"
          value={state.phone}
          onChange={handleChange}
        />
        <input type="submit" value={id ? "Update" : "Error"} />
      </form>
    </div>
  );
}
