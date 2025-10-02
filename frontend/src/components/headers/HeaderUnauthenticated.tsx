import React from 'react';
import { Button } from '../ui/button';

const HeaderUnauthenticated = () => {
    return (
        <div className="flex gap-4">
            <Button variant="default">Register</Button>
            <Button variant="ghost" className="bg-muted">
                Login
            </Button>
        </div>
    );
};

export default HeaderUnauthenticated;
