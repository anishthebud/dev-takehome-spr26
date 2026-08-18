import { RequestStatus } from "@/lib/types/request";
import dbConnect, { Item } from "./db";
import { PAGINATION_PAGE_SIZE } from "@/lib/constants/config";
import { validateAddItemRequest, validateEditItemRequest, validateGetItemsRequest } from "@/lib/validation/requests";
import { InvalidInputError, ItemNotFoundError } from "@/lib/errors/inputExceptions";

export async function getItems(status: string | null, page: number) {
    // Connect to the database
    await dbConnect();
    // Validate getItems request
    if (!validateGetItemsRequest(status, page)) {
        throw new InvalidInputError("Get Items Request");
    }
    // Get the items
    const offset = PAGINATION_PAGE_SIZE * (page - 1);
    const statusFilter = status ? { status: status } : {}
    const items = await Item.find(statusFilter)
        .sort({ createdDate: -1 })
        .skip(offset)
        .limit(PAGINATION_PAGE_SIZE)
        .lean();
    return items;
}

export async function addItem(request: any) {
    // Connect to the database
    await dbConnect();
    // Validate addItem request
    if (!validateAddItemRequest(request)) {
        throw new InvalidInputError("Add Item Request");
    }
    // Add the item
    return Item.create({
            requestorName: request.requestorName,
            itemRequested: request.itemRequested,
            createdDate: new Date(),
            lastEditedDate: new Date(),
            status: RequestStatus.PENDING,
    })
}

export async function editItem(request: any) {
    // Connect to the database
    await dbConnect();
    // Validate editItem request
    if (!validateEditItemRequest(request)) {
        throw new InvalidInputError("Edit Item Request");
    }
    // Edit the item
    const updated = await Item.findOneAndUpdate(
        { _id: request._id },
        { $set: { status: request.status, lastEditedDate: new Date() } },
        { new: true }
    ).lean();
    // Check to see if item is actually there
    if (!updated) {
        throw new ItemNotFoundError(request.id);
    }
    // Return the edited item
    return updated;
}
