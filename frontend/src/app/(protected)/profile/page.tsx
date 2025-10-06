import { ProfileForm } from '@/components/profile/profile-form';
import React from 'react';

const Page = () => {
    return (
        <>
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">Profile</h1>
                <p className="text-muted-foreground">
                    Manage your public profile information
                </p>
            </div>
            <ProfileForm />
        </>
    );
};

export default Page;
