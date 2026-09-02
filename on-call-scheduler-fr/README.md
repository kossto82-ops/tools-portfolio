# On-Call Scheduler (French variant)

A French-language variant of the on-call roster generator, adding a search/filter box for quickly finding a person's shifts within a larger schedule.

## What it does

- Reads an Excel on-call schedule export and generates an interactive webpage listing shifts, backups ("Remplaçant"), and contact numbers per person.
- Adds a live search box to filter the schedule by name.
- Runs entirely client-side — no data is uploaded to any server.

## Stack

Vanilla JavaScript, [SheetJS](https://sheetjs.com/) for reading the source Excel file.

## Usage

Open `index.html` in a browser and upload the source Excel schedule to generate the interactive roster page.

## Note

This is a generic, reusable version of an internal tool. No real staff data is included — bring your own spreadsheet.
