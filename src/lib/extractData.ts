"use server";

import { load } from "cheerio";

export type Page = {
  link: string;
  title: string;
  description: string;
  articles: Article[];
};
type Article = {
  link: string;
  title: string;
  pubDate: string;
};
export default async function extractData(
  url: string,
  articlelinkSelector?: string,
  articleTitleSelector?: string,
  articleDateSelector?: string,
  cache?: boolean,
): Promise<Page | { msg: string }> {
  const res = await fetch(url, {
    cache: cache ? undefined : "no-cache",
    next: {
      revalidate: cache ? 60 * 15 : undefined
    }
  });
  // 一覧ページを取得
  if (!res.ok) return { msg: `${url} の取得に失敗しました` };
  const html = await res.text();
  const $ = load(html);

  // サイトの情報を取得
  const page: Page = {
    link: url,
    title: $("title").text(),
    description: $("meta[name='description']").attr("content") || "",
    articles: [],
  };
  if (!articlelinkSelector || !articleTitleSelector || !articleDateSelector)
    return page;

  // 記事ごとの情報を取得
  const articleLinks = $(articlelinkSelector)
    .map((_, el) => $(el).attr("href"))
    .toArray()
    .filter((link) => link)
    .map((link) => new URL(link, url).href);
  const articleTitles = $(articleTitleSelector)
    .map((_, el) => $(el).text())
    .toArray()
    .filter((title) => title);
  const articleDates = $(articleDateSelector)
    .map((_, el) => $(el).text().trim())
    .toArray()
    .map((date) => textToDatetime(date));
  if (
    !(
      articleLinks.length === articleTitles.length &&
      articleTitles.length === articleDates.length
    )
  ) {
    return {
      msg: `記事のリンク,タイトル,更新日時の数が一致しません\n記事のリンク: ${articleLinks.length}個\n記事のタイトル: ${articleTitles.length}個\n記事の更新日時: ${articleDates.length}個`,
    };
  }
  if (articleLinks.length === 0)
    return { msg: `記事のリンクが取得できませんでした` };
  for (let i = 0; i < articleLinks.length; i++) {
    page.articles.push({
      link: articleLinks[i],
      title: articleTitles[i],
      pubDate: articleDates[i],
    });
  }

  return page;
}

function textToDatetime(text: string): string {
  const dt = new Date();
  const prevPtn = /(\d+)([秒分日]|時間)前/;
  const datePtn = /(\d{4})年|-|\.(\d{1,2})月|-|\.(\d{1,2})日|-|\./;
  switch (true) {
    case prevPtn.test(text):
      const [, num, unit] = text.match(prevPtn)!;
      switch (unit) {
        case "秒":
          dt.setSeconds(dt.getSeconds() - Number(num));
          break;
        case "分":
          dt.setMinutes(dt.getMinutes() - Number(num));
          break;
        case "時間":
          dt.setMinutes(0, 0, 0);
          dt.setHours(dt.getHours() - Number(num));
          break;
        case "日":
          dt.setHours(0, 0, 0);
          dt.setDate(dt.getDate() - Number(num));
          break;
      }
      break;
    case datePtn.test(text):
      const [, year, month, day] = text.match(datePtn)!;
      dt.setMinutes(0, 0, 0);
      dt.setFullYear(Number(year));
      dt.setMonth(Number(month) - 1);
      dt.setDate(Number(day));
      break;
    default:
      break;
  }

  return dt.toUTCString();
}
