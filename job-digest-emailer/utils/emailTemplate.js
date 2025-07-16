function buildJobDigestHtml(featured, latest) {
    const formatList = (jobs) =>
      jobs.map(job => `<li><a href="${job.url}">${job.title}</a> at ${job.company}</li>`).join("");
  
    return `
      <h2>✨ Featured Jobs</h2>
      <ul>${formatList(featured)}</ul>
      <h2>🆕 Latest ${latest[0]?.level || ''} Jobs</h2>
      <ul>${formatList(latest)}</ul>
    `;
  }
  
  module.exports = { buildJobDigestHtml };
  