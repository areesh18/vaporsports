"use client";
import Image from "next/image";
import { useRef } from "react";
import Draggable from "react-draggable";
import { useState } from "react";

// ADDED: which fields must be filled for each step to count as complete
const validators = {
  1: (d) => !!d.type,
  2: (d) => !!d.category,
  3: (d) => d.productType.length > 0,
  4: (d) => d.printMethod.length > 0,
  5: (d) =>
    Number(d.productDetails.quantity) > 0 &&
    d.productDetails.sizes.length > 0 &&
    !!d.productDetails.color,
  6: (d) => d.design.length > 0,
  7: (d) => d.branding.length > 0,
  8: (d) =>
    d.contact.name.trim() &&
    d.contact.phone.trim() &&
    d.contact.email.trim() &&
    d.contact.address.trim(),
};

const isStepValid = (n, d) => (validators[n] ? !!validators[n](d) : true);

export default function InquiryForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const nodeRef = useRef(null);
  const [step, setStep] = useState(1);
  const didDrag = useRef(false);
  const previousStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const nextStep = () => {
    setStep((prev) => Math.min(prev + 1, 9));
  };

  const submitInquiry = async () => {
    if (isSubmitting || !isStepValid(8, formData)) return;

    setIsSubmitting(true);

    try {
      const body = new FormData();

      const { design, ...dataWithoutDesign } = formData;

      body.append("data", JSON.stringify(dataWithoutDesign));

      design.forEach((item) => {
        if (item.file) {
          body.append("designs", item.file, item.file.name);
        }
      });

      const response = await fetch("/api/inquiry", {
        method: "POST",
        body,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to send inquiry.");
      }

      setStep(9);
    } catch (error) {
      console.error("Inquiry submission failed:", error);
      window.alert(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const [formData, setFormData] = useState({
    type: null, // CHANGED: no default
    category: null, // CHANGED: no default
    productType: [],
    printMethod: [],

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
  // ADDED: highest unlocked step = first incomplete step (or 9 if 1-8 are all done).
  // Derived from formData, so it relocks automatically if an earlier answer is cleared.
  let unlocked = 1;
  while (unlocked < 9 && isStepValid(unlocked, formData)) unlocked++;

  // ADDED: jump via pills, only to unlocked steps
  const goTo = (n) => {
    if (n <= unlocked) setStep(n);
  };

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
        return (
          <StepEight
            formData={formData}
            setFormData={setFormData}
            onEnter={submitInquiry}
            isSubmitting={isSubmitting}
          />
        );

      case 9:
        return <StepNine />;

      default:
        return null;
    }
  };

  return (
    <Draggable
      handle=".drag"
      cancel="button,input,textarea,select,label,.color-picker"
      nodeRef={nodeRef}
      onStart={() => {
        didDrag.current = false;
      }}
      onDrag={() => {
        didDrag.current = true;
      }}
      onStop={() => {
        if (!didDrag.current) {
          setExpanded(true);
        }
      }}
    >
      <div
        ref={nodeRef}
        className={`drag absolute z-100 right-[10px] bottom-[10px] max-md:bottom-[4px] max-md:left-1/2 max-md:-translate-x-1/2 w-[428px] max-[460px]:w-[417px] max-w-[calc(100%-8px)] ${
          expanded ? "h-[628px] delay-0" : "h-[93px] delay-150"
        } bg-surface rounded-[10px] px-[5px] pb-[5px] overflow-hidden transition-[height] duration-300 ease-out`}
      >
        <div className="w-full h-full flex flex-col">
          <div className="window-header cursor-grab h-[38px] w-full  flex items-center justify-start">
            <div className="px-[12px] w-fit h-full  flex items-center gap-[8px]">
              <button type="button" className="cursor-pointer">
                <Image
                  src="/icons/close.svg"
                  alt=""
                  width={11}
                  height={11}
                  className="select-none"
                />
              </button>
              <button
                onPointerDown={(e) => {
                  e.stopPropagation();
                  setExpanded((prev) => !prev);
                }}
                type="button"
                className="cursor-pointer"
              >
                <Image
                  src="/icons/resize.svg"
                  alt=""
                  width={11}
                  height={11}
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
                  // CHANGED: disabled until the next step is unlocked
                  disabled={step + 1 > unlocked}
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
              <p className="font-sf text-muted text-[11px] font-bold tracking-[0px] leading-[16px]">
                Inquiry Form
              </p>
            </div>
          </div>
          <div className="flex-1 min-h-0 bg-white  w-full flex flex-col rounded-[6px] p-[5px]">
            {/* Inquiry 1-9 nav */}
            <div className="w-full h-fit bg-surface rounded-[50px] p-[4px]">
              <div className="w-full h-full flex items-center gap-[4px]">
                {Array.from({ length: 9 }, (_, index) => {
                  const item = index + 1;
                  const locked = item > unlocked; // ADDED
                  return (
                    <button
                      type="button"
                      onClick={() => goTo(item)}
                      disabled={locked}
                      key={item}
                      className={`${locked ? "cursor-not-allowed" : "cursor-pointer"} w-[40px] h-[32px] rounded-[50px] flex items-center justify-center ${step === item ? "bg-white" : ""}`}
                    >
                      <span
                        className={`font-sf text-[11px] font-bold leading-[16px] ${locked ? "text-[#00000040]" : ""}`}
                      >
                        {String(item).padStart(2, "0")}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div
              className={`relative w-full flex-1 flex items-center justify-center min-h-0 overflow-hidden transition-opacity duration-150 ease-out ${
                expanded
                  ? "opacity-100 delay-300"
                  : "opacity-0 delay-0 pointer-events-none"
              }`}
            >
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
              <span className="font-sf text-[11px] font-bold leading-[8px] tracking-[0%]">
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
                  // ADDED: category change invalidates the chosen product type
                  productType: prev.category === item ? prev.productType : [],
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
  const toggleProductType = (item) => {
    setFormData((prev) => ({
      ...prev,
      productType: prev.productType.includes(item)
        ? prev.productType.filter((product) => product !== item)
        : [...prev.productType, item],
    }));
  };
  return (
    <>
      <p className="font-sf text-[11px] font-bold leading-[16px]">
        Select product type.
      </p>
      <div className="absolute bottom-0 w-full rounded-[18px] bg-surface p-[4px]">
        <div className="w-full flex flex-wrap justify-center gap-[4px]">
          {options.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => toggleProductType(item)}
              className={`p-[12px] rounded-[50px] flex items-center justify-center cursor-pointer ${
                formData.productType.includes(item) ? "bg-white" : ""
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
  const togglePrintMethod = (item) => {
    setFormData((prev) => ({
      ...prev,
      printMethod: prev.printMethod.includes(item)
        ? prev.printMethod.filter((method) => method !== item)
        : [...prev.printMethod, item],
    }));
  };
  return (
    <>
      <p className="font-sf text-[11px] font-bold leading-[16px]">
        Select print method.
      </p>
      <div className="absolute bottom-0 w-full rounded-[18px] bg-surface p-[4px]">
        <div className="w-full flex flex-wrap justify-center gap-[4px]">
          {printOptions.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => togglePrintMethod(item)}
              className={` p-[12px] rounded-[50px] flex items-center justify-center cursor-pointer ${
                formData.printMethod.includes(item) ? "bg-white" : ""
              }`}
            >
              <span className="font-sf text-[11px] font-bold leading-[8px] tracking-[0%]">
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
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [customColor, setCustomColor] = useState("#000000");

  const handleCustomColor = (color) => {
    setCustomColor(color);

    setFormData((prev) => ({
      ...prev,
      productDetails: {
        ...prev.productDetails,
        color,
      },
    }));
  };

  return (
    <>
      <p className="font-sf text-[11px] font-bold leading-[16px]">
        Enter product details.
      </p>

      <div className="absolute bottom-0 w-full flex flex-col gap-[5px]">
        <div className="w-full h-[40px] flex items-center gap-[8px]">
          <div className="w-[140px] max-[460px]:w-[100px] h-full bg-surface rounded-[50px] flex items-center justify-start">
            <span className="px-[16px] text-[11px] font-sf font-bold leading-[8px] text-muted2">
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
              className="flex-1 min-w-0 h-full bg-transparent outline-none border-none text-[11px] font-sf leading-[8px]"
            />
          </div>

          <div className="relative flex-1 h-full bg-surface rounded-[50px] p-[4px]">
            <div className="w-full h-full flex items-center gap-[4px] max-md:justify-between">
              <button className="p-[16px] text-[11px] font-sf font-bold leading-[8px] text-muted2">
                Colors
              </button>

              <div className="h-full flex items-center">
                {["#ffffff", "#ff0000", "#ffff00", "#0000ff"].map(
                  (color, index) => {
                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            productDetails: {
                              ...prev.productDetails,
                              color,
                            },
                          }))
                        }
                        className={`cursor-pointer w-[32px] h-[32px] rounded-[50px] ${
                          index !== 0 ? "-ml-[11px] max-[460px]:-ml-[20px]" : ""
                        } ${
                          formData.productDetails.color === color
                            ? "border"
                            : ""
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    );
                  },
                )}

                {/* Custom color preview */}
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      productDetails: {
                        ...prev.productDetails,
                        color: customColor,
                      },
                    }))
                  }
                  className={`cursor-pointer w-[32px] h-[32px] rounded-[50px] -ml-[11px] max-[460px]:-ml-[20px] ${
                    formData.productDetails.color === customColor
                      ? "border"
                      : ""
                  }`}
                  style={{ backgroundColor: customColor }}
                />
              </div>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowColorPicker((prev) => !prev)}
                  className="p-[12px] text-[11px] font-sf font-bold leading-[8px] cursor-pointer"
                >
                  Custom
                </button>
              </div>

              {showColorPicker && (
                <CustomColorPicker
                  color={customColor}
                  setColor={handleCustomColor}
                />
              )}
            </div>
          </div>
        </div>

        <div className="w-full h-[40px] bg-surface rounded-[50px] p-[4px]">
          <div className="w-full h-full flex items-center justify-between">
            <button className="p-[12px] text-[11px] font-sf font-bold leading-[8px]">
              Size
            </button>

            {["XS", "S", "M", "L", "2XL", "3XL", "Custom"].map(
              (size, index) => {
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
                    className={`rounded-[50px] p-[12px] text-[11px] font-sf font-bold leading-[8px] cursor-pointer ${
                      formData.productDetails.sizes.includes(size)
                        ? "bg-white"
                        : ""
                    }`}
                  >
                    {size}
                  </button>
                );
              },
            )}

            {/* <button className="p-[12px] rounded-[50px] text-[11px] font-sf font-bold leading-[8px] cursor-pointer">
              Custom
            </button> */}
          </div>
        </div>
      </div>
    </>
  );
}
function CustomColorPicker({ color, setColor }) {
  const rgb = hexToRgb(color);

  const [hue, setHue] = useState(() => {
    return rgbToHsv(rgb.r, rgb.g, rgb.b).h;
  });

  const svDragging = useRef(false);
  const hueDragging = useRef(false);

  const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);

  const updateRGB = (channel, value) => {
    const nextValue = Math.min(255, Math.max(0, Number(value) || 0));

    const nextRGB = {
      ...rgb,
      [channel]: nextValue,
    };

    const nextColor = rgbToHex(nextRGB.r, nextRGB.g, nextRGB.b);

    setColor(nextColor);

    const nextHsv = rgbToHsv(nextRGB.r, nextRGB.g, nextRGB.b);

    setHue(nextHsv.h);
  };

  const updateColorArea = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();

    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));

    const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));

    const saturation = x / rect.width;
    const value = 1 - y / rect.height;

    setColor(hsvToHex(hue, saturation, value));
  };

  const updateHue = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();

    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));

    const newHue = (x / rect.width) * 360;

    setHue(newHue);

    setColor(hsvToHex(newHue, hsv.s, hsv.v));
  };

  const handleSVPointerDown = (e) => {
    e.preventDefault();

    svDragging.current = true;

    e.currentTarget.setPointerCapture(e.pointerId);

    updateColorArea(e);
  };

  const handleSVPointerMove = (e) => {
    if (!svDragging.current) return;

    updateColorArea(e);
  };

  const handleSVPointerUp = (e) => {
    svDragging.current = false;

    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const handleHuePointerDown = (e) => {
    e.preventDefault();

    hueDragging.current = true;

    e.currentTarget.setPointerCapture(e.pointerId);

    updateHue(e);
  };

  const handleHuePointerMove = (e) => {
    if (!hueDragging.current) return;

    updateHue(e);
  };

  const handleHuePointerUp = (e) => {
    hueDragging.current = false;

    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  return (
    <div className="color-picker absolute left-0 bottom-[44px] z-50 w-full bg-surface rounded-[12px] p-[8px]">
      {/* Color area */}
      <div
        onPointerDown={handleSVPointerDown}
        onPointerMove={handleSVPointerMove}
        onPointerUp={handleSVPointerUp}
        onPointerCancel={handleSVPointerUp}
        className="relative w-full h-[132px] rounded-[4px] overflow-hidden touch-none cursor-crosshair"
        style={{
          background: `
            linear-gradient(to top, #000, transparent),
            linear-gradient(
              to right,
              #fff,
              hsl(${hue}, 100%, 50%)
            )
          `,
        }}
      >
        <div
          className="absolute w-[12px] h-[12px] rounded-full border-2 border-white shadow-[0_0_0_1px_#000]"
          style={{
            left: `${hsv.s * 100}%`,
            top: `${(1 - hsv.v) * 100}%`,
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>

      {/* Hue */}
      <div
        onPointerDown={handleHuePointerDown}
        onPointerMove={handleHuePointerMove}
        onPointerUp={handleHuePointerUp}
        onPointerCancel={handleHuePointerUp}
        className="relative mt-[8px] w-full h-[12px] rounded-full touch-none cursor-pointer"
        style={{
          background:
            "linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)",
        }}
      >
        <div
          className="absolute top-1/2 w-[14px] h-[14px] rounded-full bg-white border border-black"
          style={{
            left: `${(hue / 360) * 100}%`,
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>

      {/* RGB */}
      <div className="mt-[8px] flex items-center gap-[8px]">
        <span className="font-sf text-[11px] font-bold leading-[8px]">RGB</span>

        <RGBInput value={rgb.r} onChange={(value) => updateRGB("r", value)} />

        <RGBInput value={rgb.g} onChange={(value) => updateRGB("g", value)} />

        <RGBInput value={rgb.b} onChange={(value) => updateRGB("b", value)} />
      </div>
    </div>
  );
}
function RGBInput({ value, onChange }) {
  return (
    <input
      type="number"
      min="0"
      max="255"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="flex-1 min-w-0 h-[40px] bg-white rounded-[50px] px-[12px] text-center font-sf text-[11px] outline-none border-none"
    />
  );
}
function hexToRgb(hex) {
  const value = hex.replace("#", "");

  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  };
}

function rgbToHex(r, g, b) {
  return (
    "#" + [r, g, b].map((value) => value.toString(16).padStart(2, "0")).join("")
  );
}

function rgbToHsv(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  const delta = max - min;

  let h = 0;

  if (delta !== 0) {
    if (max === r) {
      h = 60 * (((g - b) / delta) % 6);
    } else if (max === g) {
      h = 60 * ((b - r) / delta + 2);
    } else {
      h = 60 * ((r - g) / delta + 4);
    }
  }

  if (h < 0) h += 360;

  const s = max === 0 ? 0 : delta / max;

  return {
    h,
    s,
    v: max,
  };
}

function hsvToHex(h, s, v) {
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;

  let r = 0;
  let g = 0;
  let b = 0;

  if (h < 60) {
    r = c;
    g = x;
  } else if (h < 120) {
    r = x;
    g = c;
  } else if (h < 180) {
    g = c;
    b = x;
  } else if (h < 240) {
    g = x;
    b = c;
  } else if (h < 300) {
    r = x;
    b = c;
  } else {
    r = c;
    b = x;
  }

  return rgbToHex(
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255),
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
              <span className="font-sf text-[11px] leading-[8px] tracking-[0%]">
                {item}
              </span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
function StepEight({ formData, setFormData, onEnter, isSubmitting }) {
  return (
    <>
      <p className="font-sf text-[11px] font-bold leading-[11px] text-center">
        Last one. Enter your information so,
        <br /> we can get back to you.
      </p>
      <div className="absolute bg-surface w-full bottom-0 p-[4px] rounded-[18px]">
        <div className=" flex flex-wrap justify-center gap-[4px]">
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
          <button
            type="button"
            onClick={onEnter}
            disabled={!isStepValid(8, formData) || isSubmitting}
            className="p-[12px] rounded-[50px] font-sf text-[11px] leading-[8px] cursor-pointer bg-white disabled:opacity-30"
          >
            {isSubmitting ? "Sending..." : "Enter"}
          </button>
        </div>
      </div>
    </>
  );
}
function StyledInput({ value, onChange, label, required = false }) {
  return (
    <div className="relative inline-flex">
      {/* Ghost element - invisible, but takes up real space, defines the box size */}
      <span className="invisible p-[12px] font-sf text-[11px] leading-[8px] whitespace-nowrap">
        {label}
        {required && <span>*</span>}
      </span>

      {/* Real input - absolutely positioned to fill the ghost's box exactly */}
      <input
        type="text"
        value={value}
        onChange={onChange}
        className="absolute inset-0 w-full h-full p-[12px] rounded-[50px] bg-white outline-none border-none font-sf text-[11px] leading-[8px]"
      />

      {/* Placeholder overlay - only shown when empty */}
      {!value && (
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-sf text-[11px] leading-[8px] whitespace-nowrap text-[#00000040] pointer-events-none">
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
      <p className="font-sf text-[11px] font-bold leading-[8px] text-center">
        Form is submitted. Thanks.
      </p>
    </>
  );
}
