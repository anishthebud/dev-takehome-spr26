/* eslint-disable @typescript-eslint/no-explicit-any */
// ^ disable rules because we are validating anys to make sure it conforms else erroring
import { RequestStatus } from "@/lib/types/request";
import dbConnect, { Item } from "./db";
import { PAGINATION_PAGE_SIZE } from "@/lib/constants/config";
import { validateAddItemRequest, validateDeleteItemRequest, validateEditItemRequest, validateGetItemsRequest } from "@/lib/validation/requests";
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
    const [items, totalRecords] = await Promise.all([
        Item.find(statusFilter)
            .sort({ createdDate: -1 })
            .skip(offset)
            .limit(PAGINATION_PAGE_SIZE)
            .lean(),
        Item.countDocuments(statusFilter)
    ]);
    return {
        data: items,
        totalRecords
    };
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

// Works for one element and an array of elements
export async function editItem(request: any) {
    // Connect to the database
    await dbConnect();
    // Validate editItem request
    if (!validateEditItemRequest(request)) {
        throw new InvalidInputError("Edit Item Request");
    }
    console.log(request.ids);
    // Edit the item
    const updated = await Item.updateMany(
        { _id: { $in: request.ids } },
        { $set: { status: request.status, lastEditedDate: new Date() } }
    );
    // Check to see if item is actually there
    if (updated.matchedCount === 0) {
        throw new ItemNotFoundError(request.ids.join(", "));
    }
    // Return the edited items themselves so the caller can refresh its view
    return Item.find({ _id: { $in: request.ids } }).lean();
}

export async function deleteItem(request: any) {
    // Connect to the database
    await dbConnect();
    // Validate deleteItem request
    if (!validateDeleteItemRequest(request)) {
        throw new InvalidInputError("Delete Item Request");
    }
    // Delete the items
    const deleted = await Item.deleteMany(
        { _id: { $in: request.ids } }
    );
    // Check to see if item is actually there
    if (deleted.deletedCount === 0) {
        throw new ItemNotFoundError(request.ids.join(", "));
    }
    // Return the deleted object
    return deleted;
}
