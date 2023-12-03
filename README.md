# Employee Management Program


![ezgif com-crop](https://github.com/inayoon/react_node_management/assets/100747899/e3a12efd-f1af-42ef-b5ba-6b27bd56e4a1)


This project is an application designed to manage employee information. It allows users to view and update employee details such as name, profession, branch, contact information, and profile image. The information can be added, modified, or deleted, and the changes are synchronized with the database whenever any update is made.

- `node/express` backend for API calls
- `MySQL` database with employee schema to demonstrate functionality
- `React` frontend to demonstrate functionality

## Key Implementation Screens and Features

| 1.Main Page                                                                                                                                | 2.Search Employee                                                                                                                            |
| ------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| <img width="450" alt="home_ms" src="https://github.com/inayoon/react_node_management/assets/100747899/06fd89fd-e114-4998-825a-a331a07039bc"> | <img width="450" alt="search_ms" src="https://github.com/inayoon/react_node_management/assets/100747899/e67ebc94-6b06-4433-8725-6b8cf51a2376"> |

| 3. Add Employee                                                                                                                           | 4.Edit Employee                                                                                                                            |
| ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| <img width="450" alt="add_md" src="https://github.com/inayoon/react_node_management/assets/100747899/cd9c4515-4305-4531-bdd0-624833f360b6"> | <img width="450" alt="edit_ms" src="https://github.com/inayoon/react_node_management/assets/100747899/bf46af8f-5e96-498c-a7cd-a5d88dacdb8a"> |

| 5.Delete Selected Employees                                                                                                                           |
| ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| <img width="450" alt="checked_deleted_ms" src="https://github.com/inayoon/react_node_management/assets/100747899/57c1cc42-048d-4f94-8c86-15dca9fa88c7"> |

### 1. Home page - Pagination Feature

- implemented a pagination feature on the homepage to control the maximum number of displayed items per page. This allows users to navigate through multiple pages when the dataset exceeds the predefined limit.

```javascript
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
...
...

//pagination part
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
...

//implemented functions for navigating back and forth between pages
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
```

<br>
<br>

### 2. Add and Edit page - Preview Feature for Attached Profile Images

- Implemented a preview feature that allows users to instantly view their uploaded images when registering. Added the `<img>` tag to display a default image when no image is attached. When an image is attached, the FileReader object is used to dynamically change the preview image's data URL.

```javascript
export default function UpdateEmployee() {
  const [state, setState] = useState(initialState);
  const [files, setFiles] = useState(null);
  const handleFile = (e) => {
    const file = e.target.files[0];
    const fileName = e.target.value;
    setState((prev) => ({
      ...prev,
      image: file || prev.image, // If user didn't change the image, use the previous one
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
        // If the image is modified, update with new one by setFiles
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
    // preveiw image screen part
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
        ...
        ....
  )
}
```

<br>
<br>

### 3. Delete - Batch Delete Feature after Selecting Data

- implemented the ability to delete multiple selected employees' information using checkboxes.

```javascript
export default function Home() {
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const handleAllDelete = async () => {
    if (
      selectedEmployees.length > 0 &&
      window.confirm("Are you sure you want to delete these employees?")
    ) {
      try {
        await axios.delete("http://localhost:5000/employees", {
          data: { ids: selectedEmployees },
        });
        toast.success("employees deleted successfully");
        loadData();
        setSelectedEmployees([]);
      } catch (error) {
        console.error("Error deleting employees", error);
      }
    }
  };
  return(
    <div style={{ marginTop: "60px" }}>
      <div className="search">
        <SearchBar data={data} onSearch={handleSearch} />
        <Link to="/add">
          <button className="btn btn-add">Add Employee</button>
        </Link>
        //Delete Button UI with onClick
        <button className="btn btn-delete-2" onClick={handleAllDelete}>
          Delete Selected Employees
        </button>
        ...
        ...
      <tbody>
          {records.map((item, index) => {
            const uniqueIndex = firstIndex + index + 1;
            return (
              <tr key={item.id}>
                <td>
                  //Checkbox UI for each employee to select data
                  <input
                    type="checkbox"
                    onChange={() => handleChange(item.id)}
                    checked={selectedEmployees.includes(item.id)}
                  />
                </td>
            ...
  )
}
```

<br>
<br>

## User Flow Diagram

<img width="400" alt="user_flow_ms" src="https://github.com/inayoon/react_node_management/assets/100747899/0cfa7d6d-f762-4ade-9df0-19565184bdc9">
