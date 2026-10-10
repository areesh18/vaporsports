"use client";
import HeroShader from "@/components/HeroShader";
import Information from "@/components/window_content/Information";
import LogoSvg from "@/components/LogoSvg";
import Window from "@/components/Window";
import Catalogue from "@/components/window_content/Catalogue";
import Video from "@/components/window_content/Video";
import Credits from "@/components/window_content/Credits";
import InquiryForm from "@/components/window_content/InquiryForm/InquiryForm";
import { useState, useCallback } from "react";
const BASE_Z = 60;
export default function Hero() {
  const [order, setOrder] = useState([
    "information",
    "video",
    "catalogue",
    "credits",
    "inquiry",
  ]);
  const bringToFront = (id) =>
    setOrder((prev) =>
      prev[prev.length - 1] === id
        ? prev
        : [...prev.filter((i) => i !== id), id],
    );

  const zOf = (id) => BASE_Z + order.indexOf(id);
  const [catalogueNavigation, setCatalogueNavigation] = useState(null);

  const registerCatalogueNavigation = useCallback((navigation) => {
    setCatalogueNavigation(() => navigation);
  }, []);
  return (
    <div className="relative h-dvh w-full bg-white">
      <div className="absolute inset-[5px] md:inset-[10px] rounded-2xl overflow-hidden z-0 bg-black ">
        <HeroShader />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  z-0 will-change-transform "
          style={{
            transformStyle: "preserve-3d",
            perspective: "1000px",
          }}
        >
          <LogoSvg className="w-[490px] h-[29px] -rotate-90 md:rotate-0" />
        </div>
        <Window
          title="Information"
          zIndex={zOf("information")}
          onFocus={() => bringToFront("information")}
          className=" left-[10px] top-[10px] max-md:top-[5px] max-md:left-1/2 max-md:-translate-x-1/2 w-[384px] h-[269px]"
        >
          <Information />
        </Window>
        <Window
          title="Catalogue"
          onPrevious={catalogueNavigation?.previous}
          onNext={catalogueNavigation?.next}
          zIndex={zOf("catalogue")}
          onFocus={() => bringToFront("catalogue")}
          className=" left-[10px] bottom-[10px] max-md:left-auto max-md:right-[3vw] max-md:bottom-[21vh] w-[310px] h-[343px]"
        >
          <Catalogue registerNavigation={registerCatalogueNavigation} />
        </Window>
        <Window
          title="Video"
          zIndex={zOf("video")}
          onFocus={() => bringToFront("video")}
          className=" right-[244px] top-[10px] max-md:right-auto max-md:left-[3vw] max-md:top-[34.5vh] w-[310px] h-[343px]"
        >
          <Video />
        </Window>
        <Window
          title="Credits"
          zIndex={zOf("credits")}
          onFocus={() => bringToFront("credits")}
          className=" right-[15px] top-[10px] max-md:top-auto max-md:bottom-[6.6vw] max-md:left-1/2 max-md:-translate-x-1/2 w-[210px] h-[243px]"
        >
          <Credits />
        </Window>
        <InquiryForm
          zIndex={zOf("inquiry")}
          onFocus={() => bringToFront("inquiry")}
        />
      </div>
    </div>
  );
}
