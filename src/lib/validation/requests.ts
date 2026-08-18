import { RequestStatus } from "../types/request";
import { Types } from "mongoose";

function isValidString(str: any, lower?: number, upper?: number): boolean {
  if (typeof str !== "string" || str.trim() == "") {
    return false;
  }
  if ((lower && str.length < lower) || (upper && str.length > upper)) {
    return false;
  }
  return true;
}

function isValidStatus(status: string | null) {
    return status === null ||
        Object.values(RequestStatus).includes(status as RequestStatus);
}

function isValidPageNumber(page: number) {
    return page > 0;
}

function isValidId(id: any) {
    return typeof id == "string" && Types.ObjectId.isValid(id);
}

export function validateGetItemsRequest(status: string | null, page: number) {
    // Ensure that if a status is provided, then it needs to be validated
    if (!isValidStatus(status)) {
        return false;
    }
    if (!isValidPageNumber(page)) {
        return false;
    }
    return true;
}

export function validateAddItemRequest(request: any) {
    if (!isValidString(request.requestorName, 3, 300)) {
        return false;
    }
    if (!isValidString(request.itemRequested, 2, 100)) {
        return false;
    }
    return true;
}

export function validateEditItemRequest(request: any) {
    if (!isValidId(request._id)) {
        return false;
    }
    if (!isValidStatus(request.status)) {
        return false;
    }
    return true;
}
