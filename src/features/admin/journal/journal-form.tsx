"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FormField, FormSelect, type FieldErrors } from "@/features/admin/shared/form-field";
import { TagsEditor } from "@/features/admin/journal/tags-editor";
import { CONTENT_STATUSES } from "@/lib/validation/collections";
import { getStoragePublicUrl } from "@/lib/storage";
import type { ActionResult } from "@/lib/validation/action-result";
import type { JournalPost } from "@/services/journal";

const STATUS_OPTIONS = CONTENT_STATUSES.map((status) => ({
  value: status,
  label: status[0].toUpperCase() + status.slice(1),
}));

export function JournalForm({
  action,
  post,
  categories,
  tags,
  initialTags,
  submitLabel,
}: {
  action: (prev: ActionResult | undefined, formData: FormData) => Promise<ActionResult>;
  post?: JournalPost | null;
  categories: { id: string; name: string }[];
  tags: { id: string; name: string }[];
  initialTags: { id: string; name: string }[];
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  useEffect(() => {
    if (state?.ok) {
      toast.success(post ? "Post saved" : "Post created");
    } else if (state?.formError) {
      toast.error(state.formError);
    }
  }, [state, post]);

  const errors: FieldErrors = state?.ok ? {} : (state?.fieldErrors ?? {});

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {post ? <input type="hidden" name="id" value={post.id} /> : null}

      <Card>
        <CardHeader>
          <CardTitle>Cover image</CardTitle>
          <CardDescription>
            JPEG, PNG, WebP or AVIF, up to 8 MB. Optional — leave empty for no cover.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {post?.cover_image_path ? (
            <Image
              src={getStoragePublicUrl("journal", post.cover_image_path)}
              alt=""
              width={480}
              height={270}
              className="w-full max-w-xl rounded-lg border border-border object-cover"
            />
          ) : null}
          <div className="grid gap-1.5">
            <Label htmlFor="journal-cover">{post?.cover_image_path ? "Replace cover" : "Upload cover"}</Label>
            <input
              id="journal-cover"
              type="file"
              name="cover_image"
              accept="image/jpeg,image/png,image/webp,image/avif"
              className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-muted file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-foreground hover:file:bg-muted/80"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
          <CardDescription>Identity, category and publishing settings.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            errors={errors}
            name="title"
            label="Title"
            defaultValue={post?.title}
            required
          />
          <FormField
            errors={errors}
            name="slug"
            label="Slug"
            defaultValue={post?.slug}
            required
            description="Used in the post URL. Lowercase, hyphens."
          />
          <div className="grid gap-1.5">
            <Label htmlFor="journal-category">Category</Label>
            <select
              id="journal-category"
              name="category_id"
              defaultValue={post?.category_id ?? ""}
              className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"
            >
              <option value="">No category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <p className="text-sm text-muted-foreground">
              Pick an existing category or type a new one below.
            </p>
          </div>
          <div className="grid gap-1.5 self-end">
            <Label htmlFor="journal-new-category">New category</Label>
            <Input
              id="journal-new-category"
              name="new_category"
              placeholder="e.g. Cerita"
              className="h-8"
            />
          </div>
          <FormSelect
            id="journal-status"
            name="status"
            label="Status"
            defaultValue={post?.status ?? "draft"}
            options={STATUS_OPTIONS}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Copy</CardTitle>
          <CardDescription>Editorial content for the journal post.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4">
          <FormField
            errors={errors}
            name="excerpt"
            label="Excerpt"
            defaultValue={post?.excerpt}
            description="Short summary shown in journal listings."
          />
          <FormField
            errors={errors}
            name="body"
            label="Body"
            defaultValue={post?.body}
            multiline
            required
            description="The full article text."
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tags</CardTitle>
          <CardDescription>Topics that describe this post.</CardDescription>
        </CardHeader>
        <CardContent>
          <TagsEditor tags={tags} initial={initialTags} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SEO</CardTitle>
          <CardDescription>Search metadata specific to this post.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4">
          <FormField
            errors={errors}
            name="seo_title"
            label="SEO title"
            defaultValue={post?.seo_title}
          />
          <FormField
            errors={errors}
            name="seo_description"
            label="SEO description"
            defaultValue={post?.seo_description}
            multiline
          />
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
          disabled={pending}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
