import { HTTP_STATUS_CODE, ResponseType } from "@/lib/types/apiResponse";

import { ServerResponseBuilder } from "@/lib/builders/serverResponseBuilder";
import { InputException } from "@/lib/errors/inputExceptions";
import { addItem, getItems } from "@/server/request";

export async function GET(request: Request) {
  const url = new URL(request.url);
  // const status: string | null = url.searchParams.get("status");
  const page = parseInt(url.searchParams.get("page") || "1");
  try {
    const items = await getItems(page);
    return new Response(JSON.stringify(items), {
      status: HTTP_STATUS_CODE.OK,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    if (e instanceof InputException) {
      return new ServerResponseBuilder(ResponseType.INVALID_INPUT).build();
    }
    return new ServerResponseBuilder(ResponseType.UNKNOWN_ERROR).build();
  }
}

export async function PUT(request: Request) {
    try {
        const req = await request.json();
        const createdItem = await addItem(req);
        return new Response(JSON.stringify(createdItem), {
            status: HTTP_STATUS_CODE.CREATED,
            headers: { "Content-Type": "application/json" },
        });
    } catch (e) {
    if (e instanceof InputException) {
      return new ServerResponseBuilder(ResponseType.INVALID_INPUT).build();
    }
    return new ServerResponseBuilder(ResponseType.UNKNOWN_ERROR).build();
  }
}
