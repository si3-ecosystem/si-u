"use client";

import { useQuery } from "@tanstack/react-query";
import { getScholarsIdeasLabCardById } from "@/lib/sanity/client";
import { PortableText as PortableTextComponent } from "@portabletext/react";
import { useParams } from "next/navigation";
import Loading from "@/app/loading";
import { ContentDetailLayout } from "@/components/organisms/layout/ContentDetailLayout";
import { ContentHero } from "@/components/molecules/content/ContentHero";
import { IdeasLabCommentSection } from "@/components/organisms/comment/IdeasLabCommentSection";
import { CommentNotifications } from "@/components/molecules/comment/CommentNotifications";

export default function ScholarsIdeaLabDetail() {
  const params = useParams();
  const id = params?.id as string;

  const { data, isLoading, error } = useQuery({
    queryKey: ["scholars-idea-lab-detail", id],
    queryFn: () => getScholarsIdeasLabCardById(id),
    enabled: !!id,
  });

  if (isLoading) return <Loading />;

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Content Not Found</h1>
        <p className="text-gray-600">The requested idea lab content could not be found.</p>
      </div>
    );
  }

  return (
    <>
      <ContentDetailLayout
        backHref="/scholars/ideas-lab"
        backLabel="Back to Ideas Lab"
        contentId={data._id}
        contentType="scholar_ideas_lab"
        userRole="scholar" // TODO: Get from auth context
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
            <IdeasLabCommentSection
              contentId={data._id}
              className="mt-8"
            />
          </div>
        </div>
      </ContentDetailLayout>

      {/* Global notifications */}
      <CommentNotifications />
    </>
  );
}
