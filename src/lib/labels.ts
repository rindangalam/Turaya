/**
 * Canonical Indonesian labels for shared admin vocabulary. Kept in one place
 * so badges, filter tabs and toasts never drift apart.
 */

export const CONTENT_STATUS_LABELS: Record<string, string> = {
  published: "Terbit",
  draft: "Draf",
  archived: "Arsip",
};

export const MESSAGE_STATUS_LABELS: Record<string, string> = {
  new: "Baru",
  read: "Dibaca",
  replied: "Dibalas",
  archived: "Diarsipkan",
};

export const ROLE_LABELS: Record<string, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  editor: "Editor",
};

export function contentStatusLabel(status: string): string {
  return CONTENT_STATUS_LABELS[status] ?? status;
}

export function messageStatusLabel(status: string): string {
  return MESSAGE_STATUS_LABELS[status] ?? status;
}

export function roleLabel(role: string): string {
  return ROLE_LABELS[role] ?? role;
}
