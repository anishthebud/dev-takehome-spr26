import { HTTP_STATUS_CODE } from "../types/apiResponse";

export abstract class InputException extends Error {
  code: HTTP_STATUS_CODE;
  constructor(message: string, code: HTTP_STATUS_CODE) {
    super(message);
    this.code = code;
  }
}

export class InvalidInputError extends InputException {
  constructor(problem: string) {
    super(
      `Invalid input provided in ${problem}.`,
      HTTP_STATUS_CODE.BAD_REQUEST
    );
  }
}

export class InvalidPaginationError extends InputException {
  constructor(currPage: number, pageSize: number) {
    super(
      `Invalid pagination configuration with page number: ${currPage} and size: ${pageSize}.`,
      HTTP_STATUS_CODE.BAD_REQUEST
    );
  }
}

export class ItemNotFoundError extends InputException {
  constructor(problem: string) {
    super(
      `Item not found with ID: ${problem}.`,
      HTTP_STATUS_CODE.BAD_REQUEST
    );
  }
}
