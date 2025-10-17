import ExplorePostDetail from "./ExplorePostDetails"
import { supabaseServer } from "@/lib/supabase/server"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params

  if (!id) {
    return {
      title: "Post not found",
      description: "No post found for the given ID on BharatVibes.",
    }
  }

  try {
    const supabase = supabaseServer()

    // 1️⃣ Fetch post details
    const { data: post, error: postError } = await supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .single()

    if (postError || !post) {
      return {
        title: "Post not found",
        description: "This post may have been removed or does not exist.",
      }
    }

    // 2️⃣ Fetch associated profile details
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("username, full_name, avatar_url")
      .eq("id", post.user_id)
      .single()

    if (profileError) {
      console.warn("Profile fetch warning:", profileError)
    }

    // 3️⃣ Construct metadata
    const title =
      post.title ||
      `${profile?.username || "User"} shared a ${post.type} story on BharatVibes`

    const description =
      post.content?.slice(0, 160) ||
      `Discover this ${post.type} experience from ${profile?.full_name || "an explorer"} on BharatVibes.`

    const image =
      post.media_url ||
      profile?.avatar_url ||
      "https://bharatvibes.vercel.app/logo.png"

    const author = profile?.full_name || profile?.username || "Anonymous"
    const url = `https://bharatvibes.vercel.app/posts/${id}`

    // 4️⃣ Return SEO, OpenGraph, Twitter, Canonical
    return {
      title,
      description,
      keywords: [
        post.type,
        "Bharat Vibes",
        "India Culture",
        "Food",
        "Travel",
        "Tour Guide",
        "Indian Locations",
        author,
      ],
      authors: [{ name: author }],
      alternates: {
        canonical: url,
      },
      openGraph: {
        title,
        description,
        url,
        type: "article",
        siteName: "BharatVibes",
        images: [
          {
            url: image,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        creator: author ? `@${author}` : undefined,
        images: [image],
      },
      robots: {
        index: true,
        follow: true,
        nocache: false,
      },
    }
  } catch (err) {
    console.error("Metadata generation failed:", err)
    return {
      title: "BharatVibes",
      description: "Discover culture, food, and travel stories across India.",
    }
  }
}

export default function Page() {
  return <ExplorePostDetail />
}
