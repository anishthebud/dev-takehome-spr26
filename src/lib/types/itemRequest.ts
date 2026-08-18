import { RequestStatus } from "./request";

/**
 * An item request as it arrives from GET /api/request.
 * Everything is a primitive because the response has been through JSON:
 * ObjectIds come across as strings, Dates as ISO strings.
 */
export interface ItemRequest {
  _id: string;
  requestorName: string;
  itemRequested: string;
  createdDate: string;
  lastEditedDate: string | null;
  status: RequestStatus;
}
