"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const mouseEffectRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const circleFollowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!circleRef.current || !circleFollowRef.current) return;

    gsap.set(circleRef.current, { xPercent: -50, yPercent: -50 });
    gsap.set(circleFollowRef.current, { xPercent: -50, yPercent: -50 });

    const xTo = gsap.quickTo(circleRef.current, "x", { duration: 0.15, ease: "power2.out" });
    const yTo = gsap.quickTo(circleRef.current, "y", { duration: 0.15, ease: "power2.out" });
    const xFollow = gsap.quickTo(circleFollowRef.current, "x", { duration: 0.3, ease: "power2.out" });
    const yFollow = gsap.quickTo(circleFollowRef.current, "y", { duration: 0.3, ease: "power2.out" });

    const onMouseMove = (event: MouseEvent) => {
      xTo(event.clientX);
      yTo(event.clientY);
      xFollow(event.clientX);
      yFollow(event.clientY);

      if (mouseEffectRef.current) {
        mouseEffectRef.current.style.opacity = "1";
      }
    };

    window.addEventListener("mousemove", onMouseMove);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <div
      ref={mouseEffectRef}
      className="fixed top-0 left-0 opacity-0 pointer-events-none hidden md:block"
      style={{ zIndex: 99999 }}
    >
      <div
        ref={circleRef}
        className="absolute bg-gray-900 w-[10px] h-[10px] rounded-full"
      />
      <div
        ref={circleFollowRef}
        className="absolute border border-gray-900 w-[40px] h-[40px] rounded-full"
      />
    </div>
  );
}

