"use client";

import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { useCallback, useEffect, useState } from "react";
import Table from "@/components/tables/Table";
import { ItemRequest } from "@/lib/types/itemRequest";
import { RequestStatus } from "@/lib/types/request";

/**
 * Legacy front-end code from Crisis Corner's previous admin page!
 */
export default function ItemRequestsPage() {
  const [name, setName] = useState<string>("");
  const [item, setItem] = useState<string>("");
  const [itemList, setItemList] = useState<ItemRequest[]>([]);

  const [page, setPage] = useState<number>(1);
  const [activeStatus, setActiveStatus] = useState<string>('All');
  const [totalRecords, setTotalRecords] = useState<number>(0);

  const fetchRequest = useCallback(async () => {
    const getStatus = activeStatus.toLowerCase();
    const res = await fetch(`/api/request?${getStatus === 'all' ? '' : `status=${getStatus}&`}page=${page}`);
    if (!res.ok) {
      console.error(`Failed to load requests: ${res.status}`);
      return;
    }
    const response = await res.json();
    setItemList(response.data);
    setTotalRecords(response.totalRecords);
  }, [page, activeStatus]);

  useEffect(() => {
    fetchRequest();
  }, [fetchRequest]);

  const onStatusChange = async (ids: string[], status: RequestStatus) => {
    if (ids.length === 0) return;
    // Edit the data inside the database
    const res = await fetch(`/api/request`, {
      method: 'PATCH',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: ids, status: status })
    })
    if (!res.ok) {
        console.error(`Failed to update request: ${res.status}`);
        return;
    }
    const updated: ItemRequest[] = await res.json();
    const updatedById = new Map(updated.map((request) => [request._id, request]));
    const merged = itemList.map((request) => updatedById.get(request._id) ?? request);
    const visible = activeStatus === 'All'
      ? merged
      : merged.filter((request) => request.status === activeStatus.toLowerCase());
    setItemList(visible);
    setTotalRecords((total) => total - (merged.length - visible.length));
  }

  const onDeleteChange = async (ids: string[]) => {
    if (ids.length === 0) return;
    // Remove the data from the database
    const res = await fetch(`/api/request`, {
      method: 'DELETE',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: ids })
    })
    if (!res.ok) {
        console.error(`Failed to delete request: ${res.status}`);
        return;
    }
    await fetchRequest();
  }

  const onAddItem = async (name: string, item: string) => {
    const res = await fetch(`/api/request`, {
      method: 'PUT',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestorName: name, itemRequested: item })
    })
    if (!res.ok) {
        console.error(`Failed to add request: ${res.status}`);
        return;
    }
    await fetchRequest();
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 px-4 flex flex-col items-center gap-6">
      <h2 className="font-bold">Approve Items</h2>

      <div className="flex flex-col w-full max-w-md gap-4">
        <Input
          type="text"
          placeholder="Type name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          label="Name"
        />
        <Input
          type="text"
          placeholder="Type item"
          value={item}
          onChange={(e) => setItem(e.target.value)}
          label="Item"
        />
        <Button onClick={() => onAddItem(name, item)}>Add Request</Button>
      </div>
      <div className="flex w-full min-w-0 flex-col gap-3">
        <Table requests={itemList} page={page} activeStatus={activeStatus} totalRecords={totalRecords} 
          onStatusChange={onStatusChange} onPageChange={setPage} onActiveStatusChange={setActiveStatus}
          onDeleteChange={onDeleteChange} />
      </div>
    </div>
  );
}
