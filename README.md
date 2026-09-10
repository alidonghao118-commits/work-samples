# Small Tools, Clear Reviews, Playable Stories

Four self-directed project samples: a working product-data tool, a local email review workflow, an independent open-source code review, and a short game narrative with implementation notes.

| Sample | What it demonstrates |
| --- | --- |
| [Product CSV Cleaner](sku-tool-en.html) | Column mapping, duplicate detection, exception reporting, and downloadable CSV/JSON results. |
| [Inbox Review](inbox-review.md) | Local email classification, editable drafts, an approval queue, duplicate protection, and persistent tickets. Download includes source and tests. |
| [Next.js proxy review](code-review.md) | A specific transport defect, a small patch, and narrowly scoped regression evidence. |
| [One More Chair](one-more-chair.md) | Three slice-of-life milestones, character dialogue, branching outcomes, and progression rules. |

## Try the CSV cleaner locally

Download this repository and extract it. From its root folder, start a local static server with Python 3:

```sh
python -m http.server 8000 --bind 127.0.0.1
```

On Windows, `py -m http.server 8000 --bind 127.0.0.1` also works when the Python launcher is installed. Open `http://127.0.0.1:8000/sku-tool-en.html` in a modern browser. A local server is needed because the page uses JavaScript modules. No package installation, hosted service, or external assets are required.

1. Select **Try the sample** to load ten fictional product records.
2. Check the suggested column mapping, then select **Clean the data**.
3. Review nine resulting records: one duplicate is merged and five records need review.
4. Download the cleaned CSV, review report, or full JSON record.

The demo accepts up to 200 records and ten columns. It trims whitespace, normalizes common units, preserves conflicting SKU records, and flags missing or invalid selected fields. Processing stays in page memory; refreshing clears the working data. CSV exports mark formula-like values as text, while JSON retains the original source values. To preserve leading-zero SKUs in Excel, import the CSV and set the SKU column to Text.

Source files: [interface](sku-tool-en.html), [styles](sku-tool-en.css), [English UI and exports](sku-tool-en.mjs), and [shared parser and cleaning rules](sku-core.mjs).

## Try the email review workflow

[Inbox Review](inbox-review.md) turns fictional inbox messages into editable ticket drafts using Python, SQLite and a local Ollama model. The checked example run produced five drafts from eight inputs, skipped two duplicates and quarantined one malformed record. One ticket was created after an operator edited and approved a draft. The package includes eight passing workflow tests and the separate live-model results.

Open the [walkthrough and download](inbox-review.md) to run it locally.

## Read the code review

The [review](code-review.md) examines an explicit header lost across a Next.js proxy in [Bitcoindefi/OpenAO at the reviewed commit](https://github.com/Bitcoindefi/OpenAO/tree/12b967c163f4eca01e80f758aeedc8b153bfc249). It reports 18 handler-level assertions: 13 passing before the local patch and 18 after it. The write-up identifies the fixtures and verification boundaries; it does not claim an upstream merge. This repository contains the review document, not the upstream application or its test harness.

## Read the narrative sample

[One More Chair](one-more-chair.md) follows a 23-year-old settling into a flat, repairing a table, and getting to know a neighbour. The story pairs everyday details and gentle humour with explicit triggers, cooldowns, and two equally rewarding ways to continue the friendship.
