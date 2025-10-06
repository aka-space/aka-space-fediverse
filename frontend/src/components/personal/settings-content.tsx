'use client';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Bell, Globe, Moon } from 'lucide-react';

export function SettingsContent() {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        Notifications
                    </CardTitle>
                    <CardDescription>
                        Configure how and when you receive notifications
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Email Notifications</Label>
                            <p className="text-sm text-muted-foreground">
                                Receive notifications via email
                            </p>
                        </div>
                        <Switch defaultChecked className="cursor-pointer" />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Push Notifications</Label>
                            <p className="text-sm text-muted-foreground">
                                Receive push notifications in browser
                            </p>
                        </div>
                        <Switch defaultChecked className="cursor-pointer" />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Comment Replies</Label>
                            <p className="text-sm text-muted-foreground">
                                Get notified when someone replies to your
                                comment
                            </p>
                        </div>
                        <Switch defaultChecked className="cursor-pointer" />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Post Mentions</Label>
                            <p className="text-sm text-muted-foreground">
                                Get notified when someone mentions you
                            </p>
                        </div>
                        <Switch defaultChecked className="cursor-pointer" />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>New Followers</Label>
                            <p className="text-sm text-muted-foreground">
                                Get notified when someone follows you
                            </p>
                        </div>
                        <Switch defaultChecked className="cursor-pointer" />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Weekly Digest</Label>
                            <p className="text-sm text-muted-foreground">
                                Receive a weekly summary of activity
                            </p>
                        </div>
                        <Switch className="cursor-pointer" />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Sound Effects</Label>
                            <p className="text-sm text-muted-foreground">
                                Play sounds for notifications
                            </p>
                        </div>
                        <Switch className="cursor-pointer" />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Moon className="h-5 w-5" />
                        Theme & Appearance
                    </CardTitle>
                    <CardDescription>
                        Customize how the application looks
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Theme</Label>
                            <p className="text-sm text-muted-foreground">
                                Choose your preferred color scheme
                            </p>
                        </div>
                        <Select defaultValue="system">
                            <SelectTrigger className="w-32 cursor-pointer">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem
                                    value="light"
                                    className="cursor-pointer"
                                >
                                    Light
                                </SelectItem>
                                <SelectItem
                                    value="dark"
                                    className="cursor-pointer"
                                >
                                    Dark
                                </SelectItem>
                                <SelectItem
                                    value="system"
                                    className="cursor-pointer"
                                >
                                    System
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Compact Mode</Label>
                            <p className="text-sm text-muted-foreground">
                                Show more content with reduced spacing
                            </p>
                        </div>
                        <Switch className="cursor-pointer" />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Animations</Label>
                            <p className="text-sm text-muted-foreground">
                                Enable interface animations
                            </p>
                        </div>
                        <Switch defaultChecked className="cursor-pointer" />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5" />
                        Language & Region
                    </CardTitle>
                    <CardDescription>
                        Set your language and regional preferences
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Language</Label>
                            <p className="text-sm text-muted-foreground">
                                Select your preferred language
                            </p>
                        </div>
                        <Select defaultValue="en">
                            <SelectTrigger className="w-40 cursor-pointer">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem
                                    value="en"
                                    className="cursor-pointer"
                                >
                                    English
                                </SelectItem>
                                <SelectItem
                                    value="vi"
                                    className="cursor-pointer"
                                >
                                    Tiếng Việt
                                </SelectItem>
                                <SelectItem
                                    value="ja"
                                    className="cursor-pointer"
                                >
                                    日本語
                                </SelectItem>
                                <SelectItem
                                    value="zh"
                                    className="cursor-pointer"
                                >
                                    中文
                                </SelectItem>
                                <SelectItem
                                    value="ko"
                                    className="cursor-pointer"
                                >
                                    한국어
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Timezone</Label>
                            <p className="text-sm text-muted-foreground">
                                Set your local timezone
                            </p>
                        </div>
                        <Select defaultValue="utc+7">
                            <SelectTrigger className="w-48 cursor-pointer">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem
                                    value="utc-8"
                                    className="cursor-pointer"
                                >
                                    UTC-8 (Los Angeles)
                                </SelectItem>
                                <SelectItem
                                    value="utc-5"
                                    className="cursor-pointer"
                                >
                                    UTC-5 (New York)
                                </SelectItem>
                                <SelectItem
                                    value="utc+0"
                                    className="cursor-pointer"
                                >
                                    UTC+0 (London)
                                </SelectItem>
                                <SelectItem
                                    value="utc+7"
                                    className="cursor-pointer"
                                >
                                    UTC+7 (Bangkok)
                                </SelectItem>
                                <SelectItem
                                    value="utc+8"
                                    className="cursor-pointer"
                                >
                                    UTC+8 (Singapore)
                                </SelectItem>
                                <SelectItem
                                    value="utc+9"
                                    className="cursor-pointer"
                                >
                                    UTC+9 (Tokyo)
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Date Format</Label>
                            <p className="text-sm text-muted-foreground">
                                Choose how dates are displayed
                            </p>
                        </div>
                        <Select defaultValue="mdy">
                            <SelectTrigger className="w-40 cursor-pointer">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem
                                    value="mdy"
                                    className="cursor-pointer"
                                >
                                    MM/DD/YYYY
                                </SelectItem>
                                <SelectItem
                                    value="dmy"
                                    className="cursor-pointer"
                                >
                                    DD/MM/YYYY
                                </SelectItem>
                                <SelectItem
                                    value="ymd"
                                    className="cursor-pointer"
                                >
                                    YYYY-MM-DD
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end gap-3">
                <Button
                    variant="outline"
                    className="cursor-pointer bg-transparent"
                >
                    Reset to Defaults
                </Button>
                <Button className="cursor-pointer">Save All Changes</Button>
            </div>
        </div>
    );
}
