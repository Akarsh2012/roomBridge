"use client";
import AuthAnimated from "../components/AuthAnimated/AuthAnimated";
import PageTransition from "@/components/common/PageTransition";

export default function SignInPage() {
  return (
    <PageTransition>
      <AuthAnimated initialMode="login" />
    </PageTransition>
  );
}
