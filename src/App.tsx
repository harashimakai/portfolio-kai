import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";

import "./css/tokens.css";
import "./css/global.css";

import Home from "./pages/Home";
import Work from "./pages/Work";
import About from "./pages/About";
import Navbar from "./components/global/Navbar";
import MenuButton from "./components/global/MenuButton";
import Sidebar from "./components/global/Sidebar";
import Socials from "./components/global/Socials";
import ComingSoon from "./pages/ComingSoon";
import Art from "./pages/Art";
import NotFound from "./pages/NotFound";

function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("theme") === "dark";
  });
  const [sideOpen, setSideOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <div className={darkMode ? "darkmode" : "lightmode"}>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <Sidebar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        sideOpen={sideOpen}
      />
      <div className="menu-container">
        <MenuButton sideOpen={sideOpen} setSideOpen={setSideOpen} />
      </div>
      <Routes>
        <Route path="/" element={<Home setSideOpen={setSideOpen} />} />
        <Route path="/work" element={<Work setSideOpen={setSideOpen} />} />
        <Route path="/art" element={<Art setSideOpen={setSideOpen} />} />
        <Route path="/about" element={<About setSideOpen={setSideOpen} />} />
        <Route
          path="/comingsoon"
          element={<ComingSoon setSideOpen={setSideOpen} />}
        />
        <Route path="*" element={<NotFound setSideOpen={setSideOpen} />} />
      </Routes>
      <Socials></Socials>
    </div>
  );
}

export default App;
