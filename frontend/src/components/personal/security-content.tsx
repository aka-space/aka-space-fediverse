'use client';

import { useState } from 'react';
import {
    Key,
    Smartphone,
    Globe,
    Trash2,
    Monitor,
    MapPin,
    Clock,
    ChevronUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

const activeSessions = [
    {
        id: 1,
        device: 'Chrome on MacBook Pro',
        location: 'San Francisco, USA',
        ip: '192.168.1.1',
        lastActive: 'Active now',
        isCurrent: true,
    },
    {
        id: 2,
        device: 'Safari on iPhone 14',
        location: 'San Francisco, USA',
        ip: '192.168.1.2',
        lastActive: '2 hours ago',
        isCurrent: false,
    },
    {
        id: 3,
        device: 'Firefox on Windows',
        location: 'New York, USA',
        ip: '192.168.1.3',
        lastActive: '1 day ago',
        isCurrent: false,
    },
];

const connectedAccounts = [
    { id: 1, provider: 'GitHub', username: '@golanginya', connected: true },
    {
        id: 2,
        provider: 'Google',
        username: 'golanginya@gmail.com',
        connected: true,
    },
    { id: 3, provider: 'Twitter', username: '@golanginya', connected: false },
];

const activityHistory = [
    {
        id: 1,
        action: 'Password changed',
        timestamp: '2024-01-15 14:30',
        ip: '192.168.1.1',
    },
    {
        id: 2,
        action: 'Logged in from new device',
        timestamp: '2024-01-14 09:15',
        ip: '192.168.1.2',
    },
    {
        id: 3,
        action: 'Email address updated',
        timestamp: '2024-01-10 16:45',
        ip: '192.168.1.1',
    },
    {
        id: 4,
        action: 'Two-factor authentication enabled',
        timestamp: '2024-01-05 11:20',
        ip: '192.168.1.1',
    },
];

export function SecurityContent() {
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
    const [expandedSection, setExpandedSection] = useState<string | null>(null);
    const [otpSent, setOtpSent] = useState(false);
    const [forgotPassword, setForgotPassword] = useState(false);

    const toggleSection = (section: string) => {
        setExpandedSection(expandedSection === section ? null : section);
        setOtpSent(false);
        setForgotPassword(false);
    };

    const handleSendOTP = () => {
        setOtpSent(true);
        // Simulate sending OTP
        console.log('[v0] OTP sent');
    };
    return (
        <div className="space-y-6">
            {/* Credentials */}
            <Card>
                <CardHeader>
                    <CardTitle>Login Credentials</CardTitle>
                    <CardDescription>
                        Manage your username, email, and password
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <div className="flex gap-2">
                            <Input
                                id="username"
                                defaultValue="golanginya"
                                className="flex-1"
                                disabled
                            />
                            <Button
                                variant="outline"
                                className="cursor-pointer bg-transparent"
                                onClick={() => toggleSection('username')}
                            >
                                {expandedSection === 'username' ? (
                                    <>
                                        <ChevronUp className="h-4 w-4 mr-2" />
                                        Cancel
                                    </>
                                ) : (
                                    'Change'
                                )}
                            </Button>
                        </div>

                        {expandedSection === 'username' && (
                            <div className="mt-4 p-4 border border-border rounded-lg space-y-4 bg-muted/30">
                                <div className="space-y-2">
                                    <Label htmlFor="new-username">
                                        New Username
                                    </Label>
                                    <Input
                                        id="new-username"
                                        placeholder="Enter new username"
                                    />
                                </div>

                                {!otpSent ? (
                                    <Button
                                        onClick={handleSendOTP}
                                        className="w-full cursor-pointer"
                                    >
                                        Send OTP to Email
                                    </Button>
                                ) : (
                                    <>
                                        <div className="space-y-2">
                                            <Label htmlFor="username-otp">
                                                Verification Code
                                            </Label>
                                            <Input
                                                id="username-otp"
                                                placeholder="Enter 6-digit code"
                                                maxLength={6}
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                Code sent to
                                                golanginya@example.com
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button className="flex-1 cursor-pointer">
                                                Verify & Change
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={handleSendOTP}
                                                className="cursor-pointer bg-transparent"
                                            >
                                                Resend Code
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="primary-email">Primary Email</Label>
                        <div className="flex gap-2">
                            <Input
                                id="primary-email"
                                type="email"
                                defaultValue="golanginya@example.com"
                                className="flex-1"
                                disabled
                            />
                            <Button
                                variant="outline"
                                className="cursor-pointer bg-transparent"
                                onClick={() => toggleSection('email')}
                            >
                                {expandedSection === 'email' ? (
                                    <>
                                        <ChevronUp className="h-4 w-4 mr-2" />
                                        Cancel
                                    </>
                                ) : (
                                    'Change'
                                )}
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            This email is used for account recovery and
                            notifications
                        </p>

                        {expandedSection === 'email' && (
                            <div className="mt-4 p-4 border border-border rounded-lg space-y-4 bg-muted/30">
                                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-md">
                                    <p className="text-sm text-blue-600 dark:text-blue-400">
                                        For security, we&apos;ll send a
                                        verification code to your{' '}
                                        <strong>current email</strong>{' '}
                                        (golanginya@example.com) to confirm
                                        it&apos;s you before changing to a new
                                        email address.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="new-email">
                                        New Email Address
                                    </Label>
                                    <Input
                                        id="new-email"
                                        type="email"
                                        placeholder="Enter new email address"
                                    />
                                </div>

                                {!otpSent ? (
                                    <Button
                                        onClick={handleSendOTP}
                                        className="w-full cursor-pointer"
                                    >
                                        Send Verification Code to Current Email
                                    </Button>
                                ) : (
                                    <>
                                        <div className="space-y-2">
                                            <Label htmlFor="email-otp">
                                                Verification Code
                                            </Label>
                                            <Input
                                                id="email-otp"
                                                placeholder="Enter 6-digit code"
                                                maxLength={6}
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                Verification code sent to your{' '}
                                                <strong>current email</strong>:
                                                golanginya@example.com
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button className="flex-1 cursor-pointer">
                                                Verify & Change Email
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={handleSendOTP}
                                                className="cursor-pointer bg-transparent"
                                            >
                                                Resend Code
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="flex gap-2">
                            <Input
                                id="password"
                                type="password"
                                value="••••••••••"
                                disabled
                                className="flex-1"
                            />
                            <Button
                                variant="outline"
                                className="cursor-pointer bg-transparent"
                                onClick={() => toggleSection('password')}
                            >
                                {expandedSection === 'password' ? (
                                    <>
                                        <ChevronUp className="h-4 w-4 mr-2" />
                                        Cancel
                                    </>
                                ) : (
                                    <>
                                        <Key className="h-4 w-4 mr-2" />
                                        Change
                                    </>
                                )}
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Last changed 30 days ago
                        </p>

                        {expandedSection === 'password' && (
                            <div className="mt-4 p-4 border border-border rounded-lg space-y-4 bg-muted/30">
                                {!forgotPassword ? (
                                    <>
                                        <div className="space-y-2">
                                            <Label htmlFor="current-password">
                                                Current Password
                                            </Label>
                                            <Input
                                                id="current-password"
                                                type="password"
                                                placeholder="Enter current password"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="new-password">
                                                New Password
                                            </Label>
                                            <Input
                                                id="new-password"
                                                type="password"
                                                placeholder="Enter new password"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="confirm-password">
                                                Confirm New Password
                                            </Label>
                                            <Input
                                                id="confirm-password"
                                                type="password"
                                                placeholder="Confirm new password"
                                            />
                                        </div>
                                        <Button className="w-full cursor-pointer">
                                            Change Password
                                        </Button>
                                        <Button
                                            variant="link"
                                            className="w-full cursor-pointer text-sm"
                                            onClick={() =>
                                                setForgotPassword(true)
                                            }
                                        >
                                            Forgot your password?
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <div className="space-y-2">
                                            <p className="text-sm text-muted-foreground">
                                                We&apos;ll send a verification
                                                code to your email to reset your
                                                password
                                            </p>
                                        </div>

                                        {!otpSent ? (
                                            <>
                                                <Button
                                                    onClick={handleSendOTP}
                                                    className="w-full cursor-pointer"
                                                >
                                                    Send OTP to Email
                                                </Button>
                                                <Button
                                                    variant="link"
                                                    className="w-full cursor-pointer text-sm"
                                                    onClick={() =>
                                                        setForgotPassword(false)
                                                    }
                                                >
                                                    Back to password change
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <div className="space-y-2">
                                                    <Label htmlFor="password-otp">
                                                        Verification Code
                                                    </Label>
                                                    <Input
                                                        id="password-otp"
                                                        placeholder="Enter 6-digit code"
                                                        maxLength={6}
                                                    />
                                                    <p className="text-xs text-muted-foreground">
                                                        Code sent to
                                                        golanginya@example.com
                                                    </p>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="new-password-forgot">
                                                        New Password
                                                    </Label>
                                                    <Input
                                                        id="new-password-forgot"
                                                        type="password"
                                                        placeholder="Enter new password"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="confirm-password-forgot">
                                                        Confirm New Password
                                                    </Label>
                                                    <Input
                                                        id="confirm-password-forgot"
                                                        type="password"
                                                        placeholder="Confirm new password"
                                                    />
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button className="flex-1 cursor-pointer">
                                                        Reset Password
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        onClick={handleSendOTP}
                                                        className="cursor-pointer bg-transparent"
                                                    >
                                                        Resend Code
                                                    </Button>
                                                </div>
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Two-Factor Authentication */}
            <Card>
                <CardHeader>
                    <CardTitle>Two-Factor Authentication</CardTitle>
                    <CardDescription>
                        Add an extra layer of security to your account
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Smartphone className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="font-medium">Authenticator App</p>
                                <p className="text-sm text-muted-foreground">
                                    Use an app to generate verification codes
                                </p>
                            </div>
                        </div>
                        <Switch
                            checked={twoFactorEnabled}
                            onCheckedChange={setTwoFactorEnabled}
                        />
                    </div>
                    {twoFactorEnabled && (
                        <div className="pl-8 pt-2">
                            <Badge
                                variant="secondary"
                                className="bg-green-500/10 text-green-600 dark:text-green-400"
                            >
                                Enabled
                            </Badge>
                            <p className="text-sm text-muted-foreground mt-2">
                                Configured on Jan 5, 2024
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Active Sessions */}
            <Card>
                <CardHeader>
                    <CardTitle>Active Sessions</CardTitle>
                    <CardDescription>
                        Manage devices where you&apos;re currently logged in
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {activeSessions.map((session) => (
                        <div
                            key={session.id}
                            className="flex items-start justify-between p-4 border border-border rounded-lg"
                        >
                            <div className="flex gap-3">
                                <Monitor className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <p className="font-medium">
                                            {session.device}
                                        </p>
                                        {session.isCurrent && (
                                            <Badge
                                                variant="secondary"
                                                className="bg-blue-500/10 text-blue-600 dark:text-blue-400"
                                            >
                                                Current
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <MapPin className="h-3 w-3" />
                                            {session.location}
                                        </span>
                                        <span>{session.ip}</span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {session.lastActive}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            {!session.isCurrent && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-destructive hover:text-destructive cursor-pointer"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    ))}
                    <Button
                        variant="outline"
                        className="w-full cursor-pointer bg-transparent"
                    >
                        Revoke All Other Sessions
                    </Button>
                </CardContent>
            </Card>

            {/* Connected Accounts */}
            <Card>
                <CardHeader>
                    <CardTitle>Connected Accounts</CardTitle>
                    <CardDescription>
                        Manage third-party account connections
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {connectedAccounts.map((account) => (
                        <div
                            key={account.id}
                            className="flex items-center justify-between p-4 border border-border rounded-lg"
                        >
                            <div className="flex items-center gap-3">
                                <Globe className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="font-medium">
                                        {account.provider}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {account.username}
                                    </p>
                                </div>
                            </div>
                            {account.connected ? (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="cursor-pointer bg-transparent"
                                >
                                    Disconnect
                                </Button>
                            ) : (
                                <Button size="sm" className="cursor-pointer">
                                    Connect
                                </Button>
                            )}
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Activity History */}
            <Card>
                <CardHeader>
                    <CardTitle>Activity History</CardTitle>
                    <CardDescription>
                        Recent security-related activities on your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {activityHistory.map((activity) => (
                            <div
                                key={activity.id}
                                className="flex items-start gap-3 p-3 border-l-2 border-border pl-4"
                            >
                                <div className="flex-1">
                                    <p className="font-medium">
                                        {activity.action}
                                    </p>
                                    <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                                        <span>{activity.timestamp}</span>
                                        <span>IP: {activity.ip}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Button
                        variant="outline"
                        className="w-full mt-4 cursor-pointer bg-transparent"
                    >
                        View Full History
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
