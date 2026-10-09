import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatList(value) {
  if (Array.isArray(value)) {
    return value.length ? value.map(escapeHtml).join(", ") : "Not provided";
  }

  return escapeHtml(value || "Not provided");
}

export async function POST(request) {
  try {
    const body = await request.formData();
    const dataString = body.get("data");

    if (typeof dataString !== "string") {
      return Response.json({ error: "Missing form data." }, { status: 400 });
    }

    const data = JSON.parse(dataString);
    const { contact = {}, productDetails = {} } = data;

    if (
      !contact.name?.trim() ||
      !contact.email?.trim() ||
      !contact.phone?.trim() ||
      !contact.address?.trim()
    ) {
      return Response.json(
        { error: "Please complete the required contact fields." },
        { status: 400 },
      );
    }

    const attachments = [];

    for (const file of body.getAll("designs")) {
      if (!file || typeof file.arrayBuffer !== "function" || !file.size) {
        continue;
      }

      attachments.push({
        filename: file.name,
        content: Buffer.from(await file.arrayBuffer()).toString("base64"),
      });
    }

    const html = `
      <h2>New Vapor Sports Inquiry</h2>

      <h3>Order Overview</h3>
      <p><strong>Inquiry type:</strong> ${formatList(data.type)}</p>
      <p><strong>Category:</strong> ${formatList(data.category)}</p>
      <p><strong>Product types:</strong> ${formatList(data.productType)}</p>
      <p><strong>Print methods:</strong> ${formatList(data.printMethod)}</p>

      <h3>Product Details</h3>
      <p><strong>Quantity:</strong> ${formatList(productDetails.quantity)}</p>
      <p><strong>Sizes:</strong> ${formatList(productDetails.sizes)}</p>
      <p><strong>Color:</strong> ${formatList(productDetails.color)}</p>
      <p><strong>Product notes:</strong> ${formatList(productDetails.notes)}</p>

      <h3>Branding & Packaging</h3>
      <p><strong>Branding options:</strong> ${formatList(data.branding)}</p>
      <p><strong>Packaging:</strong> ${formatList(data.packaging)}</p>

      <h3>Contact Information</h3>
      <p><strong>Name:</strong> ${formatList(contact.name)}</p>
      <p><strong>Company:</strong> ${formatList(contact.company)}</p>
      <p><strong>Email:</strong> ${formatList(contact.email)}</p>
      <p><strong>Phone:</strong> ${formatList(contact.phone)}</p>
      <p><strong>Shipping address:</strong> ${formatList(contact.address)}</p>
      <p><strong>Additional information:</strong> ${formatList(contact.additional)}</p>

      <p><strong>Uploaded design files:</strong> ${attachments.length}</p>
    `;

    const { data: emailData, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: [process.env.RESEND_TO_EMAIL],
      replyTo: contact.email,
      subject: `New Inquiry — ${contact.name}`,
      html,
      attachments,
    });

    if (error) {
      console.error("Resend error:", error);

      return Response.json(
        { error: "Unable to send the inquiry email." },
        { status: 502 },
      );
    }

    return Response.json({
      success: true,
      id: emailData?.id,
    });
  } catch (error) {
    console.error("Inquiry submission error:", error);

    return Response.json(
      { error: "Something went wrong while submitting the inquiry." },
      { status: 500 },
    );
  }
}
