export type AdminShellUser = {
  id: string;
  email: string | undefined;
  displayName: string | undefined;
  role: "super_admin" | "admin" | "editor";
};
