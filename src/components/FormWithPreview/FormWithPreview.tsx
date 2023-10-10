"use client";

import { useState } from "react";
import Input from "../Input";
import Label from "../Label";
import { Page } from "@/lib/extractData";
import { handleSubmit } from "./actions";
import Link from "next/link";

export type FormValue = {
  url: string;
  articleLinkSelector: string;
  articleTitleSelector: string;
  articleDateSelector: string;
};
export default function FormWithPreview() {
  // フォームの値を管理する
  const [formValue, setFormValue] = useState<FormValue>({
    url: "",
    articleLinkSelector: "",
    articleTitleSelector: "",
    articleDateSelector: "",
  });
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisabled(true);
    const value = e.target.value;
    const name = e.target.name;
    setFormValue({ ...formValue, [name]: value });
  };

  // プレビューの値を管理する
  const [preview, setPreview] = useState<string[]>([""]);
  async function handlePreview() {
    setPreview(["プレビューを取得中..."]);
    const res = await fetch("/api/preview", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formValue),
    });
    const page = (await res.json()) as Page | { msg: string };
    if ("msg" in page) {
      setPreview([page.msg]);
      return;
    }
    setPreview([
      `title: ${page.title}`,
      `link: ${page.link}`,
      `desctiption: ${page.description}`,
      ...page.articles.map(
        (article) =>
          `article: ${article.title} ${article.link} ${article.pubDate}`,
      ),
    ]);
    setDisabled(false);
  }

  // RSS生成ボタンの処理
  const [disabled, setDisabled] = useState<boolean>(true);

  // 生成結果の表示
  const [result, setResult] = useState<string>("");

  return (
    <div className="grid grid-cols-2 p-4 mx-auto max-w-md md:max-w-2xl gap-8">
      <div className="col-span-2 md:col-span-1">
        <h2 className="text-center font-bold mb-4">新規作成</h2>
        <form
          action={async function (formData: FormData) {
            setDisabled(true);
            setResult("作成中...");
            const res = await handleSubmit(formData);
            if ("msg" in res) {
              setPreview([res.msg]);
              setDisabled(false);
              setResult("");
              return;
            }
            setResult(res.uuid);
          }}
        >
          <div className="pb-4">
            <Label htmlFor="url">記事一覧ページのURL</Label>
            <Input
              name="url"
              placeholder="https://example.com"
              value={formValue.url}
              onChange={handleInput}
            />
          </div>
          <div className="pb-4">
            <Label htmlFor="articleLinkSelector">記事リンクのCSSセレクタ</Label>
            <Input
              name="articleLinkSelector"
              placeholder=".article-list > a"
              value={formValue.articleLinkSelector}
              onChange={handleInput}
            />
          </div>
          <div className="pb-4">
            <Label htmlFor="articleTitleSelector">
              記事タイトルのCSSセレクタ
            </Label>
            <Input
              name="articleTitleSelector"
              placeholder=".article-list > h2"
              value={formValue.articleTitleSelector}
              onChange={handleInput}
            />
          </div>
          <div className="pb-4">
            <Label htmlFor="articleDateSelector">
              記事更新日時のCSSセレクタ
            </Label>
            <Input
              name="articleDateSelector"
              placeholder=".article-list > time"
              value={formValue.articleDateSelector}
              onChange={handleInput}
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mt-8">
            <button
              type="button"
              onClick={handlePreview}
              className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-center text-sm
                         font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-100 focus:ring
                       focus:ring-gray-100 disabled:cursor-not-allowed disabled:border-gray-100
                       disabled:bg-gray-50 disabled:text-gray-400"
            >
              プレビュー
            </button>
            <input
              type="submit"
              disabled={disabled}
              className="rounded-lg border border-primary-500 bg-primary-500 px-5 py-2.5 text-center text-sm
                         font-medium text-white shadow-sm transition-all hover:border-primary-700 hover:bg-primary-700
                         focus:ring focus:ring-primary-200 disabled:cursor-not-allowed disabled:border-primary-300
                         disabled:bg-primary-300"
              value="RSSを作成"
            />
          </div>
        </form>
        {result && (
          <div>
            <h2 className="text-center font-bold mt-8 mb-4">
              作成したRSSのURL
            </h2>
            <Link
              className="text-center underline text-primary-700 hover:text-primary-500"
              href={`${location.origin}/rss/${result}`}
            >
              {`${location.origin}/rss/${result}`}
            </Link>
          </div>
        )}
      </div>
      <div className="col-span-2 md:col-span-1">
        <h2 className="text-center font-bold mb-4">プレビュー</h2>
        {preview.map((item, index) => (
          <p key={index} className="text-sm">
            {item}
          </p>
        ))}
      </div>
    </div>
  );
}
