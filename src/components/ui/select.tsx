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
            <div className={`flex flex-col gap-1.5 ${fullWidth ? "w-full" : ""}`} ref={dropdownRef}>
                {label && (
                    <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
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
                            px-3.5 py-2.5
                            pr-10
                            bg-white
                            border border-stone-300
                            rounded-lg
                            text-left
                            text-sm
                            text-stone-900
                            font-medium
                            focus:outline-none
                            focus:ring-2
                            focus:ring-[#0b3a60]/20
                            focus:border-[#0b3a60]
                            disabled:opacity-50
                            disabled:cursor-not-allowed
                            disabled:bg-stone-50
                            cursor-pointer
                            transition-all
                            hover:border-stone-400
                            ${isOpen ? "ring-2 ring-[#0b3a60]/20 border-[#0b3a60]" : ""}
                            ${error ? "border-red-500 focus:ring-red-500/20" : ""}
                            ${!selectedValue && "text-stone-400"}
                            ${className}
                        `}
                    >
                        {displayText}
                    </button>
                    <div className={`absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none ${isOpen ? styles.chevronOpen : styles.chevronClosed}`}>
                        <ChevronDown 
                            className={`w-4 h-4 transition-colors ${
                                disabled ? "text-stone-300" : isOpen ? "text-[#0b3a60]" : "text-stone-500"
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
                                mt-1.5
                                bg-white
                                border border-stone-200
                                rounded-xl
                                shadow-lg
                                overflow-hidden
                                z-50
                            `}
                        >
                            <div className="max-h-64 overflow-y-auto py-1.5 divide-y divide-stone-50">
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
                                                px-3.5
                                                py-2.5
                                                text-left
                                                text-sm
                                                flex
                                                items-center
                                                justify-between
                                                gap-2
                                                cursor-pointer
                                                transition-colors
                                                ${isSelected 
                                                    ? "bg-[#0b3a60]/10 text-[#0b3a60] font-semibold" 
                                                    : "text-stone-800 hover:bg-stone-50"
                                                }
                                            `}
                                        >
                                            <span className="truncate">{option.label}</span>
                                            {isSelected && (
                                                <Check className="w-4 h-4 text-[#0b3a60] shrink-0" />
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
                    <span className={`text-xs font-medium ${error ? "text-red-600" : "text-stone-500"}`}>
                        {error || helperText}
                    </span>
                )}
            </div>
        );
    }
);

Select.displayName = "Select";

export default Select;
