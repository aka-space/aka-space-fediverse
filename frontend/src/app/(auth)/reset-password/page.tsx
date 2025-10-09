import FloatingInput from '@/components/floating-input';
import { Button } from '@/components/ui/button';

const ResetPasswordPage = () => {
    return (
        <form className="flex flex-col gap-4 pt-8 pb-12 w-full max-w-md px-8 bg-card rounded-lg shadow-md">
            <h1 className="text-3xl text-center font-bold mb-2">
                Reset Password
            </h1>
            <span className="text-md text-muted-foreground mb-2">
                Retrieve your account by entering your email below
            </span>
            <FloatingInput label="Password" id="password" type="password" />
            <FloatingInput
                label="Confirm password"
                id="cf-password"
                type="password"
            />
            <label className="text-sm text-destructive cursor-pointer font-semibold">
                Wrong password!
            </label>
            <Button type="submit" variant="default" size="lg">
                Reset password
            </Button>
        </form>
    );
};

export default ResetPasswordPage;
