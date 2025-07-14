import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";

const App = () => {
  return (
 <>
 <Navbar />
      <div className="p-4">
        <Routes>
          <Route path="/" element={<h2 className="text-center mt-10 text-xl">Welcome to Hospital App</h2>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
 </>
      
  );
};

export default App;