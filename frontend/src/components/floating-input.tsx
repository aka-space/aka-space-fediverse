'use client';

import React, { InputHTMLAttributes, useState, useMemo } from 'react';

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
                    {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                </button>
            )}

            {showValidationIcon && (
                <div
                    className={`absolute ${validationIconRight} top-1/2 transform -translate-y-1/2 cursor-default z-10`}
                >
                    {error ? (
                        <div className="relative group">
                            <ErrorIcon />
                            <div className="absolute right-0 bottom-full mb-2 w-max p-2 text-xs text-white bg-red-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20 shadow-md">
                                {error}
                            </div>
                        </div>
                    ) : (
                        <CheckedIcon />
                    )}
                </div>
            )}
        </div>
    );
};

export default FloatingInput;

const ErrorIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-5 h-5 text-red-500"
    >
        <path
            fillRule="evenodd"
            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.75 1.75a.75.75 0 1 0 1.06 1.06L12 13.06l1.75 1.75a.75.75 0 1 0 1.06-1.06L13.06 12l1.75-1.75a.75.75 0 1 0-1.06-1.06L12 10.94l-1.75-1.75Z"
            clipRule="evenodd"
        />
    </svg>
);

const CheckedIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-5 h-5 text-green-500"
    >
        <path
            fillRule="evenodd"
            d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.882l-3.484 4.195-1.484-1.484a.75.75 0 1 0-1.06 1.06l2 2a.75.75 0 0 0 1.06 0l4-4Z"
            clipRule="evenodd"
        />
    </svg>
);

const EyeIcon = (props: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={`w-5 h-5 ${props.className}`}
    >
        <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
        <path
            fillRule="evenodd"
            d="M1.323 11.447C2.88 7.973 6.338 5.25 12 5.25c5.662 0 9.12 2.723 10.677 6.197a1.5 1.5 0 0 1 0 1.306C21.12 16.027 17.662 18.75 12 18.75c-5.662 0-9.12-2.723-10.677-6.197a1.5 1.5 0 0 1 0-1.306ZM12 16.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Z"
            clipRule="evenodd"
        />
    </svg>
);

const EyeSlashIcon = (props: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={`w-5 h-5 ${props.className}`}
    >
        <path d="m10.5 10.5 6 6m-4.6-4.6c.78-.783 1.054-1.742 1.085-1.843.05-.125-.018-.266-.151-.383C12.75 9.75 12 9.75 12 9.75c-3 0-6.173 1.343-9.177 3.992-.473.415-.494 1.107-.061 1.5l.39.407c.413.435 1.116.47 1.517.098 1.435-1.38 3.013-2.245 4.551-2.484l1.375 1.375a3 3 0 0 1-.387-.714Z" />
        <path
            fillRule="evenodd"
            d="M3.75 5.25h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1 0-1.5ZM.75 11.25a.75.75 0 0 1 .75-.75h.375a.75.75 0 0 1 .75.75v.375a.75.75 0 0 1-.75.75H1.5a.75.75 0 0 1-.75-.75v-.375ZM18 10.5a.75.75 0 0 1 .75-.75h.375a.75.75 0 0 1 .75.75v.375a.75.75 0 0 1-.75.75h-.375a.75.75 0 0 1-.75-.75v-.375Z"
            clipRule="evenodd"
        />
        <path
            fillRule="evenodd"
            d="M6.929 11.161c.427-.478 1.006-.827 1.636-1.009.63-.182 1.298-.242 1.956-.169l2.775 2.775a4.52 4.52 0 0 0-2.43 1.928 1.5 1.5 0 0 0-.256-.474l-1.92-1.92Z"
            clipRule="evenodd"
        />
        <path
            fillRule="evenodd"
            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75 0 1.581.42 3.123 1.22 4.54a.75.75 0 0 0 1.294-.741 8.243 8.243 0 0 1-.685-3.649c0-4.55 3.708-8.25 8.25-8.25s8.25 3.708 8.25 8.25c0 1.15-.224 2.274-.685 3.324a.75.75 0 0 0 1.294.741 9.74 9.74 0 0 0 1.22-4.54c0-5.385-4.365-9.75-9.75-9.75Z"
            clipRule="evenodd"
        />
    </svg>
);
