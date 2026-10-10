import Image from "next/image";
import { useState,useEffect } from "react";
const images = ["/catalogue/1.png", "/catalogue/2.png", "/catalogue/3.png"];
export default function Catalogue({registerNavigation }) {
  const [index, setIndex] = useState(0);
  const previous = () => {
    setIndex((current) => (current - 1 + images.length) % images.length);
  };

  const next = () => {
    setIndex((current) => (current + 1) % images.length);
  };
  useEffect(() => {
    registerNavigation?.({ previous, next });
  }, [registerNavigation]);
  return (
    <div className="relative w-full h-full flex items-center justify-center ">
      <Image
        src={images[index]}
        fill
        alt="Catalogue Tshirt"
        className="object-cover object-top"
      />
    </div>
  );
}
