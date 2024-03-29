import LogInForm from "@/components/client/Login/LoginForm";
import LoginModal from "@/components/client/Login/LoginModal";

export default async function Page() {
  return (
    <LoginModal>
      <LogInForm />
    </LoginModal>
  );
}
