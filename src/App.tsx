import "./styles/index.css";
import { Suspense, lazy, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import MobileMenu from "./components/layout/MobileMenu";
import Footer from "./components/layout/Footer";
import Cursor from "./components/ui/Cursor";
import EmailCopy from "./components/ui/EmailCopy";
import Home from "./pages/Home";
import { useTheme } from "./context/ThemeContext";
import { studyList, studyPath, studyForPath } from "./data/caseStudies";
import { templateStudy } from "./data/template";

// Pages other than Home are split into their own chunks so the first load
// only ships what the landing page needs. They're prefetched once the
// browser is idle, so navigating to them stays instant.
const pages = {
  work: () => import("./pages/Work"),
  art: () => import("./pages/Art"),
  about: () => import("./pages/About"),
  caseStudy: () => import("./pages/CaseStudy"),
  notFound: () => import("./pages/NotFound"),
};
const Work = lazy(pages.work);
const Art = lazy(pages.art);
const About = lazy(pages.about);
const CaseStudy = lazy(pages.caseStudy);
const NotFound = lazy(pages.notFound);

function prefetchPages() {
  const run = () => Object.values(pages).forEach((load) => load());
  if ("requestIdleCallback" in window) window.requestIdleCallback(run);
  else setTimeout(run, 1500);
}

export default function App() {
  const { darkMode } = useTheme();
  const { pathname } = useLocation();
  const study = studyForPath(pathname);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(prefetchPages, []);

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
      <Suspense fallback={null}>
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
      </Suspense>
      <Footer />
      <Cursor />
      <EmailCopy />
    </div>
  );
}
