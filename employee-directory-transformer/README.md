# Employee Directory Transformer

Transforms raw, inconsistent HR exports (Excel/CSV) into a clean, structured, multilingual staff directory — ready to distribute or import elsewhere.

## What it does

- Reads an uploaded Excel file and lets the user pick the relevant sheet.
- Auto-detects common HR fields (name, department, phone, email, availability flags, etc.) and reports which fields were found, which are ambiguous, and which are missing.
- Lets the user manually map any unmatched columns before processing.
- Formats phone numbers, groups records by department, and applies zebra-striped, styled formatting to the exported Excel file (via SheetJS).
- Runs entirely client-side — the uploaded file never leaves the browser.

## Stack

Vanilla JavaScript, [SheetJS (xlsx-js-style)](https://github.com/gitbrent/xlsx-js-style) for reading/writing styled Excel files.

## Usage

Open `index.html` in a browser, upload an Excel file with employee data, follow the guided steps (sheet selection → field mapping → export options), and download the generated directory as a formatted `.xlsx` file.

## Note

This is a generic, reusable version of an internal tool. No real employee data is included or required — bring your own spreadsheet.
