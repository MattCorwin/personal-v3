import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { marked } from "marked";

import { getPost } from "~/models/post.server";

export const loader: LoaderFunction = async ({ params }) => {
  if (params.slug) {
    const post = await getPost(params.slug);
    const html = marked(post.markdown);
    return json({ post, html });
  }
};

export default function PostSlug() {
  const { post, html } = useLoaderData<typeof loader>();
  return (
    <div className="wrapper">
      <h1>{post.title}</h1>
      <h2>{post.summary}</h2>
      <img
        className="rounded-image"
        src={post.image}
        alt="Person standing in front of a tree"
      />

      <h2>{post.body}</h2>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
