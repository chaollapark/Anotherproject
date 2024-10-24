export function convertUrlsToLinks(text: string): string {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.split('\n').map(line => 
    line.replace(urlRegex, (url) => `<a href="${url}" target="_blank" rel="noopener noreferrer" class="job-description-link">${url}</a>`)
  ).join('<br>');
}

