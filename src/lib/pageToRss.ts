import { Page } from "./extractData";

export function pageToRss(page: Page) {
  const now = new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });
  const items = page.articles
    .map((article) =>
      `
    <item>
      <title>${article.title}</title>
      <link>${article.link}</link>
      <pubDate>${article.pubDate}</pubDate>
    </item>`.slice(1),
    )
    .join("\n");
  return `<!-- Built by brss.vercel.app at ${now} -->
<rss version="2.0">
  <channel>
    <title>${page.title}</title>
    <link>${page.link}</link>
    <description>${page.description}</description>
${items}
  </channel>
</rss>`;
}
