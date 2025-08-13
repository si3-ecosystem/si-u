"use client";

import { useQuery } from "@tanstack/react-query";
import { getGrow3dgeIdeasLabCardById } from "@/lib/sanity/client";
import { PortableText as PortableTextComponent } from "@portabletext/react";
import { useParams } from "next/navigation";
import { useAppSelector } from "@/redux/store";
import { useState, useEffect } from "react";
import Loading from "@/app/loading";
import { ContentDetailLayout } from "@/components/organisms/layout/ContentDetailLayout";
import { ContentHero } from "@/components/molecules/content/ContentHero";
import { IdeasLabCommentSection } from "@/components/organisms/comment/IdeasLabCommentSection";
import { CommentNotifications } from "@/components/molecules/comment/CommentNotifications";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock } from "lucide-react";

export default function Grow3dgeIdeaLabDetail() {
  const [isClient, setIsClient] = useState(false);
  const params = useParams();
  const currentUser = useAppSelector((state) => state.user);
  const id = params?.id as string;

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { data, isLoading, error } = useQuery({
    queryKey: ["grow3dge-idea-lab-detail", id],
    queryFn: () => getGrow3dgeIdeasLabCardById(id),
    enabled: !!id,
  });

  // Check if user has partner role
  const hasPartnerRole = isClient && (currentUser?.user?.roles?.includes('partner') || currentUser?.user?.roles?.includes('admin'));

  if (isLoading) return <Loading />;

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Content Not Found</h1>
        <p className="text-gray-600">The requested idea lab content could not be found.</p>
      </div>
    );
  }

  // Show access denied if user doesn't have partner role
  if (isClient && !hasPartnerRole) {
    return (
      <div className="w-full min-h-screen p-4 lg:p-6">
        <div className="max-w-4xl mx-auto">
          <Alert className="border-amber-200 bg-amber-50">
            <Lock className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              <div className="space-y-2">
                <h3 className="font-semibold">Partner Access Required</h3>
                <p>
                  This content is exclusively available to our partner community.
                  Partners have access to detailed insights, research findings, and
                  can participate in discussions through comments.
                </p>
                <p className="text-sm">
                  If you believe you should have access, please contact your account manager
                  or reach out to our support team.
                </p>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <>
      <ContentDetailLayout
        backHref="/grow3dge/ideas-lab"
        backLabel="Back to Ideas Lab"
        contentId={data._id}
        contentType="grow3dge-idea-lab"
        userRole="partner"
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
