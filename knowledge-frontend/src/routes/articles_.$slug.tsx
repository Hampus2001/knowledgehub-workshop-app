import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/articles_/$slug")({
  loader: async ({ params }) => {
    const res = await fetch(
      `http://localhost:1337/api/articles?filters[slug][$eq]=${params.slug}&populate=*`
    );
    const data = await res.json();

    return { article: data.data };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { article } = Route.useLoaderData();
  const data = article[0];
  console.log("data", data);
  return (
    <div className="flex w-full min-h-screen justify-center p-8">
      <div className="flex flex-col w-3/5 items-center justify-center p-8 gap-8 shadow-md rounded-lg">
        <div className="flex w-full justify-between items-center">
          <Link
            className="p-2 bg-slate-800 text-white rounded-lg"
            to="/articles"
          >
            Go Back
          </Link>
          <p className="text-gray-500">Category: {data.category.name}</p>
        </div>
        <h2 className="text-2xl p-4">{data.title}</h2>
        <div className="prose max-w-none flex flex-col w-full">
          <BlocksRenderer
            content={data.content}
            blocks={{
              image: ({ image }) => (
                <img
                  src={image.url}
                  alt={image.alternativeText as string}
                  className="w-full h-[450px] bg-cover rounded-md"
                />
              ),
            }}
          />
        </div>
      </div>
    </div>
  );
}
