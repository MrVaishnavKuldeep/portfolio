"use client";

import React, { useRef, useEffect, useState } from "react";

interface ChromaKeyVideoProps {
  src: string;
  className?: string;
  shadowColor?: string;
  threshold?: number;   // Minimum difference G - max(R,B) to start keying out
  smoothness?: number;  // Range over which alpha transitions to 0
}

export default function ChromaKeyVideo({
  src,
  className = "",
  shadowColor,
  threshold = 15,
  smoothness = 10,
}: ChromaKeyVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 200, height: 440 });
  const [isVisible, setIsVisible] = useState(true);

  // Use Intersection Observer to play/pause and trigger canvas processing
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    let animationFrameId: number;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const MAX_WIDTH = 400; // Resolution cap for fast processing and crisp high-DPI scaling

    const handleLoadedMetadata = () => {
      const vWidth = video.videoWidth;
      const vHeight = video.videoHeight;
      if (vWidth && vHeight) {
        // Capping resolution to ensure rapid processing under 1.5ms per frame
        const scale = Math.min(1, MAX_WIDTH / vWidth);
        const targetWidth = Math.round(vWidth * scale);
        const targetHeight = Math.round(vHeight * scale);

        setDimensions({ width: targetWidth, height: targetHeight });
        canvas.width = targetWidth;
        canvas.height = targetHeight;
      }
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    if (video.videoWidth) {
      handleLoadedMetadata();
    }

    const processFrame = () => {
      if (!video || !canvas || !ctx || !isVisible) {
        animationFrameId = requestAnimationFrame(processFrame);
        return;
      }

      if (video.paused || video.ended) {
        animationFrameId = requestAnimationFrame(processFrame);
        return;
      }

      const { width, height } = canvas;
      if (width === 0 || height === 0) {
        animationFrameId = requestAnimationFrame(processFrame);
        return;
      }

      // Draw current video frame onto canvas (automatically handles downscaling)
      ctx.drawImage(video, 0, 0, width, height);

      // Extract pixel data
      const frame = ctx.getImageData(0, 0, width, height);
      const data = frame.data;
      const length = data.length;

      // Greenness-Dominance Chroma Keying + De-Spill Filter
      for (let i = 0; i < length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Greenness: excess of green over the maximum of red and blue
        const maxRedBlue = r > b ? r : b;
        const greenness = g - maxRedBlue;

        // Apply real-time de-spill: if a pixel has a green tint, clamp G to max(R,B)
        let finalR = r;
        let finalG = g;
        let finalB = b;

        if (greenness > 0) {
          finalG = maxRedBlue; // Turns any green spill reflection into a clean neutral tone
        }

        if (greenness > threshold + smoothness) {
          data[i + 3] = 0; // fully transparent green screen
        } else if (greenness > threshold) {
          // Soft feathered transition zone
          const factor = (greenness - threshold) / smoothness;
          data[i + 3] = Math.round((1 - factor) * 255);
          
          // Apply the de-spilled color for the semi-transparent feathered edge
          data[i] = finalR;
          data[i + 1] = finalG;
          data[i + 2] = finalB;
        } else {
          data[i + 3] = 255; // fully opaque character
          
          // Apply the de-spilled color for the character itself (removes any ambient green reflections on skin/hair)
          data[i] = finalR;
          data[i + 1] = finalG;
          data[i + 2] = finalB;
        }
      }

      // Render updated frame with transparency back onto canvas
      ctx.putImageData(frame, 0, 0);

      animationFrameId = requestAnimationFrame(processFrame);
    };

    if (isVisible) {
      video.play()
        .then(() => {
          animationFrameId = requestAnimationFrame(processFrame);
        })
        .catch((err) => {
          console.warn("Autoplay blocked, waiting for user interaction:", err);
          animationFrameId = requestAnimationFrame(processFrame);
        });
    } else {
      video.pause();
    }

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      cancelAnimationFrame(animationFrameId);
    };
  }, [src, isVisible, threshold, smoothness]);

  return (
    <div ref={containerRef} className={`relative flex items-center justify-center ${className}`}>
      {/* Hidden original video */}
      <video
        ref={videoRef}
        src={src}
        muted
        loop
        playsInline
        autoPlay
        className="absolute left-0 top-0 h-0 w-0 opacity-0 pointer-events-none"
      />
      {/* Dynamic Keyed Canvas */}
      <canvas
        ref={canvasRef}
        className="block max-w-full"
        style={{
          width: "100%",
          height: "auto",
          filter: shadowColor ? `drop-shadow(${shadowColor})` : undefined,
        }}
      />
    </div>
  );
}
