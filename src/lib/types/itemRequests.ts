import { RequestStatus } from "./request";

export interface ItemRequest {
  requestorName: string;
  itemRequested: string;
  createdDate: Date;
  lastEditedDate: Date | null;
  status: RequestStatus;
}
