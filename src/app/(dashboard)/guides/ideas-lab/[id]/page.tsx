"use client";

import { useQuery } from "@tanstack/react-query";
import { getIdeaLabSessionById } from "@/lib/sanity/client";
import { PortableText as PortableTextComponent } from "@portabletext/react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Loading from "@/app/loading";
import { HeroSection } from "@/components/organisms/guides/ideas-lab/details/HeroSection";
import { GuideIdeasLabCommentSection } from "@/components/organisms/comment/GuideIdeasLabCommentSection";

export default function IdeaLabDetailsPage() {
  const params = useParams();
  const id = params?.id as string;

  const { data, isLoading, error } = useQuery({
    queryKey: ["idea-lab-session", id],
    queryFn: () => getIdeaLabSessionById(id),
    enabled: !!id,
  });

  if (isLoading) return <Loading />;

  if (error || !data)
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        Error loading session data.
      </div>
    );

  return (
    <div className="pb-16 pt-4  px-4 lg:px-14">
      <Link
        href="/guides/ideas-lab"
        className="text-black hover:underline text-sm"
      >
        ← Back
      </Link>
      <div className=" max-w-4xl mx-auto w-full mt-8 lg:mt-16">
        <HeroSection
          title={data.title}
          description={data.description}
          publishedAt={data.date}
          image={data.ideaLabImage}
        />
        <div className="max-w-[886px] mx-auto w-full prose prose-p:text-black">
          <PortableTextComponent value={data.body} />
        </div>

        {/* Comment Section */}
        <div className="max-w-[886px] mx-auto w-full mt-12">
          <GuideIdeasLabCommentSection
            contentId={data._id}
            className="bg-white p-6 rounded-lg border"
          />
        </div>
      </div>
    </div>
  );
}
