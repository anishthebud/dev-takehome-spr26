import { RequestStatus } from "@/lib/types/request";
import Dropdown from "@/components/atoms/Dropdown";
import { ChevronDownIcon } from "@/components/icons/ChevronDownIcon";
import { ItemRequest } from "@/lib/types/itemRequest";
import Pagination from "../molecules/Pagination";
import { PAGINATION_PAGE_SIZE } from "@/lib/constants/config";

interface TableProps {
    requests: ItemRequest[];
    page: number;
    activeStatus: string,
    totalRecords: number;
    onStatusChange?: (id: string, status: RequestStatus) => void;
    onPageChange: (page: number) => void;
    onActiveStatusChange: (status: string) => void;
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

export default function Table({ requests, page, activeStatus, totalRecords, onStatusChange, onPageChange, onActiveStatusChange }: TableProps) {
    return (
        <div className="flex flex-col">
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
                            <th className="px-2 py-3 font-medium text-gray-text sm:px-6">Name</th>
                            <th className="px-2 py-3 font-medium text-gray-text sm:px-6">Item Requested</th>
                            <th className="px-2 py-3 font-medium text-gray-text sm:px-6">Created</th>
                            <th className="hidden px-2 py-3 font-medium text-gray-text sm:table-cell sm:px-6">Updated</th>
                            <th className="px-2 py-3 font-medium text-gray-text sm:px-6">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map((request) => (
                            <tr key={request._id} className="[&>*]:border-t [&>*]:border-gray-stroke">
                                <td className="break-words px-2 py-3 text-gray-text-dark sm:px-6">{request.requestorName}</td>
                                <td className="break-words px-2 py-3 text-gray-text-dark sm:px-6">{request.itemRequested}</td>
                                <td className="whitespace-nowrap px-2 py-3 text-gray-text-dark sm:px-6">{formatDate(request.createdDate)}</td>
                                <td className="hidden whitespace-nowrap px-2 py-3 text-gray-text-dark sm:table-cell sm:px-6">{formatDate(request.lastEditedDate)}</td>
                                <td className="px-2 py-3 sm:px-6">
                                    <Dropdown
                                        currStatus={request.status}
                                        onChange={(status) => onStatusChange?.(request._id, status)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="[&>*]:border-t [&>*]:border-gray-stroke">
                            <td colSpan={5} className="px-2 py-3 text-right sm:px-6">
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
