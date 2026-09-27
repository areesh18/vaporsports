"use client";
import Image from "next/image";
import { useRef } from "react";
import Draggable from "react-draggable";
import { useState } from "react";
import { useEffect, useMemo } from "react";
export default function InquiryForm() {
  const nodeRef = useRef(null);
  const [step, setStep] = useState(1);

  const previousStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const nextStep = () => {
    setStep((prev) => Math.min(prev + 1, 9));
  };

  const [formData, setFormData] = useState({
    type: "Sample",
    category: "Leather Wear",
    productType: null,
    printMethod: null,

    productDetails: {
      quantity: "",
      sizes: [],
      color: null,
      notes: "",
    },

    design: [],

    branding: null,
    packaging: null,

    contact: {
      name: "",
      email: "",
      phone: "",
      company: "",
    },
  });
  const renderStep = () => {
    switch (step) {
      case 1:
        return <StepOne formData={formData} setFormData={setFormData} />;

      case 2:
        return <StepTwo formData={formData} setFormData={setFormData} />;

      case 3:
        return <StepThree formData={formData} setFormData={setFormData} />;

      case 4:
        return <StepFour formData={formData} setFormData={setFormData} />;

      case 5:
        return <StepFive formData={formData} setFormData={setFormData} />;

      case 6:
        return <StepSix formData={formData} setFormData={setFormData} />;

      case 7:
        return <h1>Hello</h1>;

      case 8:
        return <h1>Hello</h1>;

      case 9:
        return <h1>Hello</h1>;

      default:
        return null;
    }
  };

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
                    <button
                      type="button"
                      onClick={() => setStep(item)}
                      key={item}
                      className={`cursor-pointer w-[27px] h-[24px] rounded-[50px] flex items-center justify-center ${step === item ? "bg-white" : ""}`}
                    >
                      <span className="font-sfmed text-[8px] leading-[16px]">
                        {String(item).padStart(2, "0")}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="relative w-full flex-1 flex items-center justify-center min-h-0 ">
              {renderStep()}
            </div>
          </div>
        </div>
      </div>
    </Draggable>
  );
}
function StepOne({ formData, setFormData }) {
  return (
    <>
      <p className="font-sfmed text-[8px] leading-[16px]">
        What are you looking for?
      </p>
      <div className="absolute bottom-0 w-fit h-[30px] rounded-[50px] bg-surface p-[4px]">
        <div className="w-full h-full flex items-center justify-center gap-[4px]">
          {["Sample", "Bulk"].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  type: item,
                }))
              }
              className={`p-[8px] rounded-[50px] flex items-center justify-center cursor-pointer ${
                formData.type === item ? "bg-white" : ""
              }`}
            >
              <span className="font-sfmed text-[8px] leading-[6px] tracking-[0%]">
                {item}
              </span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
function StepTwo({ formData, setFormData }) {
  return (
    <>
      <p className="font-sfmed text-[8px] leading-[16px]">
        Select product category.
      </p>
      <div className="absolute bottom-0 w-fit h-[30px] rounded-[50px] bg-surface p-[4px]">
        <div className="w-full h-full flex items-center justify-center gap-[4px]">
          {["Leather Wear", "Street Wear", "Sports Wear"].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  category: item,
                }))
              }
              className={` p-[8px] rounded-[50px] flex items-center justify-center cursor-pointer ${
                formData.category === item ? "bg-white" : ""
              }`}
            >
              <span className="font-sfmed text-[8px] leading-[6px] tracking-[0%]">
                {item}
              </span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
function StepThree({ formData, setFormData }) {
  const productOptions = {
    "Leather Wear": [
      "Leather Jacket",
      "Biker Jacket",
      "Bomber Jacket",
      "Leather Vest",
      "Leather Pants",
      "Leather Accessories",
      "Custom Leather Product",
    ],

    "Street Wear": [
      "Tshirts",
      "Hoodies",
      "Bomber Jacket",
      "Leather Vest",
      "Leather Pants",
      "Shorts",
      "Copo",
    ],

    "Sports Wear": [
      "Team Uniform",
      "Training Wear",
      "Shorts",
      "Sports Tshirts",
      "Leather Accessories",
      "Custom Leather Product",
    ],
  };
  const options = productOptions[formData.category] || [];
  return (
    <>
      <p className="font-sfmed text-[8px] leading-[16px]">
        Select product category.
      </p>
      <div className="absolute bottom-0 w-full rounded-[14.5px] bg-surface p-[4px]">
        <div className="w-full flex flex-wrap justify-center gap-[4px]">
          {options.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  productType: item,
                }))
              }
              className={`p-[8px] rounded-[50px] flex items-center justify-center cursor-pointer ${
                formData.productType === item ? "bg-white" : ""
              }`}
            >
              <span className="font-sfmed text-[8px] leading-[6px] tracking-[0%]">
                {item}
              </span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
function StepFour({ formData, setFormData }) {
  const printOptions = [
    "DTF Printing",
    "Screen Printing",
    "Embroidery",
    "DTG Printing",
    "Silicon Logo",
    "Woven Label",
    "Heat Transfer",
    "Others",
  ];
  return (
    <>
      <p className="font-sfmed text-[8px] leading-[16px]">
        Select product category.
      </p>
      <div className="absolute bottom-0 w-full rounded-[14.5px] bg-surface p-[4px]">
        <div className="w-full flex flex-wrap justify-center gap-[4px]">
          {printOptions.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  printMethod: item,
                }))
              }
              className={` p-[8px] rounded-[50px] flex items-center justify-center cursor-pointer ${
                formData.printMethod === item ? "bg-white" : ""
              }`}
            >
              <span className="font-sfmed text-[8px] leading-[6px] tracking-[0%]">
                {item}
              </span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
function StepFive({ formData, setFormData }) {
  return (
    <>
      <p className="font-sfmed text-[8px] leading-[16px]">
        Enter product details.
      </p>
      <div className="absolute bottom-0 w-full  flex flex-col gap-[5px]">
        <div className="w-full h-[30px] flex items-center gap-[8px]">
          <div className=" w-[100px]  h-full bg-surface rounded-[50px] flex items-center justify-start">
            <span className="px-[12px] text-[8px] font-sfmed leading-[6px] text-muted2">
              Qty.
            </span>
            <input
              type="number"
              min="1"
              value={formData.productDetails.quantity}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  productDetails: {
                    ...prev.productDetails,
                    quantity: e.target.value,
                  },
                }))
              }
              className="flex-1 min-w-0 h-full bg-transparent outline-none border-none text-[8px] font-sfmed leading-[6px]"
            />
          </div>
          <div className="flex-1 h-full bg-surface rounded-[50px] p-[4px]">
            <div className="w-full h-full flex items-center gap-[4px]">
              <button className="p-[8px] text-[8px] font-sfmed leading-[6px] text-muted2">
                Color
              </button>
              <div className=" h-full flex items-center">
                {["#ffffff", "#ff0000", "#ffff00", "#0000ff", "#000000"].map(
                  (color, index) => {
                    return (
                      <button
                        key={index}
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            productDetails: {
                              ...prev.productDetails,
                              color,
                            },
                          }))
                        }
                        className={`cursor-pointer w-[22px] h-[22px] rounded-[50px] ${index !== 0 ? "-ml-[11px]" : ""} ${formData.productDetails.color === color ? "border" : ""} `}
                        style={{ backgroundColor: color }}
                      />
                    );
                  },
                )}
              </div>
              <button className="p-[8px] text-[8px] font-sfmed leading-[6px] cursor-pointer">
                Custom
              </button>
            </div>
          </div>
        </div>
        <div className="w-full h-[30px] bg-surface rounded-[50px] p-[4px]">
          <div className="w-full h-full flex items-center gap-[4px] justify-center">
            <button className="p-[8px] text-[8px] font-sfmed  font-medium leading-[6px]">
              Size
            </button>
            {["XS", "S", "M", "L", "2XL", "3XL"].map((size, index) => {
              return (
                <button
                  key={index}
                  onClick={() =>
                    setFormData((prev) => {
                      const sizes = prev.productDetails.sizes;

                      return {
                        ...prev,
                        productDetails: {
                          ...prev.productDetails,
                          sizes: sizes.includes(size)
                            ? sizes.filter((item) => item !== size)
                            : [...sizes, size],
                        },
                      };
                    })
                  }
                  className={` rounded-[50px] p-[8px] text-[8px] font-sfmed  font-medium leading-[6px] cursor-pointer ${
                    formData.productDetails.sizes.includes(size)
                      ? "bg-white"
                      : ""
                  }`}
                >
                  {size}
                </button>
              );
            })}
            <button className="p-[8px] text-[8px] font-sfmed  font-medium leading-[6px]  cursor-pointer">
              Custom
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
function StepSix({ formData, setFormData }) {
  const handleUpload = (e) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    const newDesigns = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setFormData((prev) => ({
      ...prev,
      design: [...prev.design, ...newDesigns],
    }));

    e.target.value = "";
  };

  const circleCount = Math.max(4, formData.design.length);
  const placeholderCount = circleCount - formData.design.length;
  return (
    <>
      <p className="font-sfmed text-[8px] leading-[16px]">
        Upload your design.
      </p>
      <div className="absolute bottom-0 bg-surface w-full h-[30px] p-[4px] rounded-[14.5px]">
        <div className="w-full h-full flex items-center justify-between">
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleUpload}
              className="hidden"
            />

            <Image
              src="/icons/upload.svg"
              width={22}
              height={22}
              alt="Upload Files"
            />
          </label>
          <div className="flex items-center ">
            {Array.from({ length: placeholderCount }).map((_, index) => {
              return (
                <div
                  key={`placeholder-${index}`}
                  className={`
                    relative
                    shrink-0
                    w-[22px]
                    h-[22px]
                    rounded-full
                    overflow-hidden
                    ${!(index === 0) ? "-ml-[11px]" : ""}
                  `}
                >
                  <Image
                    src="/icons/dotted-circle.svg"
                    width={22}
                    height={22}
                    alt="Upload Files"
                  />
                </div>
              );
            })}
            {[...formData.design].reverse().map((item, index) => {
              const isFirst = placeholderCount === 0 && index === 0;
              return (
                <div
                  key={`${item.file.name}-${item.file.lastModified}-${index}`}
                  className={`relative shrink-0 w-[22px] h-[22px] rounded-full overflow-hidden ${
                    !isFirst ? "-ml-[11px]" : ""
                  }`}
                >
                  <img
                    src={item.url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              );
            })}
            <button type="button" className="relative -ml-[11px] z-10">
              <Image
                src="/icons/view-upload.svg"
                width={22}
                height={22}
                alt="Upload Files"
              />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
