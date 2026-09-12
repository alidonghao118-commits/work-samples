# Product CSV cleanup: see the delivery

A messy product list, cleaned with a separate report for the rows that need a decision. All data in this example is fictional.

**[View the one-page result](CSV-cleanup-sample.pdf)** · **[Download the complete sample](https://github.com/alidonghao118-commits/work-samples/raw/refs/heads/main/CSV-cleanup-sample-delivery.zip)** · **[Try the cleaner](https://luohuashuang-chinese-classroom.alidonghao118.chatgpt.site/sku-tool-en.html)**

| Input | Result |
| --- | --- |
| 10 product records | 9 records after merging one exact duplicate |
| Spaces and mixed unit labels | Consistent values for the selected fields |
| Two prices for SKU 0005 | Both records kept for review |
| Missing fields and negative stock | 5 records in a separate review report |
| Zero stock and leading-zero SKUs | Preserved |

## Inside the download

- Original CSV — `01-original.csv`
- All processed records and source references — `02-processed-with-status.csv`
- Five records needing a decision — `03-needs-your-review.csv`
- Four records passing the selected checks — `04-ready-records.csv`
- Processing output as JSON — `result.json`
- Rules and decisions to make — `README.txt`

For this sample, the checks cover SKU, product name, recognized unit, non-negative price and whole-number stock. Import the SKU column as Text in Excel to keep the leading zeros.

## Have a product list to tidy up?

Email [alidonghao118@gmail.com](mailto:alidonghao118@gmail.com) with a few sample rows and what you want cleaned. Start with anonymized data; I can use that to work out the scope.
