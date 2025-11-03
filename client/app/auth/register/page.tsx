import dynamic from "next/dynamic";
const AuthForm = dynamic(() => import("../components/AuthForm"), { ssr: false });

export default function RegisterPage() {
  return (
    <div className="py-8">
      <AuthForm mode="register" />
    </div>
  );
}
