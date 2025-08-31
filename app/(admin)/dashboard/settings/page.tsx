"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useSessionStore } from "@/store/session-store";
import { updateBroker } from "@/lib/brokers";

export default function SettingsPage() {
  const { user, setUser } = useSessionStore();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  // Change password state
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSaved, setPwSaved] = useState(false);

  const userId = useMemo(() => (user as any)?.id as string | undefined, [user]);

  useEffect(() => {
    if (!user) return;
    const u: any = user;
    setForm({
      firstName: u.firstName ?? u.first_name ?? "",
      lastName: u.lastName ?? u.last_name ?? "",
      email: u.email ?? "",
      phone: u.phone ?? "",
    });
  }, [user]);

  const onSave = async () => {
    if (!userId) return;
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      const updated = await updateBroker(userId, {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
      });
      // Update session store with the new shape (it can be snake_case on next /me, keep fields we know here)
      setUser({
        ...(user as any),
        id: updated.id,
        email: updated.email,
        role: updated.role || (user as any)?.role || "broker",
        name: `${updated.firstName ?? ""} ${updated.lastName ?? ""}`.trim(),
        firstName: updated.firstName,
        lastName: updated.lastName,
        phone: updated.phone ?? null,
      } as any);
      setSaved(true);
    } catch (e: any) {
      setError(e?.message || "No se pudieron guardar los cambios");
    } finally {
      setSaving(false);
    }
  };

  const strongPw = (pwd: string) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(pwd);

  const onChangePassword = async () => {
    if (!userId) return;
    setPwSaved(false);
    setPwError(null);

    const current = pwForm.current.trim();
    const next = pwForm.next.trim();
    const confirm = pwForm.confirm.trim();

    if (!current || !next || !confirm) {
      setPwError("Completa todos los campos de contraseña.");
      return;
    }
    if (next !== confirm) {
      setPwError("La nueva contraseña y la confirmación no coinciden.");
      return;
    }
    if (!strongPw(next)) {
      setPwError(
        "La contraseña debe tener mínimo 8 caracteres, mayúscula, minúscula, número y símbolo."
      );
      return;
    }

    setPwSaving(true);
    try {
      await updateBroker(userId, { password: next });
      setPwSaved(true);
      setPwForm({ current: "", next: "", confirm: "" });
    } catch (e: any) {
      setPwError(e?.message || "No se pudo cambiar la contraseña");
    } finally {
      setPwSaving(false);
    }
  };

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
          <p className="text-gray-600 mt-2">Actualiza los detalles de tu cuenta.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Perfil</CardTitle>
            <CardDescription>Información básica del broker</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {saved && (
              <Alert>
                <AlertTitle>Guardado</AlertTitle>
                <AlertDescription>Los cambios se han guardado correctamente.</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="firstName">Nombre</Label>
                <Input id="firstName" value={form.firstName}
                  onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="lastName">Apellido</Label>
                <Input id="lastName" value={form.lastName}
                  onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input id="phone" value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={onSave} disabled={!userId || saving}>
                {saving ? "Guardando..." : "Guardar"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Change password */}
        <Card>
          <CardHeader>
            <CardTitle>Cambiar contraseña</CardTitle>
            <CardDescription>
              Actualiza tu contraseña. Debe incluir mayúscula, minúscula, número y símbolo.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {pwError && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{pwError}</AlertDescription>
              </Alert>
            )}
            {pwSaved && (
              <Alert>
                <AlertTitle>Contraseña actualizada</AlertTitle>
                <AlertDescription>
                  Tu contraseña se cambió correctamente.
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="currentPassword">Contraseña actual</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  autoComplete="current-password"
                  value={pwForm.current}
                  onChange={(e) => setPwForm((f) => ({ ...f, current: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="newPassword">Nueva contraseña</Label>
                <Input
                  id="newPassword"
                  type="password"
                  autoComplete="new-password"
                  value={pwForm.next}
                  onChange={(e) => setPwForm((f) => ({ ...f, next: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <Label htmlFor="confirmPassword">Confirmar nueva contraseña</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  value={pwForm.confirm}
                  onChange={(e) => setPwForm((f) => ({ ...f, confirm: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={onChangePassword} disabled={!userId || pwSaving}>
                {pwSaving ? "Cambiando..." : "Cambiar contraseña"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
