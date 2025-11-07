'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface ReportModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    postId: string;
    postTitle: string;
}

const reportReasons = [
    { value: 'spam', label: 'Spam or misleading' },
    { value: 'harassment', label: 'Harassment or hate speech' },
    { value: 'violence', label: 'Violence or dangerous content' },
    { value: 'inappropriate', label: 'Inappropriate content' },
    { value: 'copyright', label: 'Copyright violation' },
    { value: 'other', label: 'Other' },
];

export function ReportModal({
    open,
    onOpenChange,
    postId,
    postTitle,
}: ReportModalProps) {
    const [selectedReason, setSelectedReason] = useState<string>('');
    const [otherReason, setOtherReason] = useState<string>('');
    const [additionalDetails, setAdditionalDetails] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!selectedReason) {
            toast.error('Please select a reason for reporting');
            return;
        }

        if (selectedReason === 'other' && !otherReason.trim()) {
            toast.error('Please specify the reason');
            return;
        }

        setIsSubmitting(true);

        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));

            const finalReason =
                selectedReason === 'other' ? otherReason : selectedReason;

            console.log('Report submitted:', {
                postId,
                reason: finalReason,
                details: additionalDetails,
            });

            toast.success('Report submitted successfully');
            onOpenChange(false);
            setSelectedReason('');
            setOtherReason('');
            setAdditionalDetails('');
        } catch (error) {
            toast.error('Failed to submit report');
            console.error('Report error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        setSelectedReason('');
        setOtherReason('');
        setAdditionalDetails('');
        onOpenChange(false);
    };

    const handleReasonChange = (value: string) => {
        setSelectedReason(value);
        if (value !== 'other') {
            setOtherReason('');
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Report Post</DialogTitle>
                    <DialogDescription>
                        Help us understand why you&apos;re reporting this post:
                        <span className="block mt-3 font-medium text-gray-900 dark:text-gray-100 truncate">
                            &quot;{postTitle}&quot;
                        </span>
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-3">
                        <Label htmlFor="reason">Select a reason *</Label>
                        <RadioGroup
                            value={selectedReason}
                            onValueChange={handleReasonChange}
                        >
                            {reportReasons.map((reason) => (
                                <div key={reason.value} className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem
                                            value={reason.value}
                                            id={reason.value}
                                        />
                                        <Label
                                            htmlFor={reason.value}
                                            className="font-normal cursor-pointer"
                                        >
                                            {reason.label}
                                        </Label>
                                    </div>
                                    {reason.value === 'other' &&
                                        selectedReason === 'other' && (
                                            <div className="ml-6">
                                                <Input
                                                    placeholder="Please specify..."
                                                    value={otherReason}
                                                    onChange={(e) =>
                                                        setOtherReason(
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full"
                                                />
                                            </div>
                                        )}
                                </div>
                            ))}
                        </RadioGroup>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="details">
                            Additional details (optional)
                        </Label>
                        <Textarea
                            id="details"
                            placeholder="Provide more information about your report..."
                            value={additionalDetails}
                            onChange={(e) =>
                                setAdditionalDetails(e.target.value)
                            }
                            className="min-h-[100px] resize-none"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={
                            isSubmitting ||
                            !selectedReason ||
                            (selectedReason === 'other' && !otherReason.trim())
                        }
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Report'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
