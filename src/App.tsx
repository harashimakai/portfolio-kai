import { Routes, Route, useLocation } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";

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
import CaseStudy from "./pages/CaseStudy";

const systemDark = () =>
  window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;

function App() {
  /* Theme: a choice made with the toggle is remembered; otherwise the
     site follows the system setting, including when it changes.         */
  const [darkMode, setDarkModeState] = useState<boolean>(() => {
    const stored = localStorage.getItem("theme");
    return stored ? stored === "dark" : systemDark();
  });
  const setDarkMode: React.Dispatch<React.SetStateAction<boolean>> =
    useCallback((next) => {
      setDarkModeState((prev) => {
        const value = typeof next === "function" ? next(prev) : next;
        localStorage.setItem("theme", value ? "dark" : "light");
        return value;
      });
    }, []);
  const [sideOpen, setSideOpen] = useState(false);
  /* A case study page carries its own palette for the whole page. */
  const path = useLocation().pathname;
  const study =
    path === "/putmeon" || path.startsWith("/work/") ? " theme-putmeon" : "";

  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!mq) return;
    const follow = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem("theme")) setDarkModeState(e.matches);
    };
    mq.addEventListener("change", follow);
    return () => mq.removeEventListener("change", follow);
  }, []);

  return (
    <div className={(darkMode ? "darkmode" : "lightmode") + study}>
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />
      <Sidebar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        sideOpen={sideOpen}
        setSideOpen={setSideOpen}
      />
      <div className="menu-container">
        <MenuButton
          sideOpen={sideOpen}
          setSideOpen={setSideOpen}
        />
      </div>
      <Routes>
        <Route
          path="/"
          element={<Home setSideOpen={setSideOpen} />}
        />
        <Route
          path="/work"
          element={<Work setSideOpen={setSideOpen} />}
        />
        <Route
          path="/art"
          element={<Art setSideOpen={setSideOpen} />}
        />
        <Route
          path="/about"
          element={<About setSideOpen={setSideOpen} />}
        />
        <Route
          path="/comingsoon"
          element={<ComingSoon setSideOpen={setSideOpen} />}
        />
        <Route
          path="/putmeon"
          element={
            <CaseStudy
              setSideOpen={setSideOpen}
              slug="putmeon"
            />
          }
        />
        <Route
          path="/work/:slug"
          element={<CaseStudy setSideOpen={setSideOpen} />}
        />
        <Route
          path="*"
          element={<NotFound setSideOpen={setSideOpen} />}
        />
      </Routes>
      <Socials />
    </div>
  );
}

export default App;
