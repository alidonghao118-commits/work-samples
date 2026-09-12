# Source-bound quote review

[Download the runnable example](quote-evidence-demo.zip?raw=true)


A small Python example showing why exact wording needs message provenance. Synthetic records only. The model's candidate can choose a source ID and quote; message direction comes from the collector, not the candidate.

Run with Python3.10 or newer:

```sh
python quote_review.py
```

The nine regression cases check escaped newlines/Unicode, outgoing messages, stitched messages, paraphrases, unknown IDs, empty quotes, duplicate IDs, candidate-supplied direction, and the boundary between a valid quotation and an approved action. No network calls, packages, model, or API key are needed.

Successful validation returns `status: review` and offsets into one source message. It establishes wording and recorded direction, not whether the quote is a request, an approval, or evidence of payment. The collector must assign trustworthy IDs and direction; do not let a language model create that metadata. Review the complete message and conversation before acting.

This is an educational extraction of an issue encountered in a local follow-up workflow, not the full workflow or a model benchmark. For a production reader, add limits appropriate to your input source and preserve conversation identity, timestamps, and quoted/forwarded-message context.

Written by Donghao Li. This folder's code and documentation are provided under the MIT license in LICENSE.
