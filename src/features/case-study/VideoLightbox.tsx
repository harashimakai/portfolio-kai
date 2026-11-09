import { useEffect, useRef, useState, type CSSProperties } from "react";

import useDialog from "../../hooks/useDialog";

// Constants

const DEFAULT_VIDEO_RATIO = 16 / 9;

// Types

interface Props {
  src: string;
  poster: string;
  open: boolean;
  startAt: number;
  onClose: () => void;
}

// Video lightbox

export default function VideoLightbox({
  src,
  poster,
  open,
  startAt,
  onClose,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mounted, setMounted] = useState(false);
  const [ratio, setRatio] = useState(DEFAULT_VIDEO_RATIO);

  useEffect(() => {
    if (open) setMounted(true);
  }, [open]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (open) {
      video.currentTime = startAt;
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [open, mounted, startAt]);

  useDialog(rootRef, { open, onClose, initialFocus: closeRef });

  return (
    <div
      ref={rootRef}
      className="lightbox lightbox-video"
      data-open={open ? "true" : "false"}
      role="dialog"
      aria-modal="true"
      aria-hidden={!open}
      aria-label="Video"
      onClick={onClose}
    >
      <div className="lightbox-bar">
        <button
          ref={closeRef}
          type="button"
          className="lightbox-control"
          onClick={onClose}
          aria-label="Close"
          tabIndex={open ? 0 : -1}
        >
          <span className="text-label">Close</span>
        </button>
      </div>
      <div className="lightbox-inner">
        {mounted && (
          <video
            ref={videoRef}
            className="lightbox-video-player"
            src={src}
            poster={poster}
            style={{ "--video-ratio": ratio } as CSSProperties}
            onLoadedMetadata={(e) => {
              const { videoWidth, videoHeight } = e.currentTarget;
              if (videoWidth && videoHeight) setRatio(videoWidth / videoHeight);
            }}
            loop
            playsInline
            onClick={(e) => e.stopPropagation()}
          />
        )}
      </div>
    </div>
  );
}
