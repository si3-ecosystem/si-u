"use client";

import { useQuery } from "@tanstack/react-query";
import { getIdeaLabSessionById } from "@/lib/sanity/client";
import { PortableText as PortableTextComponent } from "@portabletext/react";
import { useParams } from "next/navigation";
import Loading from "@/app/loading";
import { GuideIdeasLabCommentSection } from "@/components/organisms/comment/GuideIdeasLabCommentSection";
import { ContentDetailLayout } from "@/components/organisms/layout/ContentDetailLayout";
import { ContentHero } from "@/components/molecules/content/ContentHero";

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
      <ContentDetailLayout
        backHref="/guides/ideas-lab"
        backLabel="Back to Ideas Lab"
        contentId={data._id}
        contentType="guide_ideas_lab"
        userRole="guide"
        enableComments={false} // Disable built-in comments, we'll use our optimized version
        maxWidth="xl"
      >
        {/* Hero Section */}
        <div className="">
          <ContentHero
            title={data.title}
            description={data.description}
            publishedAt={data.date}
            category={data.category}
            image={data.ideaLabImage}
            variant="default"
          />
        </div>

        {/* Content Body */}
        <div className="bg-white p-6 ">
          <div className="w-full max-w-7xl mx-auto prose prose-lg prose-gray">
            <PortableTextComponent value={data.body} />
          </div>
        </div>

        {/* Optimized Comment Section */}
        <div className="mt-8 bg-white">
          <div className="w-full mx-auto p-6">
            <GuideIdeasLabCommentSection
              contentId={data._id}
              className="bg-white p-6 rounded-lg border"
            />
          </div>
        </div>
      </ContentDetailLayout>
    </div>
  );
}
