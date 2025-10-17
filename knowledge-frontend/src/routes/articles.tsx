import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/articles")({
  loader: async () => {
    const res = await fetch("http://localhost:1337/api/articles");
    const data = await res.json();

    const res2 = await fetch("http://localhost:1337/api/categories");
    const data2 = await res2.json();

    return {
      articles: data.data,
      categories: data2.data,
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { articles } = Route.useLoaderData();
  const { categories } = Route.useLoaderData();

  const [selCategory, setSelCategory] = useState<string>("");
  const [selArticles, setSelArticles] = useState<any[]>(articles);
  const [loading, setLoading] = useState<boolean>(false);

  async function fetchArticles(category: string) {
    setLoading(true);
    if (category != "all") {
      const res = await fetch(
        `http://localhost:1337/api/articles?filters[category][name][$eq]=${category}&populate=*`
      );
      const data = await res.json();
      setSelArticles(data.data);
    } else if (category == "all") {
      setSelArticles(articles);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (selCategory) {
      fetchArticles(selCategory);
    }
  }, [selCategory]);

  function sliceText(text: string, type: "title" | "body"): string {
    if (text.length > 30 && type == "title") {
      const newTitle = text.trim().slice(0, 30).trim() + "...";
      return newTitle;
    }
    if (text.length > 300 && type == "body") {
      const newBody = text.trim().slice(0, 300).trim() + "...";
      return newBody;
    }
    return text;
  }

  return (
    <div className="flex flex-col items-center w-full min-h-screen justify-center">
      <div className="gap-4 p-8 flex flex-wrap items-center justify-center w-5/6 shadow-lg m-8 ">
        <div className="flex w-full gap-8">
          <Link className="p-2 bg-slate-800 text-white rounded-lg" to="/">
            Go Back
          </Link>
          <select
            className="p-2 border-2 border-black rounded-lg"
            onChange={(e) => setSelCategory(e.target.value)}
          >
            <option value={"all"}>All</option>
            {categories?.map((category: any, i: number) => (
              <option key={i} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <section className="flex w-full gap-8">
          {loading && (
            <div className="flex w-full h-full justify-center items-center">
              Loading...
            </div>
          )}
          {selArticles?.map((art: any, i: number) => (
            <article
              className="prose flex flex-col w-1/5 h-[600px] overflow-hidden gap-8 p-8 rounded-lg shadow-md hover:shadow-xl"
              key={i}
            >
              <Link
                to="/articles/$slug"
                params={{ slug: art.slug }}
                className="text-2xl"
              >
                {sliceText(art.title, "title")}
              </Link>
              <BlocksRenderer
                content={art.content}
                blocks={{
                  image: ({ image }) => (
                    <img
                      src={image.url}
                      alt={image.alternativeText as string}
                      className="w-full h-[150px] bg-cover"
                    />
                  ),
                }}
              />
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
