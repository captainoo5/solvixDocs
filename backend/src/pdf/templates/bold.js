export default ({ doc, profile }) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: Arial, Helvetica, sans-serif; font-size: 11px; color: #1A1A2E; background: #fff; padding: 10px; }
  .bold-header { background: #0D1B4D; color: #fff; padding: 20px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; }
  .logo { max-width: 100px; max-height: 70px; object-fit: contain; background: #fff; padding: 4px; border-radius: 4px; }
  .business-name { font-size: 18px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; }
  .business-tagline { font-size: 10px; font-style: italic; opacity: 0.8; margin-top: 2px; }
  .header-left { text-align: left; }
  .header-right { text-align: right; line-height: 1.4; font-size: 10px; }

  .doc-title-row { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 20px; border-bottom: 2px solid #0D1B4D; padding-bottom: 8px; }
  .doc-title { font-size: 22px; font-weight: 900; color: #0D1B4D; text-transform: uppercase; }
  .doc-meta { font-size: 11px; text-align: right; font-weight: bold; line-height: 1.5; }

  .info-grid { display: flex; justify-content: space-between; margin-bottom: 25px; }
  .client-box { width: 60%; }
  .client-title { font-weight: bold; text-transform: uppercase; color: #6B7280; margin-bottom: 4px; font-size: 9px; }
  .client-name { font-size: 13px; font-weight: 700; color: #0D1B4D; text-decoration: underline; }
  
  table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
  th { background: #0D1B4D; color: #fff; padding: 8px 10px; font-weight: bold; text-align: left; font-size: 11px; border: 1px solid #0D1B4D; }
  th:last-child { text-align: right; }
  td { padding: 8px 10px; text-align: left; border: 1px solid #E0E0E0; font-size: 11px; }
  td:last-child { text-align: right; }
  tr:nth-child(even) { background: #FFF3E0; }

  .summary-wrapper { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 25px; }
  .words-box { width: 55%; font-weight: bold; font-size: 11px; border: 1px solid #E0E0E0; padding: 12px; border-radius: 4px; background: #F9FAFB; }
  .words-title { font-size: 9px; text-transform: uppercase; color: #6B7280; margin-bottom: 4px; }
  .grand-total-box { width: 40%; background: #0D1B4D; color: #fff; padding: 12px; border-radius: 4px; text-align: right; }
  .grand-total-label { font-size: 10px; text-transform: uppercase; opacity: 0.8; margin-bottom: 2px; }
  .grand-total-val { font-size: 18px; font-weight: 900; color: #F47B00; }

  .bank-footer-row { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 15px; padding-top: 15px; border-top: 1px solid #E0E0E0; }
  .bank-details { font-size: 10px; line-height: 1.5; color: #333; }
  .bank-details strong { color: #0D1B4D; }
  .footer-right { text-align: right; display: flex; gap: 12px; align-items: center; }
  .qr-code { width: 70px; height: 70px; object-fit: contain; border: 1px solid #E0E0E0; padding: 2px; }
  .phone-banner { background: #F47B00; color: white; padding: 4px 10px; border-radius: 3px; font-weight: bold; font-size: 10px; }
</style>
</head>
<body>
  <div class="bold-header">
    <div class="header-left">
      <div class="business-name">${profile.businessName}</div>
      ${profile.tagline ? `<div class="business-tagline">${profile.tagline}</div>` : ''}
    </div>
    <div class="header-right">
      <strong>Office Address:</strong><br>
      ${profile.address.replace(/\n/g, '<br>')}
    </div>
  </div>

  <div class="doc-title-row">
    <div class="doc-title">
      ${doc.documentType === 'proforma' ? 'Proforma Invoice' : doc.documentType === 'quotation' ? 'Quotation' : 'Receipt'}
    </div>
    <div class="doc-meta">
      No: <span style="color: #F47B00;">${doc.documentNumber}</span><br>
      Date: ${new Date(doc.date).toISOString().split('T')[0]}
    </div>
  </div>

  <div class="info-grid">
    <div class="client-box">
      <div class="client-title">Prepared For:</div>
      <div class="client-name">${doc.clientName}</div>
    </div>
    ${profile.logo && profile.logo.url ? `<img class="logo" src="${profile.logo.url}" alt="Logo">` : ''}
  </div>

  <table>
    <thead>
      <tr>
        <th style="width: 8%;">S/No</th>
        <th style="width: 52%;">Item & Description</th>
        <th style="width: 13%;">Rate</th>
        <th style="width: 10%;">Qty</th>
        <th style="width: 17%; text-align: right;">Total (₦)</th>
      </tr>
    </thead>
    <tbody>
      ${doc.items.map((item, i) => `
        <tr>
          <td>${i + 1}</td>
          <td><strong>${item.description}</strong></td>
          <td>₦${item.unitPrice.toLocaleString()}</td>
          <td>${item.quantity}</td>
          <td>₦${item.amount.toLocaleString()}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="summary-wrapper">
    <div class="words-box">
      <div class="words-title">Say Total In Words</div>
      <div>${doc.totalInWords}</div>
    </div>
    <div class="grand-total-box">
      <div class="grand-total-label">Grand Total Due</div>
      <div class="grand-total-val">₦${doc.totalAmount.toLocaleString()}</div>
    </div>
  </div>

  <div class="bank-footer-row">
    <div>
      ${profile.bankName && profile.accountNumber ? `
      <div class="bank-details">
        <strong>Payment Information:</strong><br>
        Bank Name: ${profile.bankName} | Account Name: ${profile.accountName || profile.businessName}<br>
        Account Number: <strong>${profile.accountNumber}</strong>
      </div>
      ` : ''}
    </div>
    <div class="footer-right">
      <div>
        ${profile.phone ? `<span class="phone-banner">Call: ${profile.phone}</span>` : ''}
      </div>
      ${profile.qrCode && profile.qrCode.url ? `<img class="qr-code" src="${profile.qrCode.url}" alt="Payment QR">` : ''}
    </div>
  </div>
</body>
</html>
`;
