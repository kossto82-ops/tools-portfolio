# On-Call Roster Generator

Converts an Excel on-call/shift schedule into a self-contained, interactive webpage that shows who's on call right now — and who's next — by department.

## What it does

- Reads an Excel file with two sheets: a staff/phone directory and a shift schedule (dates × on-call assignments per department).
- Generates a single, mobile-friendly HTML page showing, for each department, the current on-call person, whether the shift is currently active, and a list of upcoming shifts.
- Lists on-call coordinators/responsible contacts per department, with click-to-copy phone numbers.
- The generated page is a single static HTML file — no server or backend needed, easy to share or host anywhere (e.g. an internal intranet page).

## Stack

Vanilla JavaScript, [SheetJS](https://sheetjs.com/) for reading the source Excel file.

## Usage

Open `index.html` in a browser, upload the source Excel file (staff directory + shift schedule sheets), and download the generated `guardias.html` — a standalone page ready to distribute to the team.

## Note

This is a generic, reusable version of an internal tool. No real staff or client data is included — bring your own spreadsheet.
