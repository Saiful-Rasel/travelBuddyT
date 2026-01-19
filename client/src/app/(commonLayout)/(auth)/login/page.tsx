import LoginForm from "@/components/login-form";

const LoginPage = async ({
  searchParams,
}: {
  searchParams?: Promise<{ redirect?: string }>;
}) => {
  const params = (await searchParams) || {};

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white dark:bg-black px-4">
      <div className="w-full max-w-md space-y-6 rounded-lg border border-gray-200 dark:border-gray-800 p-8 shadow-lg bg-white dark:bg-gray-900">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-black dark:text-white">
            Welcome Back
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Enter your credentials to access your account
          </p>
        </div>

        <LoginForm redirect={params.redirect} />
      </div>
    </div>
  );
};

export default LoginPage;
