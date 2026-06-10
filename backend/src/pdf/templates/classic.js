export default ({ doc, profile }) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: Arial, Helvetica, sans-serif; font-size: 12px; color: #000; background: #fff; padding: 10px; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
  .logo { max-width: 120px; max-height: 80px; object-fit: contain; }
  .business-info { text-align: left; }
  .business-name { font-size: 16px; font-weight: bold; text-transform: uppercase; color: #0D1B4D; }
  .business-tagline { font-size: 10px; font-style: italic; color: #444; max-width: 250px; margin-top: 2px; }
  .address-block { text-align: right; font-size: 10px; color: #333; line-height: 1.4; max-width: 250px; }
  .doc-title { text-align: center; font-size: 20px; font-weight: bold; text-decoration: underline;
               color: #F47B00; margin: 20px 0 10px; text-transform: uppercase; letter-spacing: 1px; }
  .doc-meta { font-weight: bold; font-size: 11px; margin-bottom: 15px; color: #1A1A2E; }
  .doc-number-date { display: flex; justify-content: space-between; font-size: 11px;
                     font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid #000; padding-bottom: 5px; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
  th { background: #E8EBF5; border: 1px solid #000; padding: 8px 10px; font-weight: bold;
       text-align: center; font-size: 11px; }
  td { border: 1px solid #000; padding: 8px 10px; text-align: center; font-size: 11px; }
  td.desc { text-align: left; }
  .total-box { border: 2px solid #000; padding: 10px; margin-bottom: 10px; font-size: 12px; }
  .total-label { font-weight: bold; text-transform: uppercase; }
  .grand-total-row { border: 2px solid #000; padding: 10px; display: flex; justify-content: space-between; font-size: 12px; background: #FFF3E0; }
  .grand-total-label { font-weight: bold; text-transform: uppercase; color: #D46A00; }
  .bank-info { margin-top: 20px; border: 1px dashed #6B7280; padding: 10px; border-radius: 4px; max-width: 400px; }
  .bank-title { font-weight: bold; text-decoration: underline; font-size: 12px; margin-bottom: 6px; color: #0D1B4D; }
  .bank-details { font-size: 11px; font-weight: bold; line-height: 1.5; }
  .footer-section { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 25px; }
  .phone-badge { background: #F47B00; color: #fff; padding: 6px 14px; border-radius: 4px;
                 font-weight: bold; font-size: 11px; display: inline-block; }
  .qr-code { width: 80px; height: 80px; object-fit: contain; border: 1px solid #E0E0E0; padding: 2px; }
  .tagline-pill { display: inline-block; background: #16A34A; color: #fff; padding: 5px 16px;
                  border-radius: 4px; font-size: 11px; font-style: italic; margin-top: 10px; }
</style>
</head>
<body>
  <div class="header">
    <div class="business-info">
      ${profile.logo && profile.logo.url ? `<img class="logo" src="${profile.logo.url}" alt="Logo">` : ''}
      <div class="business-name" style="${!(profile.logo && profile.logo.url) ? 'margin-top: 10px;' : 'margin-top: 5px;'}">${profile.businessName}</div>
      ${profile.tagline ? `<div class="business-tagline">${profile.tagline}</div>` : ''}
    </div>
    <div class="address-block">
      <strong>ADDRESS:</strong><br>
      ${profile.address.replace(/\n/g, '<br>')}
    </div>
  </div>

  <div class="doc-number-date">
    <div>Doc No.: <span style="color: #0D1B4D;">${doc.documentNumber}</span></div>
    <div>DATE: ${new Date(doc.date).toISOString().split('T')[0]}</div>
  </div>

  <div class="doc-title">
    ${doc.documentType === 'proforma' ? 'PROFORMA INVOICE' : doc.documentType === 'quotation' ? 'QUOTATION' : 'RECEIPT'}
  </div>

  <div class="doc-meta">Client/Location: <span style="text-decoration: underline;">${doc.clientName}</span></div>

  <table>
    <thead>
      <tr>
        <th style="width: 8%;">S/No</th>
        <th style="width: 50%;">Description</th>
        <th style="width: 14%;">Unit Price</th>
        <th style="width: 10%;">QTY</th>
        <th style="width: 18%;">Amount</th>
      </tr>
    </thead>
    <tbody>
      ${doc.items.map((item, i) => `
        <tr>
          <td>${i + 1}</td>
          <td class="desc">${item.description}</td>
          <td>₦${item.unitPrice.toLocaleString()}</td>
          <td>${item.quantity}</td>
          <td>₦${item.amount.toLocaleString()}</td>
        </tr>
      `).join('')}
      <tr style="background: #F5F5F5; font-weight: bold;">
        <td colspan="2" style="text-align: left;"><strong>TOTAL</strong></td>
        <td>₦${doc.items.reduce((s, i) => s + i.unitPrice, 0).toLocaleString()}</td>
        <td>${doc.items.reduce((s, i) => s + i.quantity, 0)}</td>
        <td>₦${doc.totalAmount.toLocaleString()}</td>
      </tr>
    </tbody>
  </table>

  <div class="total-box">
    <span class="total-label">Total For Whole Set of The Description Is:</span>
    <span style="float: right; font-weight: bold; color: #F47B00;">₦${doc.totalAmount.toLocaleString()}</span>
  </div>

  <div class="grand-total-row">
    <span class="grand-total-label">Grand Total</span>
    <span style="font-weight: bold; text-align: right;">Say Total In Naira: ${doc.totalInWords}</span>
  </div>

  ${profile.bankName && profile.accountNumber ? `
  <div class="bank-info">
    <div class="bank-title">Bank Information:</div>
    <div class="bank-details">
      Beneficiary Bank: ${profile.bankName}<br>
      Account No.: ${profile.accountNumber}<br>
      Beneficiary Name: ${profile.accountName || profile.businessName}
    </div>
  </div>
  ` : ''}

  <div class="footer-section">
    <div>
      ${profile.phone ? `<div class="phone-badge">Tel: ${profile.phone}</div>` : ''}
      <br>
      ${profile.tagline ? `<div class="tagline-pill">${profile.tagline}</div>` : ''}
    </div>
    ${profile.qrCode && profile.qrCode.url ? `<img class="qr-code" src="${profile.qrCode.url}" alt="Payment QR">` : ''}
  </div>
</body>
</html>
`;
