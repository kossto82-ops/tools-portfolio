# Invoicing / Detailed Report Generator

Multilingual invoice and usage-report generator that turns raw call/usage log exports into a client-ready, VAT-aware summary — as a styled Excel workbook and/or a printable HTML report.

## What it does

- Reads an uploaded Excel export (e.g. call/usage detail records), filters and cleans the data, and formats phone numbers automatically.
- Groups records by concept/client, calculates per-line pricing, VAT, and totals.
- Generates a styled multi-sheet Excel export (summary + detail sheets) via SheetJS, and a printable HTML summary view.
- Supports five UI/output languages (ES, EN, FR, DE, IT), including locale-correct number and currency formatting and per-country VAT rate labels.
- Runs entirely client-side — no data is uploaded to any server.

## Stack

Vanilla JavaScript, [SheetJS (xlsx-js-style)](https://github.com/gitbrent/xlsx-js-style) for styled Excel export.

## Usage

Open `index.html` in a browser, upload the source Excel file, select the relevant columns/date range, and export either the formatted Excel workbook or the printable HTML report.

## Note

This is a generic, reusable version of an internal tool. No real invoicing or client data is included — bring your own spreadsheet.
