function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");
    const data = JSON.parse(e.postData.contents);

    const name = data.name || "";
    const phone = data.phone || "";
    const email = data.email || "";
    const vehicle = data.vehicle || "";
    const service = data.service || "";
    const message = data.message || "";
    const submittedAt = new Date();

    // Guardar en Google Sheets
    if (sheet) {
      sheet.appendRow([
        name,
        phone,
        email,
        vehicle,
        service,
        message,
        submittedAt
      ]);
    }

    // Lista de destinatarios
    const recipients = [
      "jeduardo961104@gmail.com"
    ].join(",");

    const subject = `New Repair Request - ${name || "Unknown Customer"}`;

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; background:#f4f4f4; padding:24px;">
        <div style="max-width:700px; margin:0 auto; background:#ffffff; border-radius:14px; overflow:hidden; border:1px solid #e5e7eb;">
          
          <div style="background:#111111; padding:24px 28px; border-bottom:4px solid #dc2626;">
            <h1 style="margin:0; color:#ffffff; font-size:24px;">
              Revive, Renew & Restore Inc.
            </h1>
            <p style="margin:8px 0 0; color:#d1d5db; font-size:14px;">
              New website form submission
            </p>
          </div>

          <div style="padding:28px;">
            <h2 style="margin-top:0; color:#111827; font-size:20px;">New Repair Request Received</h2>
            <p style="color:#4b5563; font-size:14px; margin-bottom:24px;">
              A new customer submitted the contact form from the website.
            </p>

            <table style="width:100%; border-collapse:collapse; font-size:14px;">
              <tr>
                <td style="padding:12px; background:#f9fafb; border:1px solid #e5e7eb; width:180px;"><strong>Full Name</strong></td>
                <td style="padding:12px; border:1px solid #e5e7eb;">${escapeHtml(name)}</td>
              </tr>
              <tr>
                <td style="padding:12px; background:#f9fafb; border:1px solid #e5e7eb;"><strong>Email</strong></td>
                <td style="padding:12px; border:1px solid #e5e7eb;">${escapeHtml(email)}</td>
              </tr>
              <tr>
                <td style="padding:12px; background:#f9fafb; border:1px solid #e5e7eb;"><strong>Phone</strong></td>
                <td style="padding:12px; border:1px solid #e5e7eb;">${escapeHtml(phone)}</td>
              </tr>
              <tr>
                <td style="padding:12px; background:#f9fafb; border:1px solid #e5e7eb;"><strong>Vehicle</strong></td>
                <td style="padding:12px; border:1px solid #e5e7eb;">${escapeHtml(vehicle)}</td>
              </tr>
              <tr>
                <td style="padding:12px; background:#f9fafb; border:1px solid #e5e7eb;"><strong>Service</strong></td>
                <td style="padding:12px; border:1px solid #e5e7eb;">${escapeHtml(service)}</td>
              </tr>
              <tr>
                <td style="padding:12px; background:#f9fafb; border:1px solid #e5e7eb;"><strong>Submitted At</strong></td>
                <td style="padding:12px; border:1px solid #e5e7eb;">${submittedAt}</td>
              </tr>
            </table>

            <div style="margin-top:24px;">
              <h3 style="margin:0 0 10px; color:#111827; font-size:16px;">Customer Message</h3>
              <div style="padding:16px; background:#f9fafb; border:1px solid #e5e7eb; border-radius:10px; color:#374151; white-space:pre-wrap;">
                ${escapeHtml(message)}
              </div>
            </div>

            <div style="margin-top:28px; text-align:center;">
              <a href="mailto:${encodeURIComponent(email)}" 
                 style="display:inline-block; background:#dc2626; color:#ffffff; text-decoration:none; padding:12px 22px; border-radius:10px; font-weight:bold;">
                Reply to Customer
              </a>
            </div>
          </div>

          <div style="background:#f9fafb; padding:18px 28px; border-top:1px solid #e5e7eb; color:#6b7280; font-size:12px;">
            This email was generated automatically from the Revive, Renew & Restore website form.
          </div>
        </div>
      </div>
    `;

    MailApp.sendEmail({
      to: recipients,
      subject: subject,
      htmlBody: htmlBody
    });

    return ContentService
      .createTextOutput(JSON.stringify({
        result: "success",
        message: "Saved and emailed successfully"
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        result: "error",
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
