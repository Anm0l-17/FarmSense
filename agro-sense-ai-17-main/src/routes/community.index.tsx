import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Heart, MessageSquare, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CardSkeleton, EmptyState } from "@/components/common/states";
import { createCommunityPost, getCommunityPosts } from "@/services/api";
import { CROPS } from "@/data/mock";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { timeAgo } from "@/utils/format";
import type { CommunityPost } from "@/types";

export const Route = createFileRoute("/community/")({
  head: () => ({
    meta: [
      { title: "Farmer Community Q&A — AI Farm Companion" },
      {
        name: "description",
        content:
          "Ask farming questions, share experiences and read AI-suggested plus farmer answers in the community.",
      },
      { property: "og:title", content: "Farmer Community Q&A — AI Farm Companion" },
      {
        property: "og:description",
        content: "Farmer-to-farmer knowledge sharing with AI-suggested answers.",
      },
    ],
  }),
  component: Community,
});

const FILTERS = ["All", "Disease", "Weather", "Market", "Crops"] as const;

function Community() {
  const { t } = useI18n();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ crop: "Tomato", category: "Disease", question: "" });
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    getCommunityPosts()
      .then(setPosts)
      .finally(() => setLoading(false));
  }, []);

  const visible = posts.filter(
    (p) =>
      (filter === "All" || p.category === filter) &&
      p.question.toLowerCase().includes(query.toLowerCase()),
  );

  async function submit() {
    if (!form.question.trim()) return;
    setPosting(true);
    try {
      const post = await createCommunityPost({
        crop: form.crop,
        category: form.category as CommunityPost["category"],
        question: form.question.trim(),
      });
      setPosts((p) => [post, ...p]);
      setForm({ crop: "Tomato", category: "Disease", question: "" });
      setOpen(false);
      toast.success("Your question has been posted");
    } finally {
      setPosting(false);
    }
  }

  return (
    <AppLayout title={t("community.title")} subtitle={t("community.sub")}>
      <div className="mx-auto max-w-3xl space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-52 flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search questions..."
              aria-label="Search questions"
              className="pl-9"
            />
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="size-4" /> Ask Question
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ask the community</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="crop">Crop</Label>
                    <Select value={form.crop} onValueChange={(v) => setForm({ ...form, crop: v })}>
                      <SelectTrigger id="crop">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CROPS.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={form.category}
                      onValueChange={(v) => setForm({ ...form, category: v })}
                    >
                      <SelectTrigger id="category">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {FILTERS.filter((f) => f !== "All").map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="question">Question</Label>
                  <Textarea
                    id="question"
                    rows={4}
                    value={form.question}
                    onChange={(e) => setForm({ ...form, question: e.target.value })}
                    placeholder="Describe what you're seeing in your field..."
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="image">Optional image</Label>
                  <Input id="image" type="file" accept="image/*" />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={submit} disabled={posting || !form.question.trim()}>
                  {posting ? "Posting..." : "Post Question"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                filter === f
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:bg-accent",
              )}
            >
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : visible.length === 0 ? (
          <EmptyState
            title="No questions found."
            message="Be the first farmer to ask a question."
            action={<Button onClick={() => setOpen(true)}>Ask Question</Button>}
          />
        ) : (
          <ul className="space-y-3">
            {visible.map((p) => (
              <li key={p.post_id}>
                <Link
                  to="/community/$id"
                  params={{ id: p.post_id }}
                  className="surface-card block p-4 transition-shadow hover:shadow-lg"
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="size-9">
                      <AvatarFallback className="bg-accent text-xs text-accent-foreground">
                        {p.author.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold">{p.author}</p>
                      <p className="mt-0.5 font-medium">{p.question}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span className="rounded-full bg-accent px-2 py-0.5 font-medium text-accent-foreground">
                          {p.crop}
                        </span>
                        <span className="rounded-full bg-muted px-2 py-0.5 font-medium">
                          {p.category}
                        </span>
                        <span>{timeAgo(p.created_at)}</span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="size-3.5" aria-hidden /> {p.answer_count} answers
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="size-3.5" aria-hidden /> {p.like_count}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AppLayout>
  );
}
