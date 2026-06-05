import { useEffect } from "react";

import "../../css/work.css";
import { byId, type Project } from "../global/ProjectData";
import { Navigate } from "react-router-dom";

interface Props {
  id: string;
  onClose?: () => void;
  plateNum?: number;
}
export default function PageView({ id, onClose, plateNum }: Props) {
  const project: Project | undefined = id ? byId[id] : undefined;

  useEffect(() => {
    if (!onClose) window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!onClose) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!project) {
    if (onClose) {
      onClose();
      return null;
    }
    return (
      <Navigate
        to="/404"
        replace
      />
    );
  }

  return (
    <div className="page-view-content">
      <aside className="page-view-left">
        <div className="page-view-left-meta">
          <span
            onClick={onClose}
            style={onClose ? { cursor: "pointer" } : undefined}
          >
            ↩ Esc
          </span>
          <span>Plate {plateNum ?? project.id} of 09</span>
        </div>
        <div>
          <h2>// SELECTED WORK · 0{plateNum ?? project.id}</h2>
          <h1 className="page-view-title">{project.title}</h1>
        </div>
        <div className="page-view-context">
          <span className="page-view-context-label">Year</span>
          <span>{project.year}</span>
          <span className="page-view-context-label">Medium</span>
          <span>{project.medium}</span>
          <span className="page-view-context-label">Skills</span>
          <span>{project.skills}</span>
        </div>
        <p className="page-view-description">{project.shortDescription}</p>
        <hr />
      </aside>
      <div
        className="page-view-right"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose?.();
        }}
      >
        <figure>
          <div className="page-view-image-data">
            <span className="page-view-image-label">{project.title}</span>
            <div className="page-view-image-divider" />
            <span>Frame</span>
          </div>
          <div className="page-view-image-container">
            <img
              src={project.thumbnailUrl}
              alt={project.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                display: "block",
                pointerEvents: "none",
              }}
            />
          </div>
        </figure>
      </div>
    </div>
  );
}
