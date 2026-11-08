import { useEffect, useRef, type VideoHTMLAttributes } from "react";

type Props = Omit<VideoHTMLAttributes<HTMLVideoElement>, "autoPlay"> & {
  /** Start playing when scrolled into view (muted, looping media). Otherwise
   *  the video only gets paused when it leaves the viewport. */
  autoPlay?: boolean;
};

/**
 * A <video> that only plays while it is on screen. Off-screen videos are
 * paused so they don't keep decoding in the background, and autoplaying
 * ones don't download until they're near the viewport.
 */
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
      { rootMargin: "100px 0px" },
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
