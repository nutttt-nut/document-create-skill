/**
 * Document Create Skill - Invoice/Quotation/Receipt Generator
 * Generates professional bilingual Thai/English HTML documents
 */

const fs = require('fs');
const path = require('path');

class DocumentGenerator {
  constructor() {
    this.outputDir = process.env.OUTPUT_DIR || './output';
    this.colors = {
      primary: '#0066cc',
      dark: '#000000',
      muted: '#666666',
      border: '#cccccc',
      alternate: '#f5f5f5'
    };
  }

  /**
   * Format Thai numbers with comma separator
   * @param {number} num - Number to format
   * @returns {string} Formatted number with commas
   */
  formatThaiNumber(num) {
    if (!num) return '0';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  /**
   * Generate invoice HTML
   * @param {object} data - Invoice data
   * @returns {string} HTML content
   */
  generateInvoiceHTML(data) {
    const {
      invoice_no = 'INV-000',
      company_name = '',
      company_address = '',
      company_tax_id = '',
      company_phone = '',
      company_email = '',
      customer_name = '',
      customer_address = '',
      customer_tax_id = '',
      customer_contact = '',
      items = [],
      vat = true,
      discount = 0,
      notes = '',
      po_number = '',
      due_date = ''
    } = data;

    // Calculate totals
    const subtotal = items.reduce((sum, item) => {
      const itemTotal = (item.unit_price || 0) * (item.qty || 0);
      const itemDiscount = item.discount || 0;
      return sum + itemTotal - itemDiscount;
    }, 0);

    const vatAmount = vat ? Math.round(subtotal * 0.07) : 0;
    const total = subtotal + vatAmount - discount;

    // Build items table rows
    const itemsHTML = items.map((item, idx) => {
      const itemTotal = ((item.unit_price || 0) * (item.qty || 0)) - (item.discount || 0);
      const bgColor = idx % 2 === 0 ? '#ffffff' : this.colors.alternate;

      return `
        <tr style="background: ${bgColor}; border: 1px solid ${this.colors.border};">
          <td style="padding: 8px; text-align: center; width: 5%;">${idx + 1}</td>
          <td style="padding: 8px; width: 40%;">${item.description || ''}</td>
          <td style="padding: 8px; text-align: right; width: 15%;">${this.formatThaiNumber(item.qty || 0)}</td>
          <td style="padding: 8px; text-align: right; width: 15%;">฿${this.formatThaiNumber(item.unit_price || 0)}</td>
          <td style="padding: 8px; text-align: right; width: 15%;">฿${this.formatThaiNumber(item.discount || 0)}</td>
          <td style="padding: 8px; text-align: right; width: 15%;">฿${this.formatThaiNumber(itemTotal)}</td>
        </tr>
      `;
    }).join('');

    // Build summary section
    const summaryRows = `
      ${subtotal > 0 ? `<tr style="border-bottom: 1px solid ${this.colors.border};"><td colspan="5" style="text-align: right; padding: 8px;">ราคารวม:</td><td style="text-align: right; padding: 8px; font-weight: 600;">฿${this.formatThaiNumber(subtotal)}</td></tr>` : ''}
      ${vat && vatAmount > 0 ? `<tr style="border-bottom: 1px solid ${this.colors.border};"><td colspan="5" style="text-align: right; padding: 8px;">ภาษีมูลค่าเพิ่ม 7%:</td><td style="text-align: right; padding: 8px; font-weight: 600;">฿${this.formatThaiNumber(vatAmount)}</td></tr>` : ''}
      ${discount > 0 ? `<tr style="border-bottom: 1px solid ${this.colors.border};"><td colspan="5" style="text-align: right; padding: 8px;">ส่วนลด:</td><td style="text-align: right; padding: 8px; font-weight: 600;">฿${this.formatThaiNumber(discount)}</td></tr>` : ''}
      <tr style="background: #f9f9f9; border: 1px solid ${this.colors.border};"><td colspan="5" style="text-align: right; padding: 12px; font-weight: 700;">ยอดรวม:</td><td style="text-align: right; padding: 12px; font-weight: 700; font-size: 14px;">฿${this.formatThaiNumber(total)}</td></tr>
    `;

    const html = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice ${invoice_no}</title>
  <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Sarabun', system-ui, -apple-system, sans-serif;
      background: #f5f5f5;
      padding: 20px;
      color: ${this.colors.dark};
    }

    .page {
      max-width: 210mm;
      height: 297mm;
      background: white;
      margin: 0 auto;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      display: flex;
      flex-direction: column;
    }

    /* HEADER BLOCK */
    .header {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 1px solid ${this.colors.border};
    }

    .header-left {
      text-align: left;
    }

    .company-name {
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 4px;
    }

    .company-details {
      font-size: 11px;
      color: ${this.colors.muted};
      line-height: 1.5;
    }

    .header-right {
      text-align: right;
    }

    .invoice-title {
      font-size: 20px;
      font-weight: 700;
      color: ${this.colors.primary};
      margin-bottom: 2px;
    }

    .invoice-subtitle {
      font-size: 13px;
      color: ${this.colors.muted};
      margin-bottom: 8px;
    }

    .invoice-meta {
      font-size: 11px;
      color: ${this.colors.dark};
      line-height: 1.8;
    }

    .blank-line {
      border-bottom: 1px solid ${this.colors.dark};
      display: inline-block;
      width: 100px;
      text-align: center;
    }

    /* CUSTOMER BLOCK */
    .customer-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      margin: 12px 0;
    }

    .customer-block {
      padding: 8px;
    }

    .customer-label {
      font-size: 11px;
      font-weight: 600;
    }

    .customer-value {
      font-size: 11px;
      color: ${this.colors.muted};
    }

    /* ITEMS TABLE */
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin: 16px 0;
      font-size: 11px;
    }

    .items-table thead {
      background: ${this.colors.primary};
      color: white;
    }

    .items-table th {
      padding: 8px;
      text-align: left;
      font-weight: 600;
      border: 1px solid ${this.colors.border};
    }

    .items-table td {
      padding: 8px;
      border: 1px solid ${this.colors.border};
    }

    /* SUMMARY */
    .summary-table {
      width: 280px;
      margin-left: auto;
      margin-top: 16px;
      font-size: 11px;
    }

    .summary-table td {
      padding: 8px;
    }

    /* SIGNATURE BLOCK */
    .signature-section {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      margin-top: 30px;
      font-size: 10px;
    }

    .signature-block {
      text-align: center;
    }

    .signature-line {
      border-top: 1px solid ${this.colors.dark};
      height: 50px;
      margin: 10px 0;
    }

    .signature-label {
      margin-top: 5px;
      font-weight: 600;
    }

    @media print {
      body {
        padding: 0;
        margin: 0;
        background: white;
      }
      .page {
        max-width: 210mm;
        height: 297mm;
        box-shadow: none;
        margin: 0;
        padding: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="page">
    <!-- HEADER -->
    <div class="header">
      <div class="header-left">
        <div class="company-name">${company_name}</div>
        <div class="company-details">
          ${company_address}<br>
          เลขผู้เสียภาษี: ${company_tax_id}<br>
          โทรศัพท์: ${company_phone}<br>
          อีเมล: ${company_email}
        </div>
      </div>
      <div class="header-right">
        <div class="invoice-title">ใบแจ้งหนี้/ใบเสร็จรับเงิน</div>
        <div class="invoice-subtitle">สั่งซื้อ</div>
        <div class="invoice-meta">
          เลขที่: ${invoice_no}<br>
          วันที่: <span class="blank-line"></span><br>
          PO: <span class="blank-line"></span><br>
          Due: <span class="blank-line"></span>
        </div>
      </div>
    </div>

    <!-- CUSTOMER -->
    <div class="customer-section">
      <div>
        <div class="customer-label">ชื่อผู้ซื้อ:</div>
        <div class="customer-value">${customer_name}</div>
        <div class="customer-label">ที่อยู่:</div>
        <div class="customer-value">${customer_address}</div>
        ${customer_tax_id ? `<div class="customer-label">เลขผู้เสียภาษี:</div><div class="customer-value">${customer_tax_id}</div>` : ''}
        ${customer_contact ? `<div class="customer-label">ติดต่อ:</div><div class="customer-value">${customer_contact}</div>` : ''}
      </div>
    </div>

    <!-- ITEMS TABLE -->
    <table class="items-table">
      <thead>
        <tr>
          <th>#</th>
          <th>รายการ / Description</th>
          <th>จำนวน / Qty</th>
          <th>ราคาต่อหน่วย / Unit Price</th>
          <th>ส่วนลด / Discount</th>
          <th>มูลค่า / Amount</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHTML}
      </tbody>
    </table>

    <!-- SUMMARY -->
    <table class="summary-table">
      <tbody>
        ${summaryRows}
      </tbody>
    </table>

    <!-- SIGNATURE -->
    <div class="signature-section">
      <div class="signature-block">
        <div class="signature-line"></div>
        <div class="signature-label">ผู้รับสินค้า</div>
        <div style="font-size: 10px; margin-top: 5px;">วันที่: __________</div>
      </div>
      <div class="signature-block">
        <div class="signature-line"></div>
        <div class="signature-label">ผู้อนุมัติ</div>
        <div style="font-size: 10px; margin-top: 5px;">วันที่: __________</div>
      </div>
      <div class="signature-block">
        <div class="signature-line"></div>
        <div class="signature-label">ผู้จัดทำ</div>
        <div style="font-size: 10px; margin-top: 5px;">วันที่: __________</div>
      </div>
      <div class="signature-block">
        <div class="signature-line"></div>
        <div class="signature-label">ผู้ตรวจสอบ</div>
        <div style="font-size: 10px; margin-top: 5px;">วันที่: __________</div>
      </div>
    </div>
  </div>
</body>
</html>`;

    return html;
  }

  /**
   * Create output directory if it doesn't exist
   */
  ensureOutputDir() {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * Save document to file
   * @param {string} filename - File name
   * @param {string} content - HTML content
   * @returns {string} File path
   */
  saveDocument(filename, content) {
    this.ensureOutputDir();
    const filePath = path.join(this.outputDir, filename);
    fs.writeFileSync(filePath, content, 'utf-8');
    return filePath;
  }

  /**
   * Generate and save invoice
   * @param {object} data - Invoice data
   * @returns {object} Result with file path and totals
   */
  createInvoice(data) {
    const html = this.generateInvoiceHTML(data);
    const filename = `invoice_${data.invoice_no || 'INV-000'}.html`;
    const filePath = this.saveDocument(filename, html);

    // Calculate total for response
    const subtotal = data.items.reduce((sum, item) => {
      const itemTotal = (item.unit_price || 0) * (item.qty || 0);
      return sum + itemTotal - (item.discount || 0);
    }, 0);
    const vatAmount = data.vat ? Math.round(subtotal * 0.07) : 0;
    const total = subtotal + vatAmount - (data.discount || 0);

    return {
      success: true,
      filePath,
      filename,
      totals: {
        subtotal,
        vat: vatAmount,
        discount: data.discount || 0,
        total
      }
    };
  }
}

module.exports = DocumentGenerator;
