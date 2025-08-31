"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { createBroker, getBrokerByEmail, updateBroker, type Broker } from "@/lib/brokers";

export default function BrokersPage() {
  // Create broker form state
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [created, setCreated] = useState<Broker | null>(null);
  const [createForm, setCreateForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });

  // Search + edit state
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [result, setResult] = useState<Broker | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleCreate = async () => {
    setCreateError(null);
    setCreated(null);
    const { firstName, lastName, email, password } = createForm;
    if (!firstName || !lastName || !email || !password) {
      setCreateError("Nombre, apellido, email y contraseña son obligatorios.");
      return;
    }
    setCreating(true);
    try {
      const b = await createBroker({
        firstName: createForm.firstName.trim(),
        lastName: createForm.lastName.trim(),
        email: createForm.email.trim(),
        phone: (createForm.phone || "").trim() || undefined,
        password: createForm.password,
      });
      setCreated(b);
      setCreateForm({ firstName: "", lastName: "", email: "", phone: "", password: "" });
    } catch (e: any) {
      setCreateError(e?.message || "No se pudo crear el broker");
    } finally {
      setCreating(false);
    }
  };

  const handleSearch = async () => {
    setSearchError(null);
    setResult(null);
    const email = query.trim();
    if (!email) {
      setSearchError("Ingresa un correo para buscar.");
      return;
    }
    setSearching(true);
    try {
      const b = await getBrokerByEmail(email);
      if (!b) {
        setSearchError("No se encontró un broker con ese correo.");
      }
      setResult(b);
    } catch (e: any) {
      setSearchError(e?.message || "Error buscando broker");
    } finally {
      setSearching(false);
    }
  };

  const handleSave = async () => {
    if (!result) return;
    setSaveError(null);
    setSaving(true);
    try {
      const updated = await updateBroker(result.id, {
        firstName: (result.firstName || "").trim(),
        lastName: (result.lastName || "").trim(),
        phone: (result.phone || "").toString().trim() || undefined,
        email: result.email.trim(),
      });
      setResult(updated);
    } catch (e: any) {
      setSaveError(e?.message || "No se pudo guardar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Brokers</h1>
          <p className="text-gray-600 mt-2">Crea, busca y edita brokers.</p>
        </div>

        {/* Create broker */}
        <Card>
          <CardHeader>
            <CardTitle>Crear broker</CardTitle>
            <CardDescription>Registra un nuevo broker en el sistema.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {createError && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{createError}</AlertDescription>
              </Alert>
            )}
            {created && (
              <Alert>
                <AlertTitle>Creado</AlertTitle>
                <AlertDescription>
                  Broker {created.firstName} {created.lastName} ({created.email}) creado.
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="firstName">Nombre</Label>
                <Input id="firstName" value={createForm.firstName}
                  onChange={(e) => setCreateForm({ ...createForm, firstName: e.target.value })} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="lastName">Apellido</Label>
                <Input id="lastName" value={createForm.lastName}
                  onChange={(e) => setCreateForm({ ...createForm, lastName: e.target.value })} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={createForm.email}
                  onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="phone">Teléfono (opcional)</Label>
                <Input id="phone" value={createForm.phone}
                  onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })} />
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input id="password" type="password" value={createForm.password}
                  onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                  placeholder="Mínimo 8 caracteres, mayúsculas, minúsculas, número y símbolo" />
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleCreate} disabled={creating}>
                {creating ? "Creando..." : "Crear broker"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Search and edit */}
        <Card>
          <CardHeader>
            <CardTitle>Buscar por email</CardTitle>
            <CardDescription>Encuentra un broker por correo para editar sus datos.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {searchError && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{searchError}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2">
              <Input
                placeholder="correo@ejemplo.com"
                type="email"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <Button onClick={handleSearch} variant="outline" disabled={searching}>
                {searching ? "Buscando..." : "Buscar"}
              </Button>
            </div>

            {result && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="flex flex-col gap-2">
                  <Label>Nombre</Label>
                  <Input
                    value={result.firstName || ""}
                    onChange={(e) => setResult({ ...(result as Broker), firstName: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Apellido</Label>
                  <Input
                    value={result.lastName || ""}
                    onChange={(e) => setResult({ ...(result as Broker), lastName: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={result.email}
                    onChange={(e) => setResult({ ...(result as Broker), email: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Teléfono</Label>
                  <Input
                    value={result.phone || ""}
                    onChange={(e) => setResult({ ...(result as Broker), phone: e.target.value })}
                  />
                </div>
                {saveError && (
                  <div className="md:col-span-2">
                    <Alert variant="destructive">
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{saveError}</AlertDescription>
                    </Alert>
                  </div>
                )}
                <div className="md:col-span-2 flex justify-end">
                  <Button onClick={handleSave} disabled={saving}>
                    {saving ? "Guardando..." : "Guardar cambios"}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
