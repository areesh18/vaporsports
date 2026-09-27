"use client";
import Image from "next/image";
import { useRef } from "react";
import Draggable from "react-draggable";
import { useState } from "react";
export default function InquiryForm() {
  const nodeRef = useRef(null);
  const [step, setStep] = useState(1);

  const previousStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const nextStep = () => {
    setStep((prev) => Math.min(prev + 1, 9));
  };
  const [activeType, setActiveType] = useState("Sample");
  return (
    <Draggable handle=".window-header" nodeRef={nodeRef}>
      <div
        ref={nodeRef}
        className="absolute right-[10px] bottom-[10px] w-[300px] h-[433px] bg-surface rounded-[10px] px-[5px] pb-[5px]"
      >
        <div className="w-full h-full flex flex-col">
          <div className="window-header cursor-grab h-[38px] w-full  flex items-center justify-start">
            <div className="px-[12px] w-fit h-full  flex items-center gap-[8px]">
              <button type="button" className="cursor-pointer">
                <Image
                  src="/icons/close.svg"
                  alt=""
                  width={12}
                  height={12}
                  className="select-none"
                />
              </button>
              <button type="button" className="cursor-pointer">
                <Image
                  src="/icons/resize.svg"
                  alt=""
                  width={12}
                  height={12}
                  className="select-none"
                />
              </button>
              {/* Chevrons add later */}
              <div className="flex items-center ">
                <button
                  type="button"
                  onClick={previousStep}
                  disabled={step === 1}
                  className="cursor-pointer disabled:opacity-30"
                >
                  <Image
                    src="/icons/chevron_left.svg"
                    alt=""
                    width={32}
                    height={38}
                    draggable={false}
                    className=" select-none"
                  />
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={step === 9}
                  className="-ml-[11px] cursor-pointer disabled:opacity-30"
                >
                  <Image
                    src="/icons/chevron_right.svg"
                    alt=""
                    width={32}
                    height={38}
                    draggable={false}
                    className=" select-none "
                  />
                </button>
              </div>
              <p className="font-sf text-muted text-[13px] font-bold tracking-[0px] leading-[16px]">
                Inquiry Form
              </p>
            </div>
          </div>
          <div className="h-full w-full flex flex-col rounded-[6px] bg-white p-[5px]">
            {/* Inquiry 1-9 nav */}
            <div className="w-full h-[32px] bg-surface rounded-[50px] p-[4px]">
              <div className="w-full h-full flex items-center gap-[4px]">
                {Array.from({ length: 9 }, (_, index) => {
                  const item = index + 1;
                  return (
                    <div
                      key={item}
                      className={`w-[27px] h-[24px] rounded-[50px] flex items-center justify-center ${step === item ? "bg-white" : ""}`}
                    >
                      <p className="font-sfmed text-[8px] leading-[16px]">
                        {String(item).padStart(2, "0")}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="relative w-full flex-1 flex items-center justify-center min-h-0 ">
              <p className="font-sfmed text-[8px] leading-[16px]">
                What are you looking for?
              </p>
              <div className="absolute bottom-0 w-fit h-[30px] rounded-[50px] bg-surface p-[4px]">
                <div className="w-full h-full flex items-center justify-center gap-[4px]">
                  {["Sample", "Bulk"].map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setActiveType(item)}
                      className={`h-full px-[8px] rounded-[50px] flex items-center justify-center cursor-pointer ${
                        activeType === item ? "bg-white" : ""
                      }`}
                    >
                      <span className="font-sfmed text-[8px] leading-[16px] tracking-[0%]" >
                        {item}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Draggable>
  );
}
