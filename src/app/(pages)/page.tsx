"use server"
import HotelSearchApp from "@/components/pages/Home";
import { ErrorResponse, fetchService } from "@/utils/fetchService";
import { HotelListResponse } from "@/utils/types";
import { redirect } from "next/navigation";

export default async function Home({ searchParams }: { searchParams: Record<string, string> }) {
  const data = await searchParams;

  const isSearch = Object.keys(data).length > 0 && Object.values(data).every(value => value !== "");
  const response = isSearch 
  ? await fetchService(`/hotels/search?${new URLSearchParams(data)}`) as (HotelListResponse[] | ErrorResponse) 
  : await fetchService("/hotels") as (HotelListResponse[] | ErrorResponse);

  if (response && (response as ErrorResponse).status === 401) {
    redirect("/logout");
    return null; // Prevent rendering if unauthorized
  }

  return (
    <HotelSearchApp hotels={response as HotelListResponse[]} />
  );
}
