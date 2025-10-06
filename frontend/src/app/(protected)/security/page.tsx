import { SecurityContent } from '@/components/personal/security-content';
import React from 'react';

const Page = () => {
    return (
        <>
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">Security</h1>
                <p className="text-muted-foreground">
                    Manage your account security and authentication
                </p>
            </div>
            <SecurityContent />
        </>
    );
};

export default Page;
