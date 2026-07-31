import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Bot, Heart } from "lucide-react";
import { toast } from "sonner";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CardSkeleton, EmptyState } from "@/components/common/states";
import { addCommunityAnswer, getCommunityPost } from "@/services/api";
import { timeAgo } from "@/utils/format";
import type { CommunityPost } from "@/types";

export const Route = createFileRoute("/community/$id")({
  head: () => ({
    meta: [
      { title: "Community Question — AI Farm Companion" },
      {
        name: "description",
        content: "Read the AI-suggested answer and farmer answers for this community question.",
      },
      { property: "og:title", content: "Community Question — AI Farm Companion" },
      {
        property: "og:description",
        content: "AI-suggested and farmer answers to a crop question.",
      },
    ],
  }),
  component: CommunityDetail,
});

function CommunityDetail() {
  const { id } = useParams({ from: "/community/$id" });
  const [post, setPost] = useState<CommunityPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [answer, setAnswer] = useState("");
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    setLoading(true);
    getCommunityPost(id)
      .then((p) => setPost(p ?? null))
      .finally(() => setLoading(false));
  }, [id]);

  async function submit() {
    if (!answer.trim() || !post) return;
    setPosting(true);
    try {
      const created = await addCommunityAnswer(post.post_id, answer.trim());
      setPost({
        ...post,
        answers: [...post.answers, created],
        answer_count: post.answer_count + 1,
      });
      setAnswer("");
      toast.success("Answer posted");
    } finally {
      setPosting(false);
    }
  }

  const aiAnswers = post?.answers.filter((a) => a.is_ai_generated) ?? [];
  const farmerAnswers = post?.answers.filter((a) => !a.is_ai_generated) ?? [];

  return (
    <AppLayout title="Community Question" subtitle="Answers from AI and fellow farmers.">
      <div className="mx-auto max-w-3xl space-y-4">
        <Button asChild variant="ghost" size="sm" className="px-0">
          <Link to="/community">
            <ArrowLeft className="size-4" /> Back to community
          </Link>
        </Button>

        {loading ? (
          <CardSkeleton rows={4} />
        ) : !post ? (
          <EmptyState title="Question not found." message="This question may have been removed." />
        ) : (
          <>
            <section className="surface-card p-5">
              <div className="flex items-start gap-3">
                <Avatar className="size-10">
                  <AvatarFallback className="bg-accent text-xs text-accent-foreground">
                    {post.author.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold">{post.author}</p>
                  <p className="text-xs text-muted-foreground">{timeAgo(post.created_at)}</p>
                </div>
              </div>
              <h2 className="mt-4 text-xl font-bold">{post.question}</h2>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-accent px-2.5 py-1 font-medium text-accent-foreground">
                  {post.crop}
                </span>
                <span className="rounded-full bg-muted px-2.5 py-1 font-medium">{post.category}</span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Heart className="size-3.5" aria-hidden /> {post.like_count}
                </span>
              </div>
              {post.image_url && (
                <img
                  src={post.image_url}
                  alt="Attached crop photo"
                  className="mt-4 max-h-72 w-full rounded-xl object-cover"
                />
              )}
            </section>

            {aiAnswers.map((a) => (
              <section key={a.answer_id} className="surface-card border-primary/30 bg-accent/50 p-5">
                <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                  <Bot className="size-4" aria-hidden /> 🤖 AI Suggested Answer
                  <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase text-primary-foreground">
                    AI-generated
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed">{a.answer}</p>
              </section>
            ))}

            <section className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Community Answers ({farmerAnswers.length})
              </h3>
              {farmerAnswers.length === 0 ? (
                <EmptyState title="No answers yet." message="Be the first to help this farmer." />
              ) : (
                farmerAnswers.map((a) => (
                  <article key={a.answer_id} className="surface-card p-4">
                    <div className="flex items-center gap-2">
                      <Avatar className="size-8">
                        <AvatarFallback className="bg-muted text-xs">
                          {a.author.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-semibold">{a.author}</p>
                        <p className="text-xs text-muted-foreground">{timeAgo(a.created_at)}</p>
                      </div>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed">{a.answer}</p>
                  </article>
                ))
              )}
            </section>

            <section className="surface-card space-y-3 p-4">
              <Textarea
                rows={3}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Write an answer..."
                aria-label="Write an answer"
              />
              <Button onClick={submit} disabled={posting || !answer.trim()}>
                {posting ? "Posting..." : "Post Answer"}
              </Button>
            </section>
          </>
        )}
      </div>
    </AppLayout>
  );
}
