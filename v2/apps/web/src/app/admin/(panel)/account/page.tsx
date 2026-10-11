"use client";

import { useState } from "react";
import { roleLabels } from "@/components/admin/nav";
import { useSession } from "@/components/admin/shell";
import { useToast } from "@/components/admin/toast";
import { Button, Card, Field, FormError, Input, PageHeader } from "@/components/admin/ui";
import { api, type SessionUser } from "@/lib/admin-api";

export default function AccountPage() {
  const { user, setUser } = useSession();
  const toast = useToast();
  const [name, setName] = useState(user.name);
  const [savingName, setSavingName] = useState(false);
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "", confirm: "" });
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  async function saveName(event: React.FormEvent) {
    event.preventDefault();
    setSavingName(true);
    try {
      const updated = await api<SessionUser>("/auth/me", { method: "PATCH", json: { name } });
      setUser({ ...user, ...updated });
      toast("Profile saved");
    } catch (saveError) {
      toast((saveError as Error).message, "error");
    } finally {
      setSavingName(false);
    }
  }

  async function changePassword(event: React.FormEvent) {
    event.preventDefault();
    if (passwords.newPassword !== passwords.confirm) return setPasswordError("The new passwords don’t match.");
    setSavingPassword(true);
    setPasswordError(null);
    try {
      await api("/auth/change-password", {
        method: "POST",
        json: { currentPassword: passwords.currentPassword, newPassword: passwords.newPassword },
      });
      setPasswords({ currentPassword: "", newPassword: "", confirm: "" });
      toast("Password changed");
    } catch (saveError) {
      setPasswordError((saveError as Error).message);
    } finally {
      setSavingPassword(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader title="Your account" description={`${user.email} · ${roleLabels[user.role]}`} />

      <Card>
        <form onSubmit={saveName}>
          <div className="space-y-5 p-5 sm:p-6">
            <h2 className="font-semibold text-navy">Profile</h2>
            <Field label="Full name">
              <Input value={name} onChange={(e) => setName(e.target.value)} required minLength={2} maxLength={120} />
            </Field>
          </div>
          <div className="flex justify-end border-t border-line px-5 py-3 sm:px-6">
            <Button type="submit" busy={savingName} disabled={name.trim() === user.name}>
              Save
            </Button>
          </div>
        </form>
      </Card>

      <Card>
        <form onSubmit={changePassword}>
          <div className="space-y-5 p-5 sm:p-6">
            <h2 className="font-semibold text-navy">Change password</h2>
            <Field label="Current password">
              <Input
                type="password"
                value={passwords.currentPassword}
                onChange={(e) => setPasswords((v) => ({ ...v, currentPassword: e.target.value }))}
                required
                autoComplete="current-password"
              />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="New password" hint="At least 10 characters.">
                <Input
                  type="password"
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords((v) => ({ ...v, newPassword: e.target.value }))}
                  required
                  minLength={10}
                  maxLength={200}
                  autoComplete="new-password"
                />
              </Field>
              <Field label="Confirm new password">
                <Input
                  type="password"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords((v) => ({ ...v, confirm: e.target.value }))}
                  required
                  minLength={10}
                  maxLength={200}
                  autoComplete="new-password"
                />
              </Field>
            </div>
            <FormError message={passwordError} />
          </div>
          <div className="flex justify-end border-t border-line px-5 py-3 sm:px-6">
            <Button type="submit" busy={savingPassword}>
              Change password
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
