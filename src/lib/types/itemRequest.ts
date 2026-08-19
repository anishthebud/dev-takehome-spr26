import { RequestStatus } from "./request";

export interface ItemRequest {
  _id: string;
  requestorName: string;
  itemRequested: string;
  createdDate: string;
  lastEditedDate: string | null;
  status: RequestStatus;
}
