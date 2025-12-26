"use client";
import { loginAction } from "@/app/actions/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { toast } from "sonner";
import logo from "../../favicon.png";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, LogIn } from "lucide-react";
import { useToggleState } from "@/hooks/use-toggle-state";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function Page() {
  const t = useTranslations("auth");
  const [error, setError] = useState<string | undefined>(undefined);
  const [isLoading, toggleIsLoading] = useToggleState(false, true);

  const handleSubmit = async (formData: FormData) => {
    toggleIsLoading();
    const res = await loginAction(formData);
    toggleIsLoading();
    if (res.error) {
      toast.error(res.error, { position: "top-right" });
      setError(res.error);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-md max-w-full">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <Image src={logo} alt="Novaluxe Dynamics" className="h-12 w-auto" />
          </div>
          <CardTitle className="text-2xl">{t('login')}</CardTitle>
          <CardDescription>{t('loginDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">{t('email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t('emailPlaceholder')}
                required
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t('password')}</Label>
              <Input
                id="password"
                type="password"
                placeholder={t('passwordPlaceholder')}
                required
                autoComplete="current-password"
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <LogIn className="h-4 w-4 mr-2" />
              )}
              {t('loginButton')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
