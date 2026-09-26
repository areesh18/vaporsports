import Image from "next/image";
export default function Video() {
  return (
    <div className="relative w-full h-full flex items-center justify-center ">
      <Image src='/videotb.png' fill alt="Video" />
    </div>
  );
}
