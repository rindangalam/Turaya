"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import Image from "next/image";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AutoSlugInput } from "@/components/admin/auto-slug-input";
import { CharCounter } from "@/components/admin/char-counter";
import { DirtyGuard } from "@/components/admin/dirty-guard";
import { FormActions } from "@/components/admin/form-actions";
import { FormField, FormSelect, type FieldErrors } from "@/features/admin/shared/form-field";
import { TagsEditor } from "@/features/admin/journal/tags-editor";
import { CONTENT_STATUSES } from "@/lib/validation/collections";
import { contentStatusLabel } from "@/lib/labels";
import { getStoragePublicUrl } from "@/lib/storage";
import type { ActionResult } from "@/lib/validation/action-result";
import type { JournalPost } from "@/services/journal";

const STATUS_OPTIONS = CONTENT_STATUSES.map((status) => ({
  value: status,
  label: contentStatusLabel(status),
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
      toast.success(post ? "Artikel tersimpan" : "Artikel dibuat");
    } else if (state?.formError) {
      toast.error(state.formError);
    }
  }, [state, post]);

  const errors: FieldErrors = state?.ok ? {} : (state?.fieldErrors ?? {});

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <DirtyGuard />
      {post ? <input type="hidden" name="id" value={post.id} /> : null}

      <Card>
        <CardHeader>
          <CardTitle>Gambar sampul</CardTitle>
          <CardDescription>
            JPEG, PNG, WebP atau AVIF, hingga 8 MB. Opsional — biarkan kosong jika tanpa sampul.
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
            <Label htmlFor="journal-cover">{post?.cover_image_path ? "Ganti sampul" : "Unggah sampul"}</Label>
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
          <CardTitle>Detail</CardTitle>
          <CardDescription>Identitas, kategori, dan pengaturan publikasi.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            errors={errors}
            name="title"
            label="Judul"
            defaultValue={post?.title}
            required
          />
          <AutoSlugInput
            sourceId="field-title"
            id="field-slug"
            name="slug"
            label="Slug"
            defaultValue={post?.slug}
            description="Dipakai pada URL artikel. Huruf kecil, tanpa spasi."
            error={errors.slug?.[0]}
          />
          <div className="grid gap-1.5">
            <Label htmlFor="journal-category">Kategori</Label>
            <select
              id="journal-category"
              name="category_id"
              defaultValue={post?.category_id ?? ""}
              className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"
            >
              <option value="">Tanpa kategori</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <p className="text-sm text-muted-foreground">
              Pilih kategori yang ada atau ketik yang baru di bawah.
            </p>
          </div>
          <div className="grid gap-1.5 self-end">
            <Label htmlFor="journal-new-category">Kategori baru</Label>
            <Input
              id="journal-new-category"
              name="new_category"
              placeholder="mis. Cerita"
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
          <CardTitle>Konten</CardTitle>
          <CardDescription>Konten editorial untuk artikel jurnal.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4">
          <FormField
            errors={errors}
            name="excerpt"
            label="Ringkasan"
            defaultValue={post?.excerpt}
            description="Ringkasan singkat yang tampil di daftar jurnal."
          />
          <FormField
            errors={errors}
            name="body"
            label="Isi"
            defaultValue={post?.body}
            multiline
            required
            description="Teks lengkap artikel."
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tag</CardTitle>
          <CardDescription>Topik yang mendeskripsikan artikel ini.</CardDescription>
        </CardHeader>
        <CardContent>
          <TagsEditor tags={tags} initial={initialTags} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SEO</CardTitle>
          <CardDescription>Metadata pencarian khusus artikel ini.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4">
          <div className="grid gap-1.5">
            <FormField
              errors={errors}
              name="seo_title"
              label="Judul SEO"
              defaultValue={post?.seo_title}
            />
            <CharCounter targetId="field-seo_title" max={60} />
          </div>
          <div className="grid gap-1.5">
            <FormField
              errors={errors}
              name="seo_description"
              label="Deskripsi SEO"
              defaultValue={post?.seo_description}
              multiline
            />
            <CharCounter targetId="field-seo_description" max={160} />
          </div>
        </CardContent>
      </Card>

      <FormActions pending={pending} submitLabel={submitLabel} />
    </form>
  );
}
