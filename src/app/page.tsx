"use client";

import Link from "next/link";
import { useState } from "react";
export default function Home() {
  const [username, setUsername] = useState("");
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <input
          type="text"
          placeholder="Search username"
          className="input input-bordered max-w-xs"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Link href={`/user/${username}`} className="btn btn-primary">
          Search
        </Link>
      </main>
    </div>
  );
}
