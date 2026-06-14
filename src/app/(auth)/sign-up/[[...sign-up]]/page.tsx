import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-8rem)] w-full max-w-7xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <SignUp
        appearance={{
          elements: {
            cardBox: "shadow-soft-xl",
            footerActionLink: "text-primary",
          },
        }}
      />
    </section>
  );
}
