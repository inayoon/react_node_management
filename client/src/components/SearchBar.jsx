import React, { useState } from "react";

export default function SearchBar({ data, onSearch }) {
  const [bar, setBar] = useState("");
  const handleChange = (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();
    setBar(searchTerm);
    const filteredData = data.filter((d) =>
      d.name.toLowerCase().includes(searchTerm)
    );
    onSearch(filteredData);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search your employee"
        value={bar}
        onChange={handleChange}
      />
    </div>
  );
}
