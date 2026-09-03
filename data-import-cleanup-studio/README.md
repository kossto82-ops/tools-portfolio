# DataFlow — Data Import & Cleanup Studio

A guided, client-side data import and cleanup tool: load a CSV or Excel file, analyze its quality, clean it, map it, preview the result, and export — all in a six-step workflow.

## What it does

- Imports CSV and Excel (`.xlsx`/`.xls`) files, with worksheet selection for multi-sheet workbooks.
- Analyzes data quality and surfaces real issues: missing values, duplicates, whitespace, invalid emails, non-canonical phone/date formats, category inconsistencies.
- Cleans the dataset with selectable rules (trim, email normalize, date format, dedupe, etc.) with before/after previews.
- Auto-detects a target schema and maps source columns to fields, flagging any unmapped or missing required ones.
- Validates every mapped row (ready / review / invalid) and lets you preview, search, and paginate it.
- Exports cleaned data as CSV or Excel, plus a validation report.
- Bilingual UI (English / Spanish), fully client-side — the file never leaves the browser.
- Ships a built-in demo dataset so the whole flow can be tried without a file.

## Stack

Vanilla JavaScript, [PapaParse](https://www.papaparse.com/) for robust CSV parsing, [SheetJS (xlsx)](https://sheetjs.com/) for reading/writing Excel files.

## Usage

Open `index.html` in a browser, drop a CSV or Excel file (or load the demo dataset), and follow the six steps: Overview → Analysis → Cleaning → Mapping → Preview → Export.

## Note

A generic, reusable tool based on the import/prepare/preview/export loop. No real client data included — bring your own spreadsheet or use the built-in demo.