import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://teacherbuff.com";

  const pages: MetadataRoute.Sitemap = [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/community`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${base}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  // 커뮤니티 글 동적 추가
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: posts } = await supabase
      .from("posts")
      .select("id, updated_at")
      .order("created_at", { ascending: false })
      .limit(500);

    if (posts) {
      for (const post of posts) {
        pages.push({
          url: `${base}/community/${post.id}`,
          lastModified: new Date(post.updated_at),
          changeFrequency: "weekly",
          priority: 0.7,
        });
      }
    }
  } catch {
    // 테이블이 아직 없어도 에러 무시
  }

  return pages;
}
