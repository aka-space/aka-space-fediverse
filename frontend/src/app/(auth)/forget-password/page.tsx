import FloatingInput from '@/components/floating-input';
import { Button } from '@/components/ui/button';

const ForgetPasswordPage = () => {
    return (
        <form className="flex flex-col gap-4 pt-8 pb-12 w-full max-w-md px-8 bg-card rounded-lg shadow-md">
            <h1 className="text-3xl text-center font-bold mb-2">
                Forget Password
            </h1>
            <span className="text-md text-muted-foreground mb-2">
                Retrieve your account by entering your email below
            </span>
            <FloatingInput label="Email" id="username" />
            <FloatingInput label="OTP" id="otp" />
            <div className="flex flex-col gap-1">
                <label className="text-sm text-muted-foreground cursor-pointer font-semibold">
                    Please check your email for the OTP code!
                </label>
            </div>
            <Button type="submit" variant="default" size="lg">
                Send OTP
            </Button>
        </form>
    );
};

export default ForgetPasswordPage;
