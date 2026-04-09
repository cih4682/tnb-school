import { createClient } from "@supabase/supabase-js";
import type { Metadata } from "next";
import { PostDetail } from "./PostDetail";

const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Props {
  params: { id: string };
}

// SSR로 메타태그 생성 → SEO 노출
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data: post } = await supabaseServer
    .from("posts")
    .select("title, content")
    .eq("id", params.id)
    .single();

  if (!post) {
    return { title: "게시글을 찾을 수 없습니다" };
  }

  const plainText = post.content.replace(/<[^>]*>/g, "");
  const description = plainText.slice(0, 150) + (plainText.length > 150 ? "..." : "");

  return {
    title: post.title,
    description,
    openGraph: {
      title: `${post.title} | T&B School 커뮤니티`,
      description,
      type: "article",
    },
  };
}

export default async function PostPage({ params }: Props) {
  // 조회수 증가
  await supabaseServer.rpc("increment_view_count", { post_id: params.id }).catch(() => {});

  // 게시글 가져오기
  const { data: post } = await supabaseServer
    .from("posts")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!post) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-slate-400">게시글을 찾을 수 없습니다.</p>
      </div>
    );
  }

  // 댓글 가져오기
  const { data: comments } = await supabaseServer
    .from("comments")
    .select("*")
    .eq("post_id", params.id)
    .order("created_at", { ascending: true });

  return <PostDetail post={post} initialComments={comments || []} />;
}
