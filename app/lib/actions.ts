"use server";

import { User } from "./definitions";

const baseUrl = "http://localhost:8000/users";
const ITEMS_PER_PAGE = 6;

export async function getAllUsers(currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    const res = await fetch(
      `${baseUrl}?limit=${ITEMS_PER_PAGE}&offset=${offset}`
    );
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return (await res.json()) as User[];
  } catch (error) {
    console.error("API Error:", error);
  }
}
