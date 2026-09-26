"use client";
import HeroShader from "@/components/HeroShader";
import Information from "@/components/window_content/Information";
import LogoSvg from "@/components/LogoSvg";
import Window from "@/components/Window";
import Catalogue from "@/components/window_content/Catalogue";
import Video from "@/components/window_content/Video";
import Credits from "@/components/window_content/Credits";
export default function Hero() {
  return (
    <div className="relative h-screen w-full bg-white">
      <div className="absolute inset-[10px] rounded-2xl overflow-hidden z-0 bg-black ">
        {/* <HeroShader /> */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  z-2 will-change-transform "
          style={{
            transformStyle: "preserve-3d",
            perspective: "1000px",
          }}
        >
          <LogoSvg className="w-[490px] h-[29px] -rotate-90 md:rotate-0" />
        </div>
        <Window title="Information" className="left-[10px] top-[10px] w-[418px] h-[309px]">
          <Information />
        </Window>
        <Window title="Catalogue" className="left-[10px] bottom-[10px] w-[310px] h-[343px]">
          <Catalogue/>
        </Window>
        <Window title="Video" className="right-[244px] top-[10px] w-[310px] h-[343px]">
          <Video/>
        </Window>
        <Window title="Credits" className="right-[15px] top-[10px] w-[210px] h-[243px]">
          <Credits/>
        </Window>
      </div>
    </div>
  );
}
