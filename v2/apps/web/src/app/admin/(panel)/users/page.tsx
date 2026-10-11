"use client";

import { Pencil, Plus, ShieldCheck, Trash2 } from "lucide-react";
import { useState } from "react";
import { roleLabels } from "@/components/admin/nav";
import { useSession } from "@/components/admin/shell";
import { useToast } from "@/components/admin/toast";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorState,
  Field,
  FormActions,
  FormError,
  Input,
  LoadingState,
  Modal,
  PageHeader,
  Select,
  Toggle,
} from "@/components/admin/ui";
import { api, useResource, type StaffRole } from "@/lib/admin-api";
import type { StaffUser } from "@/lib/admin-types";
import { formatDateTime } from "@/lib/format";

const roleDescriptions: Record<StaffRole, string> = {
  ADMIN: "Everything, including settings and staff accounts",
  EDITOR: "Messages, services, gallery, clients and partners",
};

export default function UsersPage() {
  const { user: me } = useSession();
  const toast = useToast();
  const { data, error, reload } = useResource<StaffUser[]>("/users");
  const [editing, setEditing] = useState<StaffUser | "new" | null>(null);

  async function remove(user: StaffUser) {
    if (!window.confirm(`Delete ${user.name}’s account? Deactivating keeps their history instead.`)) return;
    try {
      await api(`/users/${user.id}`, { method: "DELETE" });
      toast("Account deleted");
      reload();
    } catch (deleteError) {
      toast((deleteError as Error).message, "error");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Staff accounts"
        description="People who can sign in to this portal, and what they can manage."
        actions={
          <Button onClick={() => setEditing("new")}>
            <Plus className="size-4" aria-hidden />
            Add staff
          </Button>
        }
      />
      {error ? <ErrorState message={error} onRetry={reload} /> : null}
      <Card>
        {!data && !error ? <LoadingState /> : null}
        {data && !data.length ? <EmptyState icon={ShieldCheck} title="No accounts" /> : null}
        {data?.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[40rem] text-left text-[15px]">
              <thead className="border-b border-line text-xs uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">Role</th>
                  <th className="px-5 py-3 font-medium">Last sign-in</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {data.map((user) => (
                  <tr key={user.id} className={user.active ? "" : "text-muted"}>
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-navy">
                        {user.name}
                        {user.id === me.id ? <span className="ml-2 text-sm font-normal text-muted">(you)</span> : null}
                      </p>
                      <p className="text-sm text-muted">{user.email}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="flex flex-wrap gap-1.5">
                        <Badge tone={user.role === "ADMIN" ? "navy" : "blue"}>{roleLabels[user.role]}</Badge>
                        {!user.active ? <Badge tone="red">Deactivated</Badge> : null}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-muted">{user.lastLoginAt ? formatDateTime(user.lastLoginAt) : "Never"}</td>
                    <td className="px-5 py-3.5">
                      <span className="flex justify-end">
                        <Button variant="ghost" size="sm" onClick={() => setEditing(user)} aria-label={`Edit ${user.name}`}>
                          <Pencil className="size-4" />
                        </Button>
                        {user.id !== me.id ? (
                          <Button variant="ghost" size="sm" onClick={() => remove(user)} aria-label={`Delete ${user.name}`}>
                            <Trash2 className="size-4" />
                          </Button>
                        ) : null}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </Card>

      <Modal open={editing !== null} title={editing === "new" ? "Add staff account" : "Edit staff account"} onClose={() => setEditing(null)}>
        {editing !== null ? (
          <UserForm
            user={editing === "new" ? undefined : editing}
            isSelf={editing !== "new" && editing.id === me.id}
            onCancel={() => setEditing(null)}
            onDone={() => {
              setEditing(null);
              reload();
            }}
          />
        ) : null}
      </Modal>
    </div>
  );
}

function UserForm({
  user,
  isSelf,
  onDone,
  onCancel,
}: {
  user?: StaffUser;
  isSelf: boolean;
  onDone: () => void;
  onCancel: () => void;
}) {
  const toast = useToast();
  const [values, setValues] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    role: user?.role ?? ("EDITOR" as StaffRole),
    active: user?.active ?? true,
    password: "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const { name, email, role, active, password } = values;
      await api(user ? `/users/${user.id}` : "/users", {
        method: user ? "PATCH" : "POST",
        json: user ? { name, role, active, ...(password ? { password } : {}) } : { name, email, role, password },
      });
      toast(user ? "Account updated" : "Account created. Share the password with them securely.");
      onDone();
    } catch (saveError) {
      setError((saveError as Error).message);
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <Field label="Full name">
        <Input value={values.name} onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))} required minLength={2} maxLength={120} />
      </Field>
      <Field label="Email">
        <Input
          type="email"
          value={values.email}
          onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
          required
          disabled={Boolean(user)}
        />
      </Field>
      <Field label="Role" hint={roleDescriptions[values.role]}>
        <Select value={values.role} onChange={(e) => setValues((v) => ({ ...v, role: e.target.value as StaffRole }))} disabled={isSelf}>
          {(Object.keys(roleLabels) as StaffRole[]).map((role) => (
            <option key={role} value={role}>
              {roleLabels[role]}
            </option>
          ))}
        </Select>
      </Field>
      <Field
        label={user ? "New password" : "Temporary password"}
        hint={user ? "Leave empty to keep the current password. At least 10 characters." : "At least 10 characters. They can change it after signing in."}
      >
        <Input
          type="text"
          value={values.password}
          onChange={(e) => setValues((v) => ({ ...v, password: e.target.value }))}
          required={!user}
          minLength={10}
          maxLength={200}
          autoComplete="new-password"
        />
      </Field>
      {user && !isSelf ? (
        <Toggle
          checked={values.active}
          onChange={(active) => setValues((v) => ({ ...v, active }))}
          label="Active"
          description="Deactivated staff are signed out and cannot sign in."
        />
      ) : null}
      <FormError message={error} />
      <FormActions>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" busy={busy}>
          {user ? "Save" : "Create account"}
        </Button>
      </FormActions>
    </form>
  );
}
