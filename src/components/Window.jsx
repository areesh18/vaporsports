"use client";
import Image from "next/image";
export default function Window({ title, children, className = "" }) {
  return (
    <div
      className={`absolute bg-surface rounded-[10px] px-[5px] pb-[5px] ${className}`}
    >
      <div className="w-full h-full flex flex-col">
        <div className="h-[38px] w-full  flex items-center justify-start">
          <div className="px-[12px] w-fit h-full  flex items-center gap-[8px]">
            <button type="button" className="cursor-pointer">
              <Image src="/icons/close.svg" alt="" width={12} height={12} />
            </button>
            <button type="button" className="cursor-pointer">
              <Image src="/icons/resize.svg" alt="" width={12} height={12} />
            </button>
            {/* Chevrons add later */}
            <Image src="/icons/chevron.svg" alt="" width={53} height={38} />
            <p className="font-sf text-muted text-[13px] font-bold tracking-[0px] leading-[16px]">
              {title}
            </p>
          </div>
        </div>
        <div className="h-full w-full rounded-[6px] bg-white">{children}</div>
      </div>
    </div>
  );
}
