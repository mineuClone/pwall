"use client"
import { searchText } from '@/lib/actions/searchText'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useContext } from 'react'
import { SearchResultContext } from "@/components/custom/Home";


function Navbar() {

  const ctx = useContext(SearchResultContext)
  if (!ctx) return;
  const { setSearchResults } = ctx

  const isActive = (path: string) => usePathname() === path

  const [query, setQuery] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!query.trim()) {
      setSearchResults([]);
      return;
    };

    const results = await searchText(query);
    setSearchResults(results)
    console.log("results:", results);
  };

  return (
    <nav className='flex justify-between p-2'>
      <h1 className='text-2xl font-black'>PWall</h1>
      <form onSubmit={handleSubmit}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="outline-none border-2 p-1"
          type="search"
          placeholder="Search..."
        />
      </form>
      <div className='flex gap-2'>
        <Link className={`${isActive("/") ? "font-black" : ""}`} prefetch href="/">Home</Link>
        <Link className={`${isActive("/upload") ? "font-black" : ""}`} prefetch href="/upload">Upload</Link>
      </div>
    </nav>
  )
}

export default Navbar