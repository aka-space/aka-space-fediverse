import { LoginForm } from '@/components/login-form';

export default function Page() {
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gray-200">
            <div className=" hidden md:block absolute left-8 top-1/4">
                <img
                    src="/images/image_7.png"
                    alt=""
                    className="w-48 h-48 lg:w-64 lg:h-64 object-contain"
                />
            </div>

            <div className="w-full max-w-sm">
                <LoginForm />
            </div>

            <div className="hidden md:block absolute right-8 bottom-1/4">
                <img
                    src="/images/image_6.png"
                    alt=""
                    className="w-48 h-48 lg:w-64 lg:h-64 object-contain"
                />
            </div>
        </div>
    );
}
