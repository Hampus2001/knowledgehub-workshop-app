import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  loader: async () => {
    const blocksRes = await fetch("http://localhost:1337/api/landingpage");
    const blocksData = await blocksRes.json();

    return { landingpage: blocksData.data };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { landingpage } = Route.useLoaderData();

  return (
    <div className="flex w-full h-screen flex-col justify-center items-center gap-8">
      <section className="prose prose-h1:text-center prose-h3:text-center">
        <BlocksRenderer content={landingpage.heading} />
      </section>
      <Link
        className="p-4 bg-indigo-500 rounded-lg text-white font-bold shadow-md hover:bg-indigo-600 transition-colors duration-300"
        to="/articles"
      >
        View articles
      </Link>
    </div>
  );
}
