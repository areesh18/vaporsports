"use client";
import HeroShader from "@/components/HeroShader";
import LogoSvg from "@/components/LogoSvg";
export default function Hero() {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-white">
      <div className="absolute inset-[10px] rounded-2xl z-0 overflow-hidden ">
        <HeroShader />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  z-2 will-change-transform "
          style={{
            transformStyle: "preserve-3d",
            perspective: "1000px",
          }}
        >
          <LogoSvg className="w-[490px] h-[29px] -rotate-90 md:rotate-0" />
        </div>
      </div>
    </div>
  );
}
