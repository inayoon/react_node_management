import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Header from "./components/Header";
import Home from "./pages/Home/Home";
import AddEmployee from "./pages/Update/UpdateEmployee";

function App() {
  return (
    <BrowserRouter>
      <Header user="Ina Yoon" />
      <div className="App">
        <ToastContainer position="top-center" />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/update/:id" element={<AddEmployee />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
