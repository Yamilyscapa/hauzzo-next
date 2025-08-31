"use client";

import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { createLead } from "@/lib/leads";
import { hasLeadForProperty, markLeadForProperty } from "@/lib/lead-storage";

type LeadModalProps = {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  propertyId: string;
  propertyTitle?: string;
  mode?: "contact" | "visit";
  onSuccess?: () => void;
};

export function LeadModal({ open, onOpenChange, propertyId, propertyTitle, mode = "contact", onSuccess }: LeadModalProps) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [alreadySent, setAlreadySent] = useState<boolean>(false);

  useEffect(() => {
    if (!open) {
      setEmail("");
      setPhone("");
      setError(null);
      setSuccess(null);
      setLoading(false);
      setAlreadySent(false);
    }
  }, [open]);

  useEffect(() => {
    if (!propertyId) return;
    setAlreadySent(hasLeadForProperty(propertyId));
  }, [propertyId, open]);

  async function onSubmit() {
    try {
      if (alreadySent) {
        setError("Ya enviaste una solicitud para esta propiedad.");
        return;
      }
      setError(null);
      setSuccess(null);

      if (!email && !phone) {
        setError("Proporciona al menos email o teléfono.");
        return;
      }

      setLoading(true);
      await createLead({ propertyId, email: email || undefined, phone: phone || undefined });
      setSuccess(
        mode === "visit"
          ? "¡Solicitud enviada! El asesor se pondrá en contacto para agendar tu visita."
          : "¡Gracias! El asesor se pondrá en contacto contigo pronto."
      );
      markLeadForProperty(propertyId);
      setAlreadySent(true);
      onSuccess?.();
    } catch (e: any) {
      setError(e?.message || "No se pudo enviar tu solicitud");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Sheet  open={open} onOpenChange={onOpenChange}>
      <SheetContent side="center" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{mode === "visit" ? "Agendar visita" : "Contactar"}</SheetTitle>
          <SheetDescription>
            {propertyTitle ? `Propiedad: ${propertyTitle}. ` : null}
            Completa tus datos y te contactaremos.
          </SheetDescription>
        </SheetHeader>

        <div className="px-4 pb-4 space-y-3 flex-1 overflow-y-auto">
          {error ? (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          {success ? (
            <Alert>
              <AlertTitle>Listo</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          ) : null}

          {alreadySent && !success ? (
            <Alert>
              <AlertTitle>Ya enviado</AlertTitle>
              <AlertDescription>
                Ya enviaste una solicitud para esta propiedad. Próximamente te contactaremos.
              </AlertDescription>
            </Alert>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={alreadySent}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="(000) 000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={alreadySent}
            />
            <p className="text-xs text-muted-foreground">Proporciona al menos email o teléfono.</p>
          </div>
        </div>

        <SheetFooter>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button onClick={onSubmit} disabled={loading || alreadySent}>
              {alreadySent ? "Ya enviado" : loading ? "Enviando..." : mode === "visit" ? "Agendar" : "Contactar"}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
