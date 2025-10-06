import { SettingsContent } from '@/components/personal/settings-content';

const Page = () => {
    return (
        <>
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">Settings</h1>
                <p className="text-muted-foreground">
                    Manage your application preferences and permissions
                </p>
            </div>
            <SettingsContent />
        </>
    );
};

export default Page;
