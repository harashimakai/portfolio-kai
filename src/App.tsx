import { Suspense, lazy, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import MobileMenu from "./components/layout/MobileMenu";
import Footer from "./components/layout/Footer";
import Cursor from "./components/ui/Cursor";
import EmailCopy from "./components/ui/EmailCopy";
import Home from "./pages/Home";
import { useTheme } from "./context/ThemeContext";
import { studyList, studyForPath } from "./data/caseStudies";

import "./styles/index.css";

// Constants

const PREFETCH_FALLBACK_MS = 1500;

// Pages

const pages = {
  work: () => import("./pages/Work"),
  art: () => import("./pages/Art"),
  about: () => import("./pages/About"),
  notFound: () => import("./pages/NotFound"),
};
const Work = lazy(pages.work);
const Art = lazy(pages.art);
const About = lazy(pages.about);
const NotFound = lazy(pages.notFound);
const Template = lazy(() => import("./pages/case-studies/Template"));
const studyRoutes = studyList.map((d) => ({ ...d, Page: lazy(d.load) }));

// Prefetch

function prefetchPages() {
  const loaders = [...Object.values(pages), ...studyList.map((d) => d.load)];
  const run = () => loaders.forEach((load) => load());
  if ("requestIdleCallback" in window) window.requestIdleCallback(run);
  else setTimeout(run, PREFETCH_FALLBACK_MS);
}

// App

export default function App() {
  const { darkMode } = useTheme();
  const { pathname } = useLocation();
  const study = studyForPath(pathname);

  // Effects

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
          {studyRoutes.map(({ slug, path, Page }) => (
            <Route
              key={slug}
              path={path}
              element={<Page />}
            />
          ))}
          <Route
            path="/template"
            element={<Template />}
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
