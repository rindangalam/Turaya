"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowDownIcon, ArrowUpIcon, ImagePlusIcon, RotateCcwIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getStoragePublicUrl } from "@/lib/storage";
import type { ProductImage } from "@/services/products";
import { cn } from "@/lib/utils";

const MAX_NEW_IMAGES = 5;

type ExistingImage = { id: string; path: string; alt: string; caption: string };
type PendingImage = { file: File; url: string };

/**
 * Editable product image list: reorder existing uploads, mark images for
 * removal, and pick new files with live previews. Selected files stay on
 * the native input (via DataTransfer) so the server action receives them
 * through the normal form submission.
 */
export function ProductImagesEditor({ images }: { images: ProductImage[] }) {
  const [existing, setExisting] = useState<ExistingImage[]>(() =>
    images.map((image) => ({
      id: image.id,
      path: image.path,
      alt: image.alt,
      caption: image.caption ?? "",
    })),
  );
  const [removed, setRemoved] = useState<Set<string>>(() => new Set());
  const [pending, setPending] = useState<PendingImage[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const pendingRef = useRef<PendingImage[]>(pending);

  useEffect(() => {
    pendingRef.current = pending;
  }, [pending]);

  useEffect(() => {
    return () => {
      for (const entry of pendingRef.current) URL.revokeObjectURL(entry.url);
    };
  }, []);

  const syncInputFiles = (entries: PendingImage[]) => {
    const input = inputRef.current;
    if (!input) return;
    const transfer = new DataTransfer();
    for (const entry of entries) transfer.items.add(entry.file);
    input.files = transfer.files;
  };

  const addFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setPending((prev) => {
      const merged = [...prev];
      for (const file of Array.from(files)) {
        if (merged.length >= MAX_NEW_IMAGES) break;
        merged.push({ file, url: URL.createObjectURL(file) });
      }
      syncInputFiles(merged);
      return merged;
    });
  };

  const removePending = (index: number) => {
    setPending((prev) => {
      const next = prev.filter((_, i) => i !== index);
      URL.revokeObjectURL(prev[index].url);
      syncInputFiles(next);
      return next;
    });
  };

  const moveExisting = (index: number, direction: -1 | 1) => {
    setExisting((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const toggleRemoved = (id: string) => {
    setRemoved((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {existing.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {existing.map((image, index) => {
            const isRemoved = removed.has(image.id);
            return (
              <li
                key={image.id}
                className={cn(
                  "flex flex-col gap-3 rounded-lg border border-border p-3 sm:flex-row",
                  isRemoved && "opacity-50",
                )}
              >
                <div className="relative shrink-0">
                  <Image
                    src={getStoragePublicUrl("products", image.path)}
                    alt={image.alt}
                    width={64}
                    height={64}
                    className="h-16 w-16 rounded-md object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => toggleRemoved(image.id)}
                    aria-label={isRemoved ? "Batalkan hapus gambar" : "Tandai gambar untuk dihapus"}
                    className={cn(
                      "absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full border border-border bg-background shadow-sm transition-colors",
                      isRemoved ? "text-muted-foreground" : "text-destructive hover:bg-destructive/10",
                    )}
                  >
                    {isRemoved ? (
                      <RotateCcwIcon className="size-3" aria-hidden="true" />
                    ) : (
                      <XIcon className="size-3" aria-hidden="true" />
                    )}
                  </button>
                </div>

                <div className="grid min-w-0 flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
                  <input type="hidden" name={`existing_image_id_${index}`} value={image.id} />
                  <input type="hidden" name={`existing_image_path_${index}`} value={image.path} />
                  <input type="hidden" name={`remove_${index}`} value={isRemoved ? "on" : "off"} />
                  <div className="grid gap-1.5">
                    <Label htmlFor={`image-alt-${image.id}`}>Teks alternatif</Label>
                    <Input
                      id={`image-alt-${image.id}`}
                      name={`alt_${index}`}
                      defaultValue={image.alt}
                      disabled={isRemoved}
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor={`image-caption-${image.id}`}>Keterangan</Label>
                    <Input
                      id={`image-caption-${image.id}`}
                      name={`caption_${index}`}
                      defaultValue={image.caption}
                      disabled={isRemoved}
                    />
                  </div>
                </div>

                <div className="flex shrink-0 flex-row items-center gap-0.5 sm:flex-col">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => moveExisting(index, -1)}
                    disabled={index === 0}
                    aria-label={`Naikkan gambar ${index + 1}`}
                  >
                    <ArrowUpIcon className="size-3.5" aria-hidden="true" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => moveExisting(index, 1)}
                    disabled={index === existing.length - 1}
                    aria-label={`Turunkan gambar ${index + 1}`}
                  >
                    <ArrowDownIcon className="size-3.5" aria-hidden="true" />
                  </Button>
                </div>
              </li>
            );
          })}
          <input type="hidden" name="existing_count" value={existing.length} />
          <input
            type="hidden"
            name="existing_image_order"
            value={existing.map((image) => image.id).join(",")}
          />
        </ul>
      ) : null}

      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragOver(false);
          addFiles(event.dataTransfer.files);
        }}
        className={cn(
          "flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed px-4 py-6 text-center transition-colors",
          dragOver ? "border-ring bg-muted/60" : "border-border",
        )}
      >
        <ImagePlusIcon className="size-5 text-muted-foreground" aria-hidden="true" />
        <p className="text-sm text-muted-foreground">
          Tarik dan lepas gambar ke sini, atau
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
        >
          Pilih gambar
        </Button>
        <input
          ref={inputRef}
          id="product-new-images"
          type="file"
          name="new_images"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="sr-only"
          onChange={(event) => addFiles(event.target.files)}
        />
        <p className="text-xs text-muted-foreground">
          JPEG, PNG, atau WebP, hingga 5 MB per berkas, maksimal {MAX_NEW_IMAGES} gambar.
        </p>
      </div>

      {pending.length > 0 ? (
        <ul className="flex flex-wrap gap-2">
          {pending.map((entry, index) => (
            <li key={entry.url} className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={entry.url}
                alt={entry.file.name}
                className="size-16 rounded-md border border-border object-cover"
              />
              <button
                type="button"
                onClick={() => removePending(index)}
                aria-label={`Batal pilih ${entry.file.name}`}
                className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full border border-border bg-background text-destructive shadow-sm hover:bg-destructive/10"
              >
                <XIcon className="size-3" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
