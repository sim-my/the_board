// Button.tsx
import React from "react";
import type { LucideIcon } from "lucide-react";

type ButtonProps = {
    onClick?: () => void;
    children: React.ReactNode;
    size?: "sm" | "md" | "lg";
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
    className?: string;
    icon?: LucideIcon;
    iconPosition?: "left" | "right";
};

export default function Button({
    onClick,
    size = "md",
    disabled = false,
    type = "button",
    className = "",
    icon: Icon,
    iconPosition = "left",
    children,
}: ButtonProps) {
    const base =
        "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-colors cursor-pointer disabled:opacity-50 disabled:pointer-events-none";

    const sizes = {
        sm: "px-3 py-1.5 text-xs",
        md: "px-5 py-2.5 text-sm",
        lg: "px-7 py-3.5 text-base",
    };

    const iconSizes = {
        sm: "h-3.5 w-3.5",
        md: "h-4 w-4",
        lg: "h-5 w-5",
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${base} ${sizes[size]} ${className}`}
        >
            {Icon && iconPosition === "left" && (
                <Icon className={iconSizes[size]} />
            )}

            {children}
            {Icon && iconPosition === "right" && (
                <Icon className={iconSizes[size]} />
            )}
        </button>
    );
}