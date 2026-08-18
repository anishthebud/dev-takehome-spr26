import { RequestStatus } from "@/lib/types/request";
import Dropdown from "@/components/atoms/Dropdown";
import { ItemRequest } from "@/lib/types/itemRequest";

interface TableProps {
    requests: ItemRequest[];
    onStatusChange?: (id: string, status: RequestStatus) => void;
}

const formatDate = (date: string | null) =>
    date
        ? new Date(date).toLocaleDateString("en-US", {
              month: "2-digit",
              day: "2-digit",
              year: "2-digit",
          })
        : "--";

export default function Table({ requests, onStatusChange }: TableProps) {
    return (
        <div className="w-full rounded-lg border border-gray-stroke bg-white">
            <table className="w-full border-separate border-spacing-0 text-left">
                <thead>
                    <tr className="bg-gray-fill-light">
                        <th className="whitespace-nowrap rounded-tl-lg px-6 py-3 font-medium text-gray-text">Name</th>
                        <th className="whitespace-nowrap px-6 py-3 font-medium text-gray-text">Item Requested</th>
                        <th className="whitespace-nowrap px-6 py-3 font-medium text-gray-text">Created</th>
                        <th className="whitespace-nowrap px-6 py-3 font-medium text-gray-text">Updated</th>
                        <th className="whitespace-nowrap rounded-tr-lg px-6 py-3 font-medium text-gray-text">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map((request) => (
                        <tr key={request._id} className="[&>*]:border-t [&>*]:border-gray-stroke">
                            <td className="whitespace-nowrap px-6 py-3 text-gray-text-dark">{request.requestorName}</td>
                            <td className="whitespace-nowrap px-6 py-3 text-gray-text-dark">{request.itemRequested}</td>
                            <td className="whitespace-nowrap px-6 py-3 text-gray-text-dark">{formatDate(request.createdDate)}</td>
                            <td className="whitespace-nowrap px-6 py-3 text-gray-text-dark">{formatDate(request.lastEditedDate)}</td>
                            <td className="px-6 py-3">
                                <Dropdown
                                    currStatus={request.status}
                                    onChange={(status) => onStatusChange?.(request._id, status)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
