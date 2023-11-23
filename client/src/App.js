import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Header from "./components/Header";
import Home from "./pages/Home/Home";
import AddEmployee from "./pages/Add/AddEmployee";
import { useState } from "react";
import UpdateEmployee from "./pages/Update/UpdateEmployee";

function App() {
  // const [data, setData] = useState([]);
  // const handleUpdateEmployee = (updatedEmployee) => {
  //   const updatedEmployees = data.map((employee) =>
  //     employee.id === updatedEmployee.id ? updatedEmployee : employee
  //   );
  //   setData(updatedEmployees);
  // };

  return (
    <BrowserRouter>
      <Header user="Ina Yoon" />
      <div className="App">
        <ToastContainer position="top-center" />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/update/:id" element={<UpdateEmployee />} />
          <Route path="/add" element={<AddEmployee />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
