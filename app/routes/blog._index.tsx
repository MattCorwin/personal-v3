import StackablePair from "~/components/StackablePair/StackablePair";
import { Link, useLoaderData } from "@remix-run/react";
import { getPosts } from "~/models/post.server";
import { json } from "@remix-run/node";

export const loader = async () => {
  return json({ posts: await getPosts() });
};

export default function Blog() {
  const { posts } = useLoaderData<typeof loader>();
  return (
    <div className="wrapper">
      <div className="heading-with-sub">
        <h1>BLOG</h1>
        <h2>Stuff I'll forget if I don't write it down</h2>
      </div>
      {posts.map((post) => (
        <div className="heading-with-sub" key={post.slug}>
          <h2>{post.title}</h2>
          <StackablePair >
            <Link to={post.slug} prefetch="render">
              <img
                className="rounded-image"
                src={post.image}
                alt={post.imageAltText}
              />
            </Link>
            <h3>{post.summary}</h3>
          </StackablePair>
        </div>
      ))}
    </div>
  );
}
