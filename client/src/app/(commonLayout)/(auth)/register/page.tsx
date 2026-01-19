import RegisterForm from "@/components/register-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const RegisterPage = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 md:p-10
      bg-gray-50 text-gray-900 dark:bg-black dark:text-gray-50 transition-colors duration-300"
    >
      <div className="w-full max-w-xl">
        <Card className="bg-white dark:bg-gray-800 shadow-lg transition-colors duration-300">
          <CardHeader>
            <CardTitle>Create an account</CardTitle>
            <CardDescription>
              Enter your information below to create your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
