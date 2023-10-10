import { FormValue } from "@/components/FormWithPreview/FormWithPreview";
import extractData from "@/lib/extractData";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const {
    url,
    articleLinkSelector,
    articleTitleSelector,
    articleDateSelector,
  } = (await req.json()) as FormValue;
  const page = await extractData(
    url,
    articleLinkSelector,
    articleTitleSelector,
    articleDateSelector,
  );
  return NextResponse.json(page);
}
