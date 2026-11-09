import { useEffect, useRef, type VideoHTMLAttributes } from "react";

// Constants

const PRELOAD_MARGIN = "100px 0px";

// Types

type Props = Omit<VideoHTMLAttributes<HTMLVideoElement>, "autoPlay"> & {
  autoPlay?: boolean;
};

// Video

export default function InViewVideo({ autoPlay = false, preload, ...rest }: Props) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (autoPlay) video.play().catch(() => {});
        } else if (!video.paused) {
          video.pause();
        }
      },
      { rootMargin: PRELOAD_MARGIN },
    );
    io.observe(video);
    return () => io.disconnect();
  }, [autoPlay]);

  return (
    <video
      ref={ref}
      preload={preload ?? (autoPlay ? "none" : "metadata")}
      {...rest}
    />
  );
}
