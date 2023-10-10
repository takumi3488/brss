-- pagesテーブルの作成
create table if not exists pages (
    uuid uuid not null,
    link text not null,
    article_link_selector text not null,
    article_title_selector text not null,
    article_date_selector text not null
);
create index if not exists pages_uuid_idx on pages using hash (uuid);
