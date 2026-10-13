import Image from "next/image";
export default function Credits() {
  return (
    <div className="relative w-full h-full flex items-center justify-center ">
      <Image src="/Credits.png" preload fill alt="Credits" />
      <a
        href="https://lastsignal.studio"
        target="_blank"
        rel="noopener noreferrer"
        className="cursor-pointer w-full h-[20%] bg-transparent absolute"
      ></a>
    </div>
  );
}
