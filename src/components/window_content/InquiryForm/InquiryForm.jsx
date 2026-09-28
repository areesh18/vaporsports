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

    branding: [],
    packaging: null,

    contact: {
      name: "",
      company: "",
      phone: "",
      email: "",
      address: "",
      additional: "",
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
        return <StepSeven formData={formData} setFormData={setFormData} />;

      case 8:
        return <StepEight formData={formData} setFormData={setFormData} />;

      case 9:
        return <StepNine/>;

      default:
        return null;
    }
  };

  return (
    <Draggable handle=".window-header" nodeRef={nodeRef}>
      <div
        ref={nodeRef}
        className="absolute right-[10px] bottom-[10px] w-[428px] h-[628px] bg-surface rounded-[10px] px-[5px] pb-[5px]"
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
            <div className="w-full h-fit bg-surface rounded-[50px] p-[4px]">
              <div className="w-full h-full flex items-center gap-[4px]">
                {Array.from({ length: 9 }, (_, index) => {
                  const item = index + 1;
                  return (
                    <button
                      type="button"
                      onClick={() => setStep(item)}
                      key={item}
                      className={`cursor-pointer w-[40px] h-[32px] rounded-[50px] flex items-center justify-center ${step === item ? "bg-white" : ""}`}
                    >
                      <span className="font-sf text-[11px] font-bold leading-[16px]">
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
      <p className="font-sf text-[11px] font-bold leading-[16px]">
        What are you looking for?
      </p>
      <div className="absolute bottom-0 w-fit h-[40px] rounded-[50px] bg-surface p-[4px]">
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
              className={`p-[12px] rounded-[50px] flex items-center justify-center cursor-pointer ${
                formData.type === item ? "bg-white" : ""
              }`}
            >
              <span className="font-sf text-[11px] font-bold leading-[6px] tracking-[0%]">
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
      <p className="font-sf text-[11px] font-bold leading-[16px]">
        Select product category.
      </p>
      <div className="absolute bottom-0 w-fit h-[40px] rounded-[50px] bg-surface p-[4px]">
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
              className={` p-[12px] rounded-[50px] flex items-center justify-center cursor-pointer ${
                formData.category === item ? "bg-white" : ""
              }`}
            >
              <span className="font-sf text-[11px] font-bold leading-[7px] tracking-[0%]">
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
      <p className="font-sf text-[11px] font-bold leading-[16px]">
        Select product type.
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
              className={`p-[12px] rounded-[50px] flex items-center justify-center cursor-pointer ${
                formData.productType === item ? "bg-white" : ""
              }`}
            >
              <span className="font-sf text-[11px] font-bold leading-[7px] tracking-[0%]">
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
      <p className="font-sf text-[11px] font-bold leading-[16px]">
        Select print method.
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
              className={` p-[12px] rounded-[50px] flex items-center justify-center cursor-pointer ${
                formData.printMethod === item ? "bg-white" : ""
              }`}
            >
              <span className="font-sf text-[11px] font-bold leading-[6px] tracking-[0%]">
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
      <p className="font-sf text-[11px] font-bold leading-[16px]">
        Enter product details.
      </p>
      <div className="absolute bottom-0 w-full  flex flex-col gap-[5px]">
        <div className="w-full h-[40px] flex items-center gap-[8px]">
          <div className=" w-[140px]  h-full bg-surface rounded-[50px] flex items-center justify-start">
            <span className="px-[16px] text-[11px] font-sf font-bold leading-[6px] text-muted2">
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
              className="flex-1 min-w-0 h-full bg-transparent outline-none border-none text-[11px] font-sf leading-[6px]"
            />
          </div>
          <div className="flex-1 h-full bg-surface rounded-[50px] p-[4px]">
            <div className="w-full h-full flex items-center gap-[4px]">
              <button className="p-[16px] text-[11px] font-sf font-bold leading-[6px] text-muted2">
                Colors
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
                        className={`cursor-pointer w-[32px] h-[32px] rounded-[50px] ${index !== 0 ? "-ml-[11px]" : ""} ${formData.productDetails.color === color ? "border" : ""} `}
                        style={{ backgroundColor: color }}
                      />
                    );
                  },
                )}
              </div>
              <button className="p-[12px] text-[11px] font-sf font-bold leading-[6px] cursor-pointer">
                Custom
              </button>
            </div>
          </div>
        </div>
        <div className="w-full h-[40px] bg-surface rounded-[50px] p-[4px]">
          <div className="w-full h-full flex items-center justify-between">
            <button className="p-[12px] text-[11px] font-sf font-bold leading-[6px]">
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
                  className={` rounded-[50px] p-[12px] text-[11px] font-sf  font-bold leading-[6px] cursor-pointer ${
                    formData.productDetails.sizes.includes(size)
                      ? "bg-white"
                      : ""
                  }`}
                >
                  {size}
                </button>
              );
            })}
            <button className="p-[12px] rounded-[50px] text-[11px] font-sf  font-bold leading-[6px]  cursor-pointer">
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
      <p className="font-sf text-[11px] font-bold leading-[16px]">
        Upload your design.
      </p>
      <div className="absolute bottom-0 bg-surface w-full h-[40px] p-[4px] rounded-[50px]">
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
              width={32}
              height={32}
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
                    w-[32px]
                    h-[32px]
                    rounded-full
                    overflow-hidden
                    ${!(index === 0) ? "-ml-[11px]" : ""}
                  `}
                >
                  <Image
                    src="/icons/dotted-circle.svg"
                    width={32}
                    height={32}
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
                  className={`relative shrink-0 w-[32px] h-[32px] rounded-full overflow-hidden ${
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
                width={32}
                height={32}
                alt="Upload Files"
              />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
function StepSeven({ formData, setFormData }) {
  const brandingOptions = [
    "Custom Neck Labels",
    "Woven Labels",
    "Packaging Bags",
    "Custom Boxes",
    "Thank You Card",
    "Brand Cards",
  ];
  return (
    <>
      <p className="font-sf text-[11px] font-bold leading-[16px]">
        Select branding/packaging.
      </p>
      <div className="absolute bottom-0 w-full rounded-[18px] bg-surface p-[4px]">
        <div className="w-full flex flex-wrap justify-center gap-[4px]">
          {brandingOptions.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  branding: prev.branding.includes(item)
                    ? prev.branding.filter((option) => option !== item)
                    : [...prev.branding, item],
                }))
              }
              className={` p-[12px] rounded-[50px] flex items-center justify-center cursor-pointer ${
                formData.branding.includes(item) ? "bg-white" : ""
              }`}
            >
              <span className="font-sf text-[11px] leading-[6px] tracking-[0%]">
                {item}
              </span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
function StepEight({ formData, setFormData }) {
  return (
    <>
      <p className="font-sf text-[11px] font-bold leading-[11px] text-center">
        Last one. Enter your information so,
        <br /> we can get back to you.
      </p>
      <div className="absolute bg-surface w-full bottom-0 p-[4px] rounded-[18px]">
        <div className=" flex flex-wrap justify-center gap-[4px]">
          {/* <div className="relative">
            <input
              type="text"
              placeholder=""
              value={formData.contact.name}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  contact: {
                    ...prev.contact,
                    name: e.target.value,
                  },
                }))
              }
              className="p-[8px] field-sizing-content rounded-[14.5px] bg-white outline-none border-none font-sf text-[11px] leading-[6px]"
            />
            {!formData.contact.name && (
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-sf text-[11px] leading-[6px] whitespace-nowrap text-[#00000040]">
                Full Name<span className="text-[#C70000]">*</span>
              </span>
            )}
          </div> */}
          <StyledInput
            label="Full Name"
            required={true}
            value={formData.contact.name}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                contact: { ...prev.contact, name: e.target.value },
              }))
            }
          />
          <StyledInput
            label="Company Name (Optional)"
            value={formData.contact.company}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                contact: {
                  ...prev.contact,
                  company: e.target.value,
                },
              }))
            }
          />

          <StyledInput
            label="Phone Number"
            required={true}
            value={formData.contact.phone}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                contact: {
                  ...prev.contact,
                  phone: e.target.value,
                },
              }))
            }
          />

          <StyledInput
            label="Email Address"
            required={true}
            value={formData.contact.email}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                contact: {
                  ...prev.contact,
                  email: e.target.value,
                },
              }))
            }
          />

          <StyledInput
            label="Shipping Address"
            required={true}
            value={formData.contact.address}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                contact: {
                  ...prev.contact,
                  address: e.target.value,
                },
              }))
            }
          />

          <StyledInput
            label="Additional Information (Optional)"
            value={formData.contact.additional}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                contact: {
                  ...prev.contact,
                  additional: e.target.value,
                },
              }))
            }
          />
        </div>
      </div>
    </>
  );
}
function StyledInput({ value, onChange, label, required = false }) {
  return (
    <div className="relative inline-flex">
      {/* Ghost element - invisible, but takes up real space, defines the box size */}
      <span className="invisible p-[12px] font-sf text-[11px] leading-[6px] whitespace-nowrap">
        {label}
        {required && <span>*</span>}
      </span>

      {/* Real input - absolutely positioned to fill the ghost's box exactly */}
      <input
        type="text"
        value={value}
        onChange={onChange}
        className="absolute inset-0 w-full h-full p-[12px] rounded-[50px] bg-white outline-none border-none font-sf text-[11px] leading-[6px]"
      />

      {/* Placeholder overlay - only shown when empty */}
      {!value && (
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-sf text-[11px] leading-[6px] whitespace-nowrap text-[#00000040] pointer-events-none">
          {label}
          {required && <span className="text-[#C70000]">*</span>}
        </span>
      )}
    </div>
  );
}
function StepNine() {
  return (
    <>
      <p className="font-sf text-[11px] font-bold leading-[6px] text-center">
        Form is submitted. Thanks.
      </p>
    </>
  );
}
