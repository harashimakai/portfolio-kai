import "./styles/index.css";
import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import MobileMenu from "./components/layout/MobileMenu";
import Footer from "./components/layout/Footer";
import Cursor from "./components/ui/Cursor";
import EmailCopy from "./components/ui/EmailCopy";
import Home from "./pages/Home";
import Work from "./pages/Work";
import Art from "./pages/Art";
import About from "./pages/About";
import CaseStudy from "./pages/CaseStudy";
import NotFound from "./pages/NotFound";
import { useTheme } from "./context/ThemeContext";
import { studyList, studyPath, studyForPath } from "./data/caseStudies";
import { templateStudy } from "./data/template";

export default function App() {
  const { darkMode } = useTheme();
  const { pathname } = useLocation();
  const study = studyForPath(pathname);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const classes = [
    darkMode ? "theme-dark" : "theme-light",
    study && `palette-${study.slug}`,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes}>
      <Navbar />
      <MobileMenu />
      <Routes>
        <Route
          path="/"
          element={<Home />}
        />
        <Route
          path="/work"
          element={<Work />}
        />
        <Route
          path="/art"
          element={<Art />}
        />
        <Route
          path="/about"
          element={<About />}
        />
        {studyList.map((d) => (
          <Route
            key={d.slug}
            path={studyPath(d)}
            element={<CaseStudy study={d} />}
          />
        ))}
        <Route
          path="/template"
          element={<CaseStudy study={templateStudy} />}
        />
        <Route
          path="*"
          element={<NotFound />}
        />
      </Routes>
      <Footer />
      <Cursor />
      <EmailCopy />
    </div>
  );
}
