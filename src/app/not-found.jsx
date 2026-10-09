"use client";

import HeroShader from "@/components/HeroShader";
import Svg404 from "@/components/Svg404";

export default function NotFound() {
  return (
    <div className="relative h-dvh w-full bg-white">
      <div className="absolute inset-[5px] md:inset-[10px] rounded-2xl overflow-hidden z-0 bg-black">
        <HeroShader />

        {/* Red shader tint */}
        <div className="absolute inset-0 z-10 bg-[#ff0000] mix-blend-color pointer-events-none" />

        {/* Center message */}
        <div
          className="absolute z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  will-change-transform "
          style={{
            transformStyle: "preserve-3d",
            perspective: "1000px",
          }}
        >
          <Svg404 className="w-[337px] h-[61px] -rotate-90 md:rotate-0" />
        </div>
      </div>
    </div>
  );
}
