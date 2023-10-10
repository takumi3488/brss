import FormWithPreview from "@/components/FormWithPreview/FormWithPreview";

export default function Home() {
  return (
    <div>
      <header className="p-8">
        <h1 className="text-center text-2xl font-extrabold">BRSS</h1>
        <p className="text-center">
          CSSセレクタを用いてWebページからRSSフィードを生成します
        </p>
        <p className="text-center text-xs text-gray-600">
          ※ 機械的なアクセスが禁止されているページに使用しないでください
        </p>
      </header>
      <main>
        <div>
          <FormWithPreview />
        </div>
      </main>
    </div>
  );
}
