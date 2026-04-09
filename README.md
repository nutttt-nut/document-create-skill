# document-create-skill

Professional document generator skill for Claude Code. Creates pixel-perfect bilingual Thai/English business documents (invoices, receipts, quotations) ready for print or PDF export.

## Features

- 🇹🇭 **Bilingual Support** — Thai and English text
- 📄 **A4 Layout** — 210mm × 297mm format, print-optimized
- 🎨 **Professional Design** — Corporate color scheme with Sarabun font
- 🔢 **Thai Formatting** — Automatic number formatting with Thai comma separators (1,000)
- ✏️ **Signature Lines** — Blank lines for authorized signatures
- 📋 **Configurable** — Support for company profiles and customization
- 🖨️ **Print-Ready** — Responsive design, optimized print CSS
- 💾 **HTML Output** — Self-contained, no external dependencies

## Installation

```bash
git clone https://github.com/nutttt-nut/document-create-skill
cd document-create-skill
npm install
```

## Usage

### Basic Invoice

```javascript
const DocumentGenerator = require('./index.js');

const generator = new DocumentGenerator();

const invoiceData = {
  invoice_no: 'INV-20260409-001',
  company_name: 'บริษัท ABC จำกัด',
  company_address: 'เลขที่ 123 ถ.สุขุมวิท',
  company_tax_id: '1234567890123',
  company_phone: '02-123-4567',
  company_email: 'info@abc.com',
  customer_name: 'นายสมชาย ใจดี',
  customer_address: 'เลขที่ 456 ถ.พระราม 4',
  customer_tax_id: '9876543210123',
  customer_contact: '08-9999-9999',
  items: [
    {
      description: 'สินค้า A / Product A',
      qty: 10,
      unit_price: 500,
      discount: 0
    },
    {
      description: 'บริการ B / Service B',
      qty: 5,
      unit_price: 1000,
      discount: 100
    }
  ],
  vat: true,
  discount: 0,
  notes: 'ขอบคุณที่ใช้บริการ'
};

const result = generator.createInvoice(invoiceData);
console.log(result);
// {
//   success: true,
//   filePath: '/path/to/output/invoice_INV-20260409-001.html',
//   filename: 'invoice_INV-20260409-001.html',
//   totals: {
//     subtotal: 9400,
//     vat: 658,
//     discount: 0,
//     total: 10058
//   }
// }
```

## Input Data Format

### Invoice Object

```javascript
{
  // Invoice identification
  invoice_no: string,              // e.g., 'INV-20260409-001'
  
  // Company information
  company_name: string,            // e.g., 'บริษัท ABC จำกัด'
  company_address: string,         // Thai or English address
  company_tax_id: string,          // Tax ID number
  company_phone: string,           // Contact phone
  company_email: string,           // Contact email
  
  // Customer information
  customer_name: string,           // Required
  customer_address: string,        // Required
  customer_tax_id: string,         // Optional
  customer_contact: string,        // Optional
  
  // Items (required, array of objects)
  items: [
    {
      description: string,         // Item/service description
      qty: number,                 // Quantity
      unit_price: number,          // Price per unit (in Baht)
      discount: number             // Discount amount (optional, default: 0)
    }
  ],
  
  // Financial settings
  vat: boolean,                    // Apply 7% VAT? (default: true)
  discount: number,                // Overall discount (optional, default: 0)
  notes: string                    // Additional notes (optional)
}
```

## API Reference

### `DocumentGenerator`

Main class for document generation.

#### Constructor

```javascript
new DocumentGenerator([options])
```

**Options:**
- `outputDir` (string): Output directory path (default: `./output`)

#### Methods

##### `createInvoice(data)`

Generate and save an invoice.

**Parameters:**
- `data` (object): Invoice data object

**Returns:**
- `{success: boolean, filePath: string, filename: string, totals: object}`

##### `generateInvoiceHTML(data)`

Generate invoice HTML without saving.

**Parameters:**
- `data` (object): Invoice data object

**Returns:**
- `string`: HTML content

##### `formatThaiNumber(num)`

Format number with Thai comma separator.

**Parameters:**
- `num` (number): Number to format

**Returns:**
- `string`: Formatted number (e.g., '1,000')

## Configuration

### Environment Variables

```bash
OUTPUT_DIR=/path/to/output  # Output directory for generated documents
```

### Company Profiles

Store company information in a YAML or JSON file for reuse:

```json
{
  "default": {
    "company_name": "บริษัท ABC จำกัด",
    "company_address": "เลขที่ 123 ถ.สุขุมวิท",
    "company_tax_id": "1234567890123",
    "company_phone": "02-123-4567",
    "company_email": "info@abc.com"
  }
}
```

## Output Format

Generated HTML files include:

1. **Header Section**
   - Company name and details
   - Invoice number and metadata
   - Blank fields for date, PO, due date

2. **Customer Section**
   - Customer name and address
   - Tax ID and contact (if provided)

3. **Items Table**
   - Item description
   - Quantity and unit price
   - Individual discounts
   - Amount calculations

4. **Summary Block**
   - Subtotal
   - VAT (7% if enabled)
   - Overall discount
   - **Total Amount**

5. **Signature Block**
   - 4 signature areas (Receiver, Approver, Creator, Reviewer)
   - Blank date fields

6. **Document Type Checkboxes**
   - Invoice (ใบแจ้งหนี้)
   - Delivery Note (ใบส่งของ)
   - Receipt (ใบเสร็จรับเงิน)
   - Tax Invoice (ใบกำกับภาษี)

## Calculations

### Subtotal
```
Subtotal = sum of (unit_price × qty - discount) for all items
```

### VAT
```
VAT = vat_enabled ? Subtotal × 0.07 : 0
```

### Total
```
Total = Subtotal + VAT - overall_discount
```

All amounts are in Thai Baht (฿).

## Print & PDF Export

The generated HTML is optimized for printing:

1. Open in browser (Chrome, Safari, Firefox)
2. Print to PDF (`Cmd+P` or `Ctrl+P`)
3. A4 format automatically applied
4. Margins: 20px all sides

**Print Settings:**
- Paper size: A4
- Margins: Default
- Color: Full color recommended
- Orientation: Portrait

## Styling

### Color Palette

| Element | Color | Usage |
|---------|-------|-------|
| Primary | `#0066cc` | Headers, titles |
| Dark | `#000000` | Main text |
| Muted | `#666666` | Secondary text |
| Border | `#cccccc` | Table borders |
| Alternate | `#f5f5f5` | Table row background |

### Typography

- **Font:** Sarabun (Google Fonts CDN)
- **Fallback:** system-ui, -apple-system, sans-serif
- **Sizes:**
  - Header: 14px–20px
  - Body: 11px
  - Labels: 10px–11px

## License

MIT © Nut

## Support

For issues, feature requests, or contributions, visit:
https://github.com/nutttt-nut/document-create-skill

## Changelog

### v1.0.0 (2026-04-09)
- Initial release
- Invoice generation
- Thai/English bilingual support
- A4 print-optimized layout
- Company profile system
- Number formatting with Thai separators
