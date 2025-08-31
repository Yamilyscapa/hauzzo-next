"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const { login, check, isAuthenticated, error } = useAuth();
  const showUnauthorized = (error || "").toLowerCase().includes("unauthorized");
  const [validationError, setValidationError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear validation error as user types
    if (validationError) setValidationError(null);
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const email = formData.email?.trim();
    const password = formData.password?.trim();

    if (!email || !password) {
      setValidationError("Se requieren correo electrónico y contraseña.");
      return;
    }

    await login(email, password);
  };

  useEffect(() => {
    const verify = async () => {
      const ok = await check();
      if (ok) {
        router.push("/dashboard");
      } else {
        alert("Error al iniciar sesión");
      }
    };
    // Only check if not already authenticated
    if (!isAuthenticated) verify();
  }, [check, isAuthenticated, router]);

  return (
    <Card className="w-full max-w-md mx-auto mt-36">
      <CardHeader>
        <CardTitle>Iniciar sesión</CardTitle>
        <CardDescription>Inicia sesión para continuar</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {validationError && (
          <Alert variant="destructive">
            <AlertTitle>Faltan credenciales</AlertTitle>
            <AlertDescription>
              {validationError}
            </AlertDescription>
          </Alert>
        )}
        {showUnauthorized && (
          <Alert variant="destructive">
            <AlertTitle>Error de autenticación</AlertTitle>
            <AlertDescription>
              Credenciales inválidas. Verifica tu correo electrónico o contraseña.
            </AlertDescription>
          </Alert>
        )}
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            required
            value={formData.email}
            onChange={(e) => handleChange(e)}
            autoComplete="email"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Contraseña"
            required
            value={formData.password}
            onChange={(e) => handleChange(e)}
            autoComplete="current-password"
          />
        </div>

        <Button
          onClick={(e) => handleSubmit(e)}
          size="lg"
          className="w-full mt-2"
        >
          Iniciar sesión
        </Button>
      </CardContent>
    </Card>
  );
}
