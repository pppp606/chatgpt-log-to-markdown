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
  const scriptTagStart = /<script nonce=".[^"]*">window\.__remixContext/;
  const scriptTagEnd = '</script>';

  const startIndex = html.search(scriptTagStart);
  const endIndex = html.indexOf(scriptTagEnd, startIndex);

  if (startIndex === -1 || endIndex === -1) {
    console.error('No JSON data found in <script> tag.');
    process.exit(1);
  }

  const jsonString = html.slice(startIndex, endIndex).split('window.__remixContext = ')[1].split(';__remixContext')[0];

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

  const data = jsonData.state.loaderData['routes/share.$shareId.($action)'].serverResponse.data;

  const id = url.split('/').pop();
  const title = data.title;
  const createTime = data.createTime;
  const mapping = data.mapping;
  const markdownContent = formatToMarkdown(title, createTime, mapping);

  const filePath = path.join(__dirname, `${id}.md`);
  fs.writeFileSync(filePath, markdownContent, 'utf8');
  console.log(`Chat history saved to ${filePath}`);
}

main();
