# Inbox Review: turn incoming messages into reviewable tickets

Sort a small inbox, see what needs attention, edit the proposed next step, and approve a ticket. This original local prototype combines Python, SQLite and an Ollama model in a browser interface.

**[Download the source, example inbox and tests](inbox-triage-demo.zip?raw=true).** Extract the ZIP into its own folder.

## What the workflow does

Incoming JSON → validated inbox → model classification → editable draft → operator approval → saved ticket.

Each draft contains a summary, category, priority and suggested next action. The review screen keeps the original message alongside the draft. Approval saves a local ticket; repeated approval returns the same ticket ID. The queue and tickets survive a restart.

Duplicate message IDs and identical content are detected before another classification. Conflicting IDs and malformed inputs go to quarantine. Failed model calls remain available for retry.

## Run it

Use Python 3.11+ and a local [Ollama installation](https://ollama.com/). Python's standard library supplies the application dependencies.

From the extracted folder, download the default model if needed and start the app:

```sh
ollama pull qwen3.5:9b
python app.py
```

Open `http://127.0.0.1:8767` in your browser:

1. Choose **Load example inbox**.
2. Choose **Classify pending emails**.
3. Select a message and review its proposed summary, priority and next action.
4. Edit the draft, then choose **Approve & create ticket**.

The model download is approximately 6.6 GB. An installed compatible Ollama model can also be selected with `--model`. The included README explains the endpoint, port and database options.

## Checked example

The supplied messages are fictional. A local run on September 10, 2026 produced these results:

| Check | Observed result |
| --- | --- |
| Input records | 8 |
| Distinct valid messages | 5 |
| Duplicate records skipped | 2 |
| Malformed records quarantined | 1 |
| Drafts from the live local model | 5 |
| Tickets before operator approval | 0 |
| Tickets after one edited draft was approved | 1 |
| Automated workflow tests | 8 passed |

The test suite exercises duplicate handling, edited approval, repeated approval, rejection, error retry, unexpected model fields and persistence. It uses a stub model and runs offline:

```sh
python -m unittest -v
```

`live-model-check.json` contains the separate live run with `qwen3.5:9b`, including the drafts and saved ticket. These observations describe this example; model outputs vary with the model and input.

## Delivery scope

This sample runs on the local computer with JSON input and SQLite ticket storage. The server binds to `127.0.0.1`; model calls are sequential with a 60-second timeout. Live mailbox and help-desk connections can be scoped as additional integrations.

Small fixes and workflow adjustments start at **US$5**. Send one example input and the result you want through [my Upwork profile](https://www.upwork.com/freelancers/~01ab3d2c0acb95f053) to agree a focused task.

Copyright 2026 Donghao Li. Provided as a review sample; commercial reuse or customization can be agreed with the author.
