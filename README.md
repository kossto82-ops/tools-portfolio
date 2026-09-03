# Internal Business Tools

A small collection of self-directed, AI-assisted internal tools built to automate recurring operational and administrative work — data cleanup, invoicing, employee directories, and on-call scheduling.

Each tool is a single, self-contained HTML file (no backend, no build step). They run entirely in the browser: the user uploads an Excel/CSV file, the tool processes it client-side, and generates a formatted export or an interactive page. No data is sent to any server — everything happens locally in the browser tab.

Built with AI-assisted development (Claude Code), directing the architecture, UI/UX, and edge-case handling while validating business logic and output against real-world data.

## Tools in this repo

| Tool | What it does | Stack |
|---|---|---|
| [`employee-directory-transformer`](./employee-directory-transformer) | Transforms raw HR exports into structured, exportable, multilingual staff directories with automatic field mapping | JavaScript, SheetJS (xlsx) |
| [`hotel-mapping-tool`](./hotel-mapping-tool) | Matches child vs. master hotel records with multilingual (Korean, CJK, Arabic, Cyrillic, Devanagari) name/address normalization, auto Map/Investigate/No-Map decisions, manual override, and styled Excel export | JavaScript, SheetJS (xlsx) |
| [`data-import-cleanup-studio`](./data-import-cleanup-studio) | Guided import → analysis → cleaning → mapping → preview → export workflow for CSV/Excel files, with data-quality issues, bilingual UI (EN/ES), and validation report | JavaScript, PapaParse, SheetJS (xlsx) |
| [`invoicing-generator`](./invoicing-generator) | Multilingual (ES/EN/FR/DE/IT) invoice/report generator with multi-file support, VAT handling, and styled Excel export | JavaScript, SheetJS (xlsx) |
| [`on-call-roster-generator`](./on-call-roster-generator) | Converts an on-call/shift Excel schedule into an interactive, mobile-friendly webpage showing current and upcoming shifts by department | JavaScript |
| [`on-call-scheduler-fr`](./on-call-scheduler-fr) | French-language variant of the on-call scheduler, with search/filter support | JavaScript |

## Notes

- These are internal tools originally built for day-to-day operational use, cleaned up and genericized here for portfolio purposes (sample data only, no real client or employee data included).
- Each tool is a single HTML file — open it directly in a browser, or serve the folder with GitHub Pages.

## Author

Raúl Rodríguez Cruz — [github.com/kossto82-ops](https://github.com/kossto82-ops)
