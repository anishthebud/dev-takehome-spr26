"use client";

import { RequestStatus } from "@/lib/types/request";
import Dropdown from "@/components/atoms/Dropdown";
import { ChevronDownIcon } from "@/components/icons/ChevronDownIcon";
import { ItemRequest } from "@/lib/types/itemRequest";
import Pagination from "../molecules/Pagination";
import { PAGINATION_PAGE_SIZE } from "@/lib/constants/config";
import { useEffect, useRef, useState } from "react";
import { Trash2 } from "lucide-react";

interface TableProps {
    requests: ItemRequest[];
    page: number;
    activeStatus: string,
    totalRecords: number;
    onStatusChange?: (ids: string[], status: RequestStatus) => void;
    onPageChange: (page: number) => void;
    onActiveStatusChange: (status: string) => void;
    onSelectionChange?: (ids: string[]) => void;
    onDeleteChange?: (ids: string[]) => void;
}

const formatDate = (date: string | null) =>
    date
        ? new Date(date).toLocaleDateString("en-US", {
              month: "2-digit",
              day: "2-digit",
              year: "2-digit",
          })
        : "--";

const buttonOptions = ['All', 'Pending', 'Approved', 'Completed', 'Rejected'];

export default function Table({ requests, page, activeStatus, totalRecords, onStatusChange, onPageChange, onActiveStatusChange, onSelectionChange, onDeleteChange }: TableProps) {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const selectAllRef = useRef<HTMLInputElement>(null);
    const [selectStatus, setSelectStatus] = useState<RequestStatus | null>(null);

    const allSelected = requests.length > 0 && selectedIds.length === requests.length;
    const someSelected = selectedIds.length > 0 && !allSelected;

    useEffect(() => {
        setSelectedIds([]);
        setSelectStatus(null);
    }, [page, activeStatus]);

    useEffect(() => {
        if (selectAllRef.current) {
            selectAllRef.current.indeterminate = someSelected;
        }
    }, [someSelected]);

    const updateSelection = (ids: string[]) => {
        setSelectedIds(ids);
        onSelectionChange?.(ids);
        setSelectStatus(null);
    }

    const toggleRow = (id: string) => {
        updateSelection(
            selectedIds.includes(id)
                ? selectedIds.filter((selectedId) => selectedId !== id)
                : [...selectedIds, id]
        );
    }

    const toggleAll = () => {
        updateSelection(allSelected ? [] : requests.map((request) => request._id));
    }

    const onDeleteClick = () => {
        if (selectedIds.length === 0) return;
        onDeleteChange?.(selectedIds);
        updateSelection([]);
    }

    const onSelectChange = (status: RequestStatus) => {
        if (selectedIds.length === 0) return;
        setSelectStatus(status);
        onStatusChange?.(selectedIds, status);
    }

    return (
        <div className="flex flex-col">
            <div className="flex items-center justify-between gap-4 bg-white px-4 py-3">
                <h3 className="font-bold">Item Requests</h3>
                <div className="flex items-center gap-2">
                    <p className="hidden text-gray-text sm:block">Mark As</p>
                    <Dropdown
                        currStatus={selectStatus}
                        placeholder="Status"
                        disabled={selectedIds.length === 0}
                        onChange={onSelectChange}
                    />
                    <button
                        type="button"
                        className="rounded-lg border border-gray-stroke p-2 text-gray-text transition enabled:hover:bg-gray-fill-light disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label="Delete selected requests"
                        disabled={selectedIds.length === 0}
                        onClick={onDeleteClick}
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </div>
            <div className="relative sm:hidden">
                <select
                    value={activeStatus}
                    onChange={(e) => onActiveStatusChange(e.target.value)}
                    className="w-full appearance-none rounded-t-lg bg-primary py-2 pl-4 pr-10 font-medium text-white"
                >
                    {buttonOptions.map((option) => (
                        <option key={option} value={option} className="bg-white text-gray-text-dark">
                            {option}
                        </option>
                    ))}
                </select>
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white">
                    <ChevronDownIcon />
                </span>
            </div>
            <div className="hidden gap-2 sm:flex">
                {buttonOptions.map((option) => (
                    <button
                        key={option}
                        onClick={() => onActiveStatusChange(option)}
                        className={`shrink-0 rounded-t-lg px-6 py-2 font-medium transition ${
                            activeStatus === option
                                ? "bg-primary text-white"
                                : "bg-gray-fill text-gray-text hover:bg-gray-stroke"
                        }`}
                    >
                        {option}
                    </button>
                ))}
            </div>
            <div className="w-full rounded-b-lg border border-gray-stroke bg-white">
                <table className="w-full border-separate border-spacing-0 text-left text-xs sm:text-base">
                    <thead>
                        <tr className="bg-gray-fill-light">
                            <th className="w-0 px-2 py-3 sm:pl-6 sm:pr-2">
                                <input
                                    ref={selectAllRef}
                                    type="checkbox"
                                    className="h-4 w-4 cursor-pointer accent-primary align-middle"
                                    checked={allSelected}
                                    disabled={requests.length === 0}
                                    onChange={toggleAll}
                                    aria-label="Select all requests on this page"
                                />
                            </th>
                            <th className="px-2 py-3 font-medium text-gray-text sm:px-6">Name</th>
                            <th className="px-2 py-3 font-medium text-gray-text sm:px-6">Item Requested</th>
                            <th className="px-2 py-3 font-medium text-gray-text sm:px-6">Created</th>
                            <th className="hidden px-2 py-3 font-medium text-gray-text sm:table-cell sm:px-6">Updated</th>
                            <th className="px-2 py-3 font-medium text-gray-text sm:px-6">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map((request) => (
                            <tr
                                key={request._id}
                                className={`[&>*]:border-t [&>*]:border-gray-stroke ${
                                    selectedIds.includes(request._id) ? "bg-primary-fill" : ""
                                }`}
                            >
                                <td className="w-0 px-2 py-3 sm:pl-6 sm:pr-2">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 cursor-pointer accent-primary align-middle"
                                        checked={selectedIds.includes(request._id)}
                                        onChange={() => toggleRow(request._id)}
                                        aria-label={`Select request from ${request.requestorName}`}
                                    />
                                </td>
                                <td className="break-words px-2 py-3 text-gray-text-dark sm:px-6">{request.requestorName}</td>
                                <td className="break-words px-2 py-3 text-gray-text-dark sm:px-6">{request.itemRequested}</td>
                                <td className="whitespace-nowrap px-2 py-3 text-gray-text-dark sm:px-6">{formatDate(request.createdDate)}</td>
                                <td className="hidden whitespace-nowrap px-2 py-3 text-gray-text-dark sm:table-cell sm:px-6">{formatDate(request.lastEditedDate)}</td>
                                <td className="px-2 py-3 sm:px-6">
                                    <Dropdown
                                        currStatus={request.status}
                                        onChange={(status) => onStatusChange?.([request._id], status)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="[&>*]:border-t [&>*]:border-gray-stroke">
                            <td colSpan={6} className="px-2 py-3 text-right sm:px-6">
                                <Pagination
                                    pageNumber={page}
                                    pageSize={PAGINATION_PAGE_SIZE}
                                    totalRecords={totalRecords}
                                    onPageChange={onPageChange}
                                />
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
}
