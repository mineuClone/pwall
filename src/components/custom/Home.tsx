"use client"
import Navbar from './navbar'
import { createContext, useState } from "react";


export interface MetadataRow {
    id: string;
    title: string;
    tags: string[];
    created_at: string;
}


interface SearchResultContextType {
    searchResults: MetadataRow[];
    setSearchResults: React.Dispatch<React.SetStateAction<MetadataRow[]>>;
}


export const SearchResultContext = createContext<SearchResultContextType | undefined>(undefined)

function Home({ children }: { children: React.ReactNode }) {

    const [searchResults, setSearchResults] = useState<MetadataRow[]>([])

    return (
        <SearchResultContext.Provider value={{ searchResults: searchResults, setSearchResults: setSearchResults }}>
            <Navbar />
            {children}
        </SearchResultContext.Provider>
    )
}

export default Home