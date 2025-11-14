"use client";

import React from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: () => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder = "Search...",
}: SearchBarProps) {
  return (
    <div className="flex items-center border-2 rounded-lg mb-4 overflow-hidden w-full">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-grow p-2 outline-none"
        onKeyDown={(e) => e.key === "Enter" && onSearch?.()}
      />
      <button
        onClick={onSearch}
        className="text-gray-400 hover:text-gray-700 px-4 py-2 "
      >
        <Search className="w-5 h-5"/>
      </button>
    </div>
  );
}
