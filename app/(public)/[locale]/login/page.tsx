"use client";

import Image from "next/image";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AlertCircleIcon, Loader2, LogIn } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { loginAction } from "@/app/actions/auth";
import { useToggleState } from "@/hooks/use-toggle-state";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import GoogleOneTap from "@/components/google-one-tap";

import logo from "../../../favicon.png";

import { signInWithEmail } from "./actions";

export default function Page() {
  const t = useTranslations("auth");
  const [error, setError] = useState<string | undefined>(undefined);
  const [isLoading, toggleIsLoading] = useToggleState(false, true);

  const handleSubmit = async (formData: FormData) => {
    toggleIsLoading();
    const res = await loginAction(formData);
    toggleIsLoading();
    if (res?.error) {
      toast.error(res.error, { position: "top-right" });
      setError(res.error);
    }
  };

  const handleMagicLogin = async () => {
    await signInWithEmail();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-md max-w-full">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <Image alt="Novaluxe Dynamics" className="h-12 w-auto" src={logo} />
          </div>
          <CardTitle className="text-2xl">{t("login")}</CardTitle>
          <CardDescription>{t("loginDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form action={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircleIcon />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">{t("email")}</Label>
              <Input
                required
                autoComplete="email"
                id="email"
                name="email"
                placeholder={t("emailPlaceholder")}
                type="email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t("password")}</Label>
              <Input
                required
                autoComplete="current-password"
                id="password"
                name="password"
                placeholder={t("passwordPlaceholder")}
                type="password"
              />
            </div>

            <Button className="w-full" disabled={isLoading} type="submit">
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <LogIn className="h-4 w-4 mr-2" />
              )}
              {t("loginButton")}
            </Button>
          </form>
          {/* <GoogleOneTap />
          <Button className="w-full" onClick={handleMagicLogin}>Magic Link Login</Button> */}
        </CardContent>
      </Card>
    </div>
  );
}
