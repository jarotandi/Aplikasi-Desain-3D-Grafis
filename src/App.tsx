import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Editor from "./pages/Editor";
import Templates from "./pages/Templates";
import Marketplace from "./pages/Marketplace";
import Print from "./pages/Print";
import Community from "./pages/Community";
import Admin from "./pages/Admin";

function App() {
  const location = useLocation();
  const isEditor = location.pathname === "/editor";
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      {!isEditor && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/editor" element={<Editor />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/print" element={<Print />} />
        <Route path="/community" element={<Community />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
      {!isEditor && !isAuthPage && <Footer />}
    </div>
  );
}

export default App;
