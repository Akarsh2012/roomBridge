"use client";
import AuthAnimated from "../components/AuthAnimated/AuthAnimated";
import PageTransition from "@/components/common/PageTransition";

export default function SignUpPage() {
  return (
    <PageTransition>
      <AuthAnimated initialMode="register" />
    </PageTransition>
  );
}
