export default ({ doc, profile }) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 11px; color: #1A1A2E; background: #fff; padding: 15px; line-height: 1.6; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; border-bottom: 1px solid #E0E0E0; padding-bottom: 20px; }
  .logo { max-width: 80px; max-height: 50px; object-fit: contain; }
  .header-left { text-align: left; }
  .business-name { font-size: 15px; font-weight: 700; text-transform: uppercase; color: #1A1A2E; letter-spacing: 0.5px; }
  .business-tagline { font-size: 10px; color: #6B7280; margin-top: 2px; }
  .header-right { text-align: right; color: #6B7280; font-size: 10px; }

  .doc-title-row { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; }
  .doc-title { font-size: 18px; font-weight: 300; text-transform: uppercase; letter-spacing: 1px; color: #1A1A2E; }
  .doc-meta { font-size: 10px; text-align: right; color: #6B7280; }
  .doc-meta strong { color: #1A1A2E; }

  .client-section { margin-bottom: 30px; }
  .client-label { font-size: 9px; text-transform: uppercase; color: #9CA3AF; font-weight: bold; letter-spacing: 0.5px; }
  .client-name { font-size: 12px; font-weight: bold; color: #1A1A2E; margin-top: 3px; }

  table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
  th { border-bottom: 2px solid #1A1A2E; padding: 10px 4px; font-weight: bold; text-align: left; font-size: 10px; text-transform: uppercase; color: #6B7280; }
  th:last-child { text-align: right; }
  td { padding: 12px 4px; text-align: left; border-bottom: 1px solid #E5E7EB; font-size: 10px; color: #4B5563; }
  td:last-child { text-align: right; color: #1A1A2E; font-weight: bold; }
  
  .totals-row { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; }
  .words-block { width: 60%; font-size: 10px; color: #6B7280; font-style: italic; }
  .totals-block { width: 35%; text-align: right; }
  .total-item { display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 10px; }
  .total-item.grand-total { border-top: 1px solid #1A1A2E; padding-top: 6px; font-size: 13px; font-weight: bold; color: #F47B00; }

  .footer { border-top: 1px solid #E0E0E0; padding-top: 20px; display: flex; justify-content: space-between; align-items: flex-start; margin-top: 40px; }
  .bank-info { font-size: 9px; color: #6B7280; line-height: 1.5; }
  .bank-info strong { color: #1A1A2E; }
  .contact-info { text-align: right; font-size: 9px; color: #6B7280; }
  .qr-code { width: 50px; height: 50px; opacity: 0.8; object-fit: contain; }
</style>
</head>
<body>
  <div class="header">
    <div class="header-left">
      ${profile.logo && profile.logo.url ? `<img class="logo" src="${profile.logo.url}" alt="Logo">` : ''}
      <div class="business-name" style="${(profile.logo && profile.logo.url) ? 'margin-top: 5px;' : ''}">${profile.businessName}</div>
      ${profile.tagline ? `<div class="business-tagline">${profile.tagline}</div>` : ''}
    </div>
    <div class="header-right">
      ${profile.address.replace(/\n/g, '<br>')}
    </div>
  </div>

  <div class="doc-title-row">
    <div class="doc-title">
      ${doc.documentType === 'proforma' ? 'Proforma Invoice' : doc.documentType === 'quotation' ? 'Quotation' : 'Receipt'}
    </div>
    <div class="doc-meta">
      No. <strong>${doc.documentNumber}</strong><br>
      Date. <strong>${new Date(doc.date).toISOString().split('T')[0]}</strong>
    </div>
  </div>

  <div class="client-section">
    <div class="client-label">Billed To</div>
    <div class="client-name">${doc.clientName}</div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width: 5%;">#</th>
        <th style="width: 60%;">Description</th>
        <th style="width: 15%;">Unit Price</th>
        <th style="width: 8%;">Qty</th>
        <th style="width: 12%; text-align: right;">Amount</th>
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

  <div class="totals-row">
    <div class="words-block">
      <strong>In Words:</strong><br>
      ${doc.totalInWords}
    </div>
    <div class="totals-block">
      <div class="total-item">
        <span>Subtotal:</span>
        <span>₦${doc.totalAmount.toLocaleString()}</span>
      </div>
      <div class="total-item grand-total">
        <span>Total Due:</span>
        <span>₦${doc.totalAmount.toLocaleString()}</span>
      </div>
    </div>
  </div>

  <div class="footer">
    <div>
      ${profile.bankName && profile.accountNumber ? `
      <div class="bank-info">
        <strong>Payment Information</strong><br>
        Bank: ${profile.bankName} &bull; Name: ${profile.accountName || profile.businessName}<br>
        Acc No: ${profile.accountNumber}
      </div>
      ` : ''}
    </div>
    <div class="contact-info">
      ${profile.phone ? `T. ${profile.phone}<br>` : ''}
      ${profile.email ? `E. ${profile.email}<br>` : ''}
      ${profile.qrCode && profile.qrCode.url ? `<img class="qr-code" src="${profile.qrCode.url}" alt="QR">` : ''}
    </div>
  </div>
</body>
</html>
`;
