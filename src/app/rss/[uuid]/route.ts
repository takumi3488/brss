import extractData from "@/lib/extractData";
import { pageToRss } from "@/lib/pageToRss";
import { sql } from "@vercel/postgres";
import { unstable_cache } from "next/cache";

export async function GET(
  req: Request,
  { params }: { params: { uuid: string } },
) {
  const cachedData = await unstable_cache(
    async function () {
      // DBからuuidに一致するページを取得
      const { uuid } = params;
      const { rows } = await sql`
        SELECT
        link,
        article_link_selector,
        article_title_selector,
        article_date_selector
        FROM pages
        WHERE uuid = ${uuid}`;
      if (rows.length === 0) return new Response("404", { status: 404 });
      return rows[0];
    },
    [`rss-${params.uuid}`],
  )();
  if (cachedData instanceof Response) return cachedData;

  // 記事データを取得
  const {
    link,
    article_link_selector,
    article_title_selector,
    article_date_selector,
  } = cachedData;
  const page = await extractData(
    link,
    article_link_selector,
    article_title_selector,
    article_date_selector,
    true,
  );
  if ("msg" in page) return new Response(page.msg, { status: 500 });

  // RSSを返す
  return new Response(pageToRss(page));
}
