import { ItemRequest } from "@/lib/types/itemRequests";
import { RequestStatus } from "@/lib/types/request";
import dbConnect, { Item } from "./db";
import { PAGINATION_PAGE_SIZE } from "@/lib/constants/config";

export async function getItems(page: number) {
    // Connect to the database
    await dbConnect();
    // Get the items
    const offset = PAGINATION_PAGE_SIZE * (page - 1);
    const items = await Item.find()
        .sort({ createdDate: -1 })
        .skip(offset)
        .limit(PAGINATION_PAGE_SIZE)
        .lean();
    return items;
}

export async function addItem(request: any) {
    // Add item to the database
    await dbConnect();
    return Item.create({
            requestorName: request.requestorName,
            itemRequested: request.itemRequested,
            createdDate: new Date(),
            lastEditedDate: new Date(),
            status: RequestStatus.PENDING,
    })
}
