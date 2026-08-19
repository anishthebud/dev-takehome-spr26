/* eslint-disable @typescript-eslint/no-explicit-any */
// ^ disable rules because we are validating anys to make sure it conforms else erroring
import { RequestStatus } from "../types/request";
import { Types } from "mongoose";
import { MAX_BATCH_SIZE } from "../constants/config";

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

function isValidIds(ids: any) {
    if (!Array.isArray(ids) || ids.length === 0 || ids.length > MAX_BATCH_SIZE) {
        return false;
    }
    
    return ids.every(
        (id: any) => typeof id === "string" && Types.ObjectId.isValid(id)
    );
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
    if (!isValidIds(request.ids)) {
        return false;
    }
    if (request.status === null || !isValidStatus(request.status)) {
        return false;
    }
    return true;
}

export function validateDeleteItemRequest(request: any) {
    return isValidIds(request.ids);
}
