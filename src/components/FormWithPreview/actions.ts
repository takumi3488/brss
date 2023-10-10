"use server";

import { randomUUID } from "crypto";
import extractData from "@/lib/extractData";
import { sql } from "@vercel/postgres";

export async function handleSubmit(
  formData: FormData,
): Promise<{ msg: string } | { uuid: string }> {
  const url = formData.get("url") as string;
  const articleLinkSelector = formData.get("articleLinkSelector") as string;
  const articleTitleSelector = formData.get("articleTitleSelector") as string;
  const articleDateSelector = formData.get("articleDateSelector") as string;
  const page = await extractData(
    url,
    articleLinkSelector,
    articleTitleSelector,
    articleDateSelector,
  );
  if ("msg" in page) {
    return page;
  }
  const uuid = randomUUID();
  await sql`INSERT INTO pages (
              uuid,
              link,
              article_link_selector,
              article_title_selector,
              article_date_selector
            ) VALUES (
              ${uuid},
              ${url},
              ${articleLinkSelector},
              ${articleTitleSelector},
              ${articleDateSelector}
            )`;
  return { uuid };
}
