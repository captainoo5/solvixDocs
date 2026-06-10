export default ({ doc, profile }) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: Arial, Helvetica, sans-serif; font-size: 12px; color: #1A1A2E; background: #fff; padding: 10px 10px 10px 25px; border-left: 8px solid #F47B00; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; }
  .logo { max-width: 120px; max-height: 80px; object-fit: contain; }
  .business-info { text-align: left; }
  .business-name { font-size: 20px; font-weight: bold; color: #0D1B4D; margin-top: 5px; }
  .business-tagline { font-size: 11px; font-style: italic; color: #6B7280; margin-top: 2px; }
  .address-block { text-align: right; font-size: 11px; color: #6B7280; line-height: 1.5; max-width: 250px; }
  
  .meta-container { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 25px; }
  .doc-type-badge { background: #F47B00; color: #fff; padding: 6px 14px; border-radius: 50px; font-size: 12px; font-weight: bold; text-transform: uppercase; display: inline-block; }
  .doc-meta-right { text-align: right; font-size: 11px; font-weight: bold; color: #0D1B4D; line-height: 1.5; }
  .client-section { margin-bottom: 20px; padding: 12px; background: #F5F5F5; border-radius: 4px; }
  .client-label { font-size: 10px; text-transform: uppercase; color: #6B7280; font-weight: bold; margin-bottom: 4px; }
  .client-name { font-size: 13px; font-weight: bold; color: #1A1A2E; }

  table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
  th { background: #0D1B4D; color: #fff; padding: 10px 12px; font-weight: bold; text-align: left; font-size: 11px; border: none; }
  th:first-child { border-radius: 4px 0 0 4px; }
  th:last-child { border-radius: 0 4px 4px 0; text-align: right; }
  td { padding: 10px 12px; text-align: left; font-size: 11px; border-bottom: 1px solid #E0E0E0; }
  td:last-child { text-align: right; }
  tr:nth-child(even) { background: #F9FAFB; }

  .summary-section { display: flex; justify-content: flex-end; margin-bottom: 25px; }
  .summary-table { width: 300px; margin-bottom: 0; }
  .summary-table td { padding: 8px 12px; border-bottom: none; }
  .summary-table tr.grand-total { background: #FFF3E0; font-weight: bold; font-size: 13px; color: #D46A00; }
  .summary-table tr.grand-total td { border-radius: 4px; }

  .words-section { background: #FFF3E0; border-left: 4px solid #F47B00; padding: 12px; border-radius: 0 4px 4px 0; margin-bottom: 25px; font-size: 11px; font-weight: bold; }
  
  .bottom-row { display: flex; justify-content: space-between; align-items: flex-start; margin-top: 30px; }
  .bank-card { background: #F5F5F5; padding: 12px; border-radius: 4px; min-width: 280px; font-size: 11px; }
  .bank-card-title { font-weight: bold; color: #0D1B4D; margin-bottom: 6px; text-transform: uppercase; font-size: 11px; }
  .bank-card-detail { font-weight: bold; line-height: 1.5; color: #1A1A2E; }
  .footer-right { text-align: right; display: flex; flex-direction: column; align-items: flex-end; }
  .phone-text { font-size: 11px; font-weight: bold; color: #F47B00; margin-bottom: 8px; }
  .qr-code { width: 75px; height: 75px; object-fit: contain; border: 1px solid #E0E0E0; padding: 2px; border-radius: 4px; }
</style>
</head>
<body>
  <div class="header">
    <div class="business-info">
      ${profile.logo && profile.logo.url ? `<img class="logo" src="${profile.logo.url}" alt="Logo">` : ''}
      <div class="business-name">${profile.businessName}</div>
      ${profile.tagline ? `<div class="business-tagline">${profile.tagline}</div>` : ''}
    </div>
    <div class="address-block">
      ${profile.address.replace(/\n/g, '<br>')}
    </div>
  </div>

  <div class="meta-container">
    <div class="doc-type-badge">
      ${doc.documentType === 'proforma' ? 'Proforma Invoice' : doc.documentType === 'quotation' ? 'Quotation' : 'Receipt'}
    </div>
    <div class="doc-meta-right">
      Doc Number: <span style="color: #F47B00;">${doc.documentNumber}</span><br>
      Date: ${new Date(doc.date).toISOString().split('T')[0]}
    </div>
  </div>

  <div class="client-section">
    <div class="client-label">Client / Billing Address</div>
    <div class="client-name">${doc.clientName}</div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width: 8%;">#</th>
        <th style="width: 50%;">Description</th>
        <th style="width: 15%;">Unit Price</th>
        <th style="width: 10%;">QTY</th>
        <th style="width: 17%; text-align: right;">Amount</th>
      </tr>
    </thead>
    <tbody>
      ${doc.items.map((item, i) => `
        <tr>
          <td>${i + 1}</td>
          <td>${item.description}</td>
          <td>₦${item.unitPrice.toLocaleString()}</td>
          <td>${item.quantity}</td>
          <td>₦${item.amount.toLocaleString()}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="summary-section">
    <table class="summary-table">
      <tr>
        <td style="color: #6B7280; font-weight: bold;">Subtotal:</td>
        <td style="text-align: right; font-weight: bold;">₦${doc.totalAmount.toLocaleString()}</td>
      </tr>
      <tr class="grand-total">
        <td>Grand Total:</td>
        <td style="text-align: right;">₦${doc.totalAmount.toLocaleString()}</td>
      </tr>
    </table>
  </div>

  <div class="words-section">
    Amount in Words: <span style="color: #D46A00;">${doc.totalInWords}</span>
  </div>

  <div class="bottom-row">
    <div>
      ${profile.bankName && profile.accountNumber ? `
      <div class="bank-card">
        <div class="bank-card-title">Bank Details</div>
        <div class="bank-card-detail">
          Bank: ${profile.bankName}<br>
          Account: ${profile.accountNumber}<br>
          Name: ${profile.accountName || profile.businessName}
        </div>
      </div>
      ` : ''}
    </div>
    <div class="footer-right">
      ${profile.phone ? `<div class="phone-text">📞 ${profile.phone}</div>` : ''}
      ${profile.qrCode && profile.qrCode.url ? `<img class="qr-code" src="${profile.qrCode.url}" alt="Payment QR">` : ''}
    </div>
  </div>
</body>
</html>
`;
