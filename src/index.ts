import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

// Function to fetch HTML content from the provided URL
async function fetchHTML(url: string) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching the URL:', error);
    process.exit(1);
  }
}

// Function to extract JSON data from the HTML string
function extractJSONData(html: string) {
  const scriptTagStart = '<script id="__NEXT_DATA__" type="application/json" crossorigin="anonymous">';
  const scriptTagEnd = '</script>';

  const startIndex = html.indexOf(scriptTagStart);
  const endIndex = html.indexOf(scriptTagEnd, startIndex);

  if (startIndex === -1 || endIndex === -1) {
    console.error('No JSON data found in <script id="__NEXT_DATA__">');
    process.exit(1);
  }

  const jsonString = html.slice(startIndex + scriptTagStart.length, endIndex);
  return JSON.parse(jsonString);
}

// Function to format chat history to Markdown
function formatToMarkdown(title: string, createTime: number, mapping: any) {
  const formattedDate = new Date(createTime * 1000).toLocaleString();
  let markdown = `# ${title}\n\n`;
  markdown += `**Created at:** ${formattedDate}\n\n`;

  const filteredMapping = Object.values(mapping).filter(
    (item: any) => item.message && item.message.create_time && item.message.content && item.message.content.parts
  );

  const sortedMessages = Object.values(filteredMapping).sort(
    (a: any, b: any) => a.message.create_time - b.message.create_time
  );

  sortedMessages.forEach((item: any) => {
    const message = item.message;
    const content = message.content.parts.join('\n');

    if (message.author.role === 'user') {
      markdown += `> ${content}\n\n\n`;
    } else if (message.author.role === 'assistant') {
      markdown += `${content}\n\n\n`;
    }
  });

  return markdown;
}

// Main function
async function main() {
  if (process.argv.length < 3) {
    console.error('Please provide a URL as an argument.');
    process.exit(1);
  }

  const url = process.argv[2];
  const html = await fetchHTML(url);
  const jsonData = extractJSONData(html);

  const id = url.split('/').pop();
  const title = jsonData.props.pageProps.serverResponse.data.title;
  const createTime = jsonData.props.pageProps.serverResponse.data.create_time;
  const mapping = jsonData.props.pageProps.serverResponse.data.mapping;
  const markdownContent = formatToMarkdown(title, createTime, mapping);

  const filePath = path.join(__dirname, `${id}.md`);
  fs.writeFileSync(filePath, markdownContent, 'utf8');
  console.log(`Chat history saved to ${filePath}`);
}

main();
