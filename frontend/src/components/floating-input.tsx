'use client';

import { Check, Eye, EyeClosed, XCircleIcon } from 'lucide-react';
import React, { InputHTMLAttributes, useMemo, useState } from 'react';

interface FloatingInputProps extends InputHTMLAttributes<HTMLInputElement> {
    id: string;
    label: string;
    error?: string;
    type?: string;
}

const FloatingInput: React.FC<FloatingInputProps> = ({
    id,
    label,
    value,
    error,
    onChange,
    className = '',
    type = 'text',
    ...rest
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const isPasswordInput = type === 'password';
    const currentInputType = isPasswordInput && showPassword ? 'text' : type;

    const inputValue = value as string | undefined;

    const hasValue = useMemo(() => {
        return inputValue && String(inputValue).trim().length > 0;
    }, [inputValue]);

    const isFloating = isFocused || hasValue;

    const showValidationIcon = error || (!error && hasValue);

    const PADDING_FOR_VALIDATION_ICON = 10;
    const PADDING_FOR_VISIBILITY_ICON = 8;

    let pr = 3;

    if (showValidationIcon) {
        pr = PADDING_FOR_VALIDATION_ICON;
    }

    if (isPasswordInput) {
        if (showValidationIcon) {
            pr = PADDING_FOR_VALIDATION_ICON + PADDING_FOR_VISIBILITY_ICON / 2;
        } else {
            pr = PADDING_FOR_VISIBILITY_ICON;
        }
    }
    const labelClasses = [
        'absolute left-3 transition-all duration-300 ease-in-out pointer-events-none',
        isFloating
            ? 'text-xs top-1 dark:text-blue-400'
            : 'text-base top-3 dark:text-gray-400',

        error ? 'text-red-500' : isFloating ? 'text-blue-600' : 'text-gray-500',
    ].join(' ');

    const inputClasses = [
        'w-full px-3 pt-5 pb-1 text-gray-900 bg-white border rounded-lg outline-none transition-colors duration-200',
        'dark:bg-gray-700 dark:text-white',

        `pr-${pr}`,

        error
            ? 'border-red-500 focus:border-red-600'
            : 'border-gray-300 focus:border-blue-600 dark:border-gray-600 dark:focus:border-blue-400',

        className,
    ].join(' ');

    const validationIconRight = isPasswordInput ? 'right-10' : 'right-3';
    const visibilityIconRight = 'right-3';

    return (
        <div className="relative my-1">
            <input
                id={id}
                type={currentInputType}
                value={value}
                onChange={onChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className={inputClasses}
                {...rest}
            />

            <label htmlFor={id} className={labelClasses}>
                {label}
            </label>

            {isPasswordInput && (
                <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className={`absolute ${visibilityIconRight} top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors z-10`}
                    aria-label={
                        showPassword ? 'Hide password' : 'Show password'
                    }
                >
                    {showPassword ? <EyeClosed /> : <Eye />}
                </button>
            )}

            {showValidationIcon && (
                <div
                    className={`absolute ${validationIconRight} top-1/2 transform -translate-y-1/2 cursor-default z-10`}
                >
                    {error ? (
                        <div className="relative group">
                            <XCircleIcon
                                size={18}
                                className="text-destructive mr-1"
                            />
                            <div className="absolute right-0 bottom-full mb-2 w-max p-2 text-xs text-white bg-red-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20 shadow-md">
                                {error}
                            </div>
                        </div>
                    ) : (
                        <Check />
                    )}
                </div>
            )}
        </div>
    );
};

export default FloatingInput;
