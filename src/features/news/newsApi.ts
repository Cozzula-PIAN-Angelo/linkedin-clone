import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { NewsItem } from "./types";

interface NewsDataArticle {
  article_id: string;
  title: string;
  link: string;
  pubDate: string;
  source_name: string;
}

interface NewsDataResponse {
  status: string;
  results: NewsDataArticle[];
}

function mapArticleToNewsItem(article: NewsDataArticle): NewsItem {
  const date = new Date(article.pubDate.replace(" ", "T") + "Z");
  const formattedDate = date.toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "short",
  });

  return {
    id: article.article_id,
    title: article.title,
    link: article.link,
    meta: `${article.source_name} · ${formattedDate}`,
  };
}

export const newsApi = createApi({
  reducerPath: "newsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://newsdata.io/api/1/" }),
  endpoints: (builder) => ({
    getLatestNews: builder.query<NewsItem[], void>({
      query: () => ({
        url: "latest",
        params: {
          apikey: import.meta.env.VITE_NEWSDATA_API_KEY,
          country: "it",
          language: "it",
          category: "business",
        },
      }),
      transformResponse: (response: NewsDataResponse) =>
        response.results.map(mapArticleToNewsItem),
    }),
  }),
});

export const { useGetLatestNewsQuery } = newsApi;
