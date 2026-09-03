# Hotel Mapping Tool

Compares child vs. master hotel records and auto-decides whether each pairing maps, needs investigation, or has no match — with multilingual name/address normalization and a reviewable, overridable workflow.

## What it does

- Uploads an Excel file with child and master hotel rows (name, address, city, etc.).
- Normalizes names and addresses across languages (Korean, CJK, Arabic, Cyrillic, Devanagari, kana) so equivalent spellings compare fairly.
- Computes a similarity score per candidate and auto-assigns `Map`, `Investigate`, or `No Map` using adjustable thresholds.
- Lets you manually override any auto decision, with undo, before exporting.
- Shows a visual dashboard with mapping outcome counts.
- Exports the results to a styled Excel workbook with separate `Results` and `Investigate & No Map` sheets.

## Stack

Vanilla JavaScript, [SheetJS (xlsx-js-style)](https://github.com/gitbrent/xlsx-js-style) for reading/writing styled Excel files.

## Usage

Open `index.html` in a browser, upload Excel files with the child and master hotel records, review the auto-assigned mapping decisions (override and undo as needed), and download the styled `.xlsx` export.

## Note

This is a generic, reusable version of an internal tool. No real client data is included or required — bring your own spreadsheet.