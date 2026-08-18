"use client";

import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Dropdown from "@/components/atoms/Dropdown";
import { useEffect, useState } from "react";
import Table from "@/components/tables/Table";
import mockItemRequests from "../api/mock/data";
import { getItems } from "@/server/request";
import { ItemRequest } from "@/lib/types/itemRequest";
import { RequestStatus } from "@/lib/types/request";

/**
 * Legacy front-end code from Crisis Corner's previous admin page!
 */
export default function ItemRequestsPage() {
  const [item, setItem] = useState<string>("");
  const [itemList, setItemList] = useState<ItemRequest[]>([]);

  useEffect(() => {
    const fetchRequest = async () => {
      const res = await fetch(`/api/request`);
      if (!res.ok) {
        console.error(`Failed to load requests: ${res.status}`);
        return;
      }
      setItemList(await res.json());
    }
    fetchRequest();
  }, []);

  const onStatusChange = async (_id: string, status: RequestStatus) => {
    // Edit the data inside the database
    const res = await fetch(`/api/request`, {
      method: 'PATCH',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _id: _id, status: status })
    })
    if (!res.ok) {
        console.error(`Failed to update request: ${res.status}`);
        return;
    }
    // Update the showing item list with the new data
    const updated = await res.json();
    setItemList((list) => 
      list.map((request) => (request._id === updated._id ? updated : request))
    );
  }

  /*
  const handleAddItem = (): void => {
    if (item.trim()) {
      setItemList((prevList) => [...prevList, item.trim()]);
      setItem("");
    }
  };
  */

  return (
    <div className="max-w-md mx-auto mt-8 flex flex-col items-center gap-6">
      <h2 className="font-bold">Approve Items</h2>

      <div className="flex flex-col w-full gap-4">
        <Input
          type="text"
          placeholder="Type an item"
          value={item}
          onChange={(e) => setItem(e.target.value)}
          label="Item"
        />
        <Button>Approve</Button>
      </div>
      <div className="flex flex-col gap-3">
        <h2>Item Requests</h2>
        <Table requests={itemList} onStatusChange={onStatusChange} />
      </div>
    </div>
  );
}
