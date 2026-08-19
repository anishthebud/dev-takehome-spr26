"use client";

import { RequestStatus } from "@/lib/types/request";
import { ChevronDownIcon } from "@/components/icons/ChevronDownIcon";
import { useEffect, useRef, useState } from "react";
import Pill from "./Pill";

interface DropdownProps {
  currStatus: RequestStatus | null;
  placeholder?: string;
  disabled?: boolean;
  onChange?: (status: RequestStatus) => void;
}

export default function Dropdown({ currStatus, placeholder = "Status", disabled = false, onChange }: DropdownProps) {
    const [isOpen, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (!containerRef.current?.contains(event.target as Node)) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    useEffect(() => {
        if (disabled) setOpen(false);
    }, [disabled]);

    const toggleDropdown = () => {
        setOpen(!isOpen);
    }

    const handleSelect = (option: RequestStatus) => {
        onChange?.(option);
        setOpen(false);
    }

    const options = [RequestStatus.PENDING, RequestStatus.APPROVED, RequestStatus.COMPLETED, RequestStatus.REJECTED]

    return (
        <div ref={containerRef} className="relative w-fit">
            <button
                type="button"
                className={`flex w-full items-center justify-between gap-1 rounded-lg border bg-white p-1 shadow-sm transition ${
                    isOpen ? "border-primary ring-1 ring-primary" : "border-gray-stroke"
                } ${disabled ? "cursor-not-allowed opacity-50" : "hover:bg-[#EFF6FF]"}`}
                onClick={toggleDropdown}
                disabled={disabled}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                {currStatus ? (
                    <Pill status={currStatus} />
                ) : (
                    <p className="px-2 text-gray-text">{placeholder}</p>
                )}
                <span className={`px-1 text-gray-text transition-transform ${isOpen ? "rotate-180" : ""}`}>
                    <ChevronDownIcon />
                </span>
            </button>
            { isOpen && (
                <ul className="absolute left-0 top-full z-20 mt-1 w-max min-w-full rounded-lg border border-gray-stroke bg-white p-1 shadow-lg">
                    {options.map((option) => (
                        <li key={option}>
                            <button
                                type="button"
                                className="flex w-full rounded-md p-1 transition hover:bg-gray-fill-light"
                                onClick={() => handleSelect(option)}
                            >
                                <Pill status={option} />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
