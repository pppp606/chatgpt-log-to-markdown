# chatgpt-log-to-markdown

## Introduction
The `chatgpt-log-to-markdown` tool allows users to convert chat logs from ChatGPT shared links into a readable and well-structured Markdown format. This tool extracts conversation data from the provided shared link, formats it, and saves it as a Markdown file. This makes it easier to read, archive, or share your ChatGPT conversations in a human-friendly format.

In addition to the command-line tool, we have also created a web page that offers the same functionality. This web page provides a user-friendly interface to input your shared links and generate Markdown files without needing to run any scripts locally.

## Install Package
```bash
npm install
```

## Usage
1. [Get Shared Links of the article you want to convert](https://help.openai.com/en/articles/7925741-chatgpt-shared-links-faq)

2. Run Script
```bash
npm run generate https://chat.openai.com/share/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

## Web Page Usage
For users who prefer a graphical interface, you can use our web page to convert ChatGPT shared links to Markdown:

1. Open the web page at https://chatgpt-log-to-markdown-web.vercel.app/
2. Paste the ChatGPT shared link into the provided input field
3. Click the "Generate" button
