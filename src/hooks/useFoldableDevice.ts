import { useState, useEffect } from 'react';

export const useFoldableDevice = () => {
  const [isFoldableHardware, setIsFoldableHardware] = useState(false);
  const [isUnfolded, setIsUnfolded] = useState(false);

  useEffect(() => {
    const checkFoldableState = () => {
      // 1. Check Chromium Viewport Segments & Device Posture APIs
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const segments = (window as any).viewport?.segments;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const posture = (navigator as any).devicePosture?.type;
      const hasMultiSegment = Array.isArray(segments) && segments.length > 1;
      const hasFoldableAPI = 'devicePosture' in navigator || 'viewport' in window;

      // 2. Check unfolded square-ish aspect ratio heuristic (e.g., 600px–900px width, ~1:1 to 4:3 ratio)
      const width = window.innerWidth;
      const height = window.innerHeight;
      const aspectRatio = width / height;
      const isSquareUnfolded = width >= 580 && width <= 950 && aspectRatio >= 0.75 && aspectRatio <= 1.35;

      // Determine if device is foldable-capable
      const detectedFoldable = hasMultiSegment || posture === 'folded' || (hasFoldableAPI && isSquareUnfolded) || isSquareUnfolded;
      
      setIsFoldableHardware(detectedFoldable);
      setIsUnfolded(hasMultiSegment || isSquareUnfolded);
    };

    checkFoldableState();
    window.addEventListener('resize', checkFoldableState);
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const devicePosture = (navigator as any).devicePosture;
    if (devicePosture?.addEventListener) {
      devicePosture.addEventListener('change', checkFoldableState);
    }

    return () => {
      window.removeEventListener('resize', checkFoldableState);
      if (devicePosture?.removeEventListener) {
        devicePosture.removeEventListener('change', checkFoldableState);
      }
    };
  }, []);

  return { isFoldableHardware, isUnfolded };
};
