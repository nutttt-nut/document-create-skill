---
name: document-create
description: "Generate professional bilingual Thai/English documents (invoices, receipts, quotations). Creates pixel-perfect HTML output with Sarabun font support."
version: 1.0.0
author: Nut
license: MIT
---

# Document Create Skill

Generate professional business documents with Thai/English bilingual support.

## Usage

```
/invoice [options]
/quote [options]
/receipt [options]
```

## Input Format

```json
{
  "document_type": "invoice",
  "company_profile": "default",
  "customer_name": "บริษัท ABC จำกัด",
  "customer_address": "เลขที่ 123 ถ.สุขุมวิท",
  "customer_tax_id": "1234567890123",
  "items": [
    {
      "description": "สินค้า/บริการ",
      "qty": 1,
      "unit_price": 1000,
      "discount": 0
    }
  ],
  "vat": true,
  "discount": 0,
  "notes": ""
}
```

## Output

- HTML file saved to `/Output/` directory
- Format: `document_INV-YYYYMMDD-XXX.html`
- Ready for print or PDF export
- Responsive design, A4 compatible

## Features

- 🇹🇭 Thai/English bilingual
- 📄 A4-proportional layout (210mm × 297mm)
- 🎨 Professional color scheme (#0066cc primary)
- 🔢 Thai number formatting (1,000 → 1,000)
- ✏️ Blank signature lines
- 📋 Configurable company profiles
- 🖨️ Print-optimized CSS
