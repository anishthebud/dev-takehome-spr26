"use client";

import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { useEffect, useState } from "react";
import Table from "@/components/tables/Table";
import { ItemRequest } from "@/lib/types/itemRequest";
import { RequestStatus } from "@/lib/types/request";

/**
 * Legacy front-end code from Crisis Corner's previous admin page!
 */
export default function ItemRequestsPage() {
  const [item, setItem] = useState<string>("");
  const [itemList, setItemList] = useState<ItemRequest[]>([]);

  const [page, setPage] = useState<number>(1);
  const [activeStatus, setActiveStatus] = useState<string>('All');
  const [totalRecords, setTotalRecords] = useState<number>(0);

  useEffect(() => {
    const fetchRequest = async () => {
      const getStatus = activeStatus.toLowerCase();
      const res = await fetch(`/api/request?${getStatus === 'all' ? '' : `status=${getStatus}&`}page=${page}`);
      if (!res.ok) {
        console.error(`Failed to load requests: ${res.status}`);
        return;
      }
      const response = await res.json();
      setItemList(response.data);
      setTotalRecords(response.totalRecords);
    }
    fetchRequest();
  }, [page, activeStatus]);

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
    <div className="w-full max-w-4xl mx-auto mt-8 px-4 flex flex-col items-center gap-6">
      <h2 className="font-bold">Approve Items</h2>

      <div className="flex flex-col w-full max-w-md gap-4">
        <Input
          type="text"
          placeholder="Type an item"
          value={item}
          onChange={(e) => setItem(e.target.value)}
          label="Item"
        />
        <Button>Approve</Button>
      </div>
      <div className="flex w-full min-w-0 flex-col gap-3">
        <h2>Item Requests</h2>
        <Table requests={itemList} page={page} activeStatus={activeStatus} totalRecords={totalRecords} 
          onStatusChange={onStatusChange} onPageChange={setPage} onActiveStatusChange={setActiveStatus} />
      </div>
    </div>
  );
}
