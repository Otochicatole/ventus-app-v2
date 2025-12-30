"use client";

import { SelectHTMLAttributes, forwardRef, useState, useEffect, useRef } from "react";
import { ChevronDown, Check } from "lucide-react";
import styles from "./select.module.css";

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
    label?: string;
    error?: string;
    helperText?: string;
    fullWidth?: boolean;
    options?: { value: string; label: string }[];
    value?: string;
    onChange?: (e: { target: { value: string } }) => void;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ label, error, helperText, fullWidth = false, options = [], className = "", children, value, onChange, disabled, required, ...props }, ref) => {
        const [isOpen, setIsOpen] = useState(false);
        const [selectedValue, setSelectedValue] = useState(value || "");
        const dropdownRef = useRef<HTMLDivElement>(null);

        useEffect(() => {
            setSelectedValue(value || "");
        }, [value]);

        useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
                if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                    setIsOpen(false);
                }
            };

            if (isOpen) {
                document.addEventListener("mousedown", handleClickOutside);
            }

            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, [isOpen]);

        const handleSelect = (optionValue: string) => {
            setSelectedValue(optionValue);
            setIsOpen(false);
            if (onChange) {
                onChange({ target: { value: optionValue } });
            }
        };

        const selectedOption = options.find(opt => opt.value === selectedValue);
        const displayText = selectedOption?.label || "Seleccionar...";

        return (
            <div className={`flex flex-col gap-2 ${fullWidth ? "w-full" : ""}`} ref={dropdownRef}>
                {label && (
                    <label className="text-sm font-semibold text-gray-900">
                        {label}
                        {required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => !disabled && setIsOpen(!isOpen)}
                        disabled={disabled}
                        className={`
                            w-full
                            px-4 py-3.5
                            pr-12
                            bg-white
                            border border-gray-300
                            rounded-xl
                            text-left
                            text-gray-900
                            font-medium
                            focus:outline-none
                            focus:ring-2
                            focus:ring-blue-500
                            focus:border-transparent
                            disabled:opacity-50
                            disabled:cursor-not-allowed
                            disabled:bg-gray-50
                            cursor-pointer
                            transition-all
                            shadow-sm
                            hover:border-gray-400
                            ${isOpen ? "ring-2 ring-blue-500 border-transparent" : ""}
                            ${error ? "border-red-500 focus:ring-red-500" : ""}
                            ${!selectedValue && "text-gray-500"}
                            ${className}
                        `}
                    >
                        {displayText}
                    </button>
                    <div className={`absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none ${isOpen ? styles.chevronOpen : styles.chevronClosed}`}>
                        <ChevronDown 
                            className={`w-5 h-5 transition-colors ${
                                disabled ? "text-gray-400" : isOpen ? "text-blue-600" : "text-gray-600"
                            }`}
                        />
                    </div>

                    {isOpen && !disabled && (
                        <div 
                            className={`
                                ${styles.dropdown}
                                absolute
                                top-full
                                left-0
                                right-0
                                mt-2
                                bg-white
                                border border-gray-200
                                rounded-xl
                                shadow-xl
                                overflow-hidden
                                z-50
                            `}
                        >
                            <div className="max-h-64 overflow-y-auto py-2">
                                {options.map((option) => {
                                    const isSelected = option.value === selectedValue;
                                    return (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => handleSelect(option.value)}
                                            className={`
                                                ${styles.option}
                                                w-full
                                                px-4
                                                py-3
                                                text-left
                                                flex
                                                items-center
                                                justify-between
                                                gap-2
                                                ${isSelected 
                                                    ? "bg-blue-50 text-blue-700 font-semibold" 
                                                    : "text-gray-900 hover:bg-gray-50"
                                                }
                                            `}
                                        >
                                            <span>{option.label}</span>
                                            {isSelected && (
                                                <Check className="w-5 h-5 text-blue-600 shrink-0" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <select
                        ref={ref}
                        value={selectedValue}
                        onChange={(e) => {
                            setSelectedValue(e.target.value);
                            if (onChange) {
                                onChange(e);
                            }
                        }}
                        disabled={disabled}
                        required={required}
                        className="sr-only"
                        tabIndex={-1}
                        {...props}
                    >
                        {options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                        {children}
                    </select>
                </div>
                {(error || helperText) && (
                    <span className={`text-xs font-medium ${error ? "text-red-500" : "text-gray-500"}`}>
                        {error || helperText}
                    </span>
                )}
            </div>
        );
    }
);

Select.displayName = "Select";

export default Select;
