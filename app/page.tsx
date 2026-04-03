"use client";
import { GlobalAlert } from "@/component/AlertComponent";
import { ColumnsTasks } from "@/component/columns";
import { Header } from "@/component/header";
import { Box } from "@mui/material";

export default function Home() {
 
  return (
    <main className="flex min-h-screen flex-col items-start justify-between bg-gray-300">
      <Box  className="w-full flex flex-col gap-5 px-2">
        <Header/>
        <ColumnsTasks/>
        <GlobalAlert/>
      </Box>
    </main>
  );
}
