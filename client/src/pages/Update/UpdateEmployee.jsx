import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useParams } from "react-router-dom";

const initialState = {
  file: null,
  name: "",
  city: "",
  branch: "",
  contact: "",
  fileName: "",
};

export default function UpdateEmployee() {
  const [state, setState] = useState(initialState);
  const location = useLocation();
  // const { item } = location.state;
  // const { name } = item;
  const { id } = useParams();
  useEffect(() => {
    axios.get(`http://localhost:5000/employees/${id}`).then((resp) => {
      setState({ ...resp.data[0] });
    });
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
  };
  const handleChange = (e) => {
    const { value } = e.target;
    setState({ ...state, name: value });
  };
  console.log(state);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          value={state.name}
          onChange={handleChange}
        />
        <input type="submit" value={id ? "Update" : "Error"} />
      </form>
    </div>
  );
}
