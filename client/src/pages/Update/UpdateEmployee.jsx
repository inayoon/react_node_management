import React, { useState, useEffect } from "react";
import "./UpdateEmployee.css";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

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
  const [files, setFiles] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  console.log(state);
  useEffect(() => {
    axios.get(`http://localhost:5000/employees/${id}`).then((response) => {
      setState(response.data[0]);
      setFiles(
        response.data[0].image
          ? `http://localhost:5000/images/${response.data[0].image}`
          : null
      );
    });
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleFile = (e) => {
    const file = e.target.files[0];
    const fileName = e.target.value;
    setState((prev) => ({
      ...prev,
      image: file || prev.image, // 이미지를 선택하지 않은 경우 현재 이미지를 그대로 사용
      fileName: fileName,
    }));

    if (file) {
      setFiles(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", state.name);
    formData.append("profession", state.profession);
    formData.append("city", state.city);
    formData.append("phone", state.phone);
    formData.append("branch", state.branch);

    if (state.image) {
      formData.append("image", state.image);
    }

    axios.put(`http://localhost:5000/update/${id}`, formData).then((res) => {
      if (res.data.Status === "Success") {
        // 이미지가 수정되었으면 새로운 이미지로 업데이트
        setFiles(
          res.data.ImagePath
            ? `http://localhost:5000/${res.data.ImagePath}`
            : null
        );
        toast.success("Employee successfully updated!");
      } else {
        console.log("Failed!", res.data.Error);
      }

      setTimeout(() => navigate("/"), 300);
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <img
          className="preview-image"
          src={
            files ||
            "https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-for-website-design-or-mobile-app-no-photo-available_87543-11093.jpg?w=826"
          }
          alt="Preview"
        />

        <label htmlFor="image">Profile Image</label>
        <input
          type="file"
          id="image"
          name="file"
          file={state.image || ""}
          value={state.fileName || ""}
          onChange={handleFile}
        />
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={state.name || ""}
          onChange={handleInputChange}
        />
        <label htmlFor="city">City</label>
        <input
          type="text"
          id="city"
          name="city"
          value={state.city || ""}
          onChange={handleInputChange}
        />
        <label htmlFor="branch">Branch</label>
        <input
          type="text"
          id="branch"
          name="branch"
          value={state.branch || ""}
          onChange={handleInputChange}
        />
        <label htmlFor="phone">Contact</label>
        <input
          type="text"
          id="phone"
          name="phone"
          value={state.phone || ""}
          onChange={handleInputChange}
        />
        <input type="submit" value={id ? "Update" : "Error"} />
      </form>
    </div>
  );
}
