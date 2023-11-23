import React, { useState } from "react";
import "./SearchBar.css";

export default function SearchBar({ data, onSearch }) {
  const [bar, setBar] = useState("");
  const handleChange = (e) => {
    const searchName = e.target.value.toLowerCase().trim();
    setBar(searchName);
    const filteredData = data.filter((d) =>
      d.name.toLowerCase().includes(searchName)
    );
    onSearch(filteredData);
  };

  return (
    <div className="search-bar-container">
      <input
        className="search_bar"
        type="text"
        placeholder="Search your employee"
        value={bar}
        onChange={handleChange}
      />
    </div>
  );
}
