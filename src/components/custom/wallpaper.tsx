"use client"
import Image from 'next/image'
import { Search, Tag } from "lucide-react";
import React, { createContext, useState, useContext } from 'react';
import Link from 'next/link';
import { Url } from 'next/dist/shared/lib/router/router';


interface Props {
  img: string,
  children?: React.ReactNode
  className?: string
  href: Url
}


interface HiddenContextType {
  isHidden: boolean,
  setHidden: React.Dispatch<React.SetStateAction<boolean>>
}

export const HiddenContext = createContext<HiddenContextType | undefined>(undefined);

function Wallpaper({ img, className, children, href }: Props) {
  const [isHidden, setHidden] = useState(true)

  return (
    <div className={`${className} break-inside-avoid group relative border-2 border-primary overflow-hidden`}>
      <Link href={href} prefetch className='block'>
        <Image
          src={img}
          alt="image"
          loading='lazy'
          width={640}
          height={480}
          className="block w-full h-auto"
        />
      </Link>

      <HiddenContext.Provider value={{ isHidden, setHidden }}>
        {children}
      </HiddenContext.Provider>
    </div >
  )
}

function Info({ children, className }: { children: React.ReactNode, className?: string }) {
  const context = useContext(HiddenContext)
  if (!context) {
    throw new Error("Info must be used within a HiddenContext Provider");
  }
  const { isHidden, setHidden } = context
  const handleClick = () => {
    setHidden(!isHidden)
    console.log(`is hidden : ${isHidden}`);

  }
  return (
    <span className={`flex will-change-transform group-hover:translate-y-0 translate-y-7 border-t-2 border-white transition-transform px-1 bg-black/50 absolute w-full z-1 bottom-0 ${className}`}>
      {children}
      <Tag onClick={handleClick} className=" ml-auto aspect-1 w-4 cursor-pointer hover:text-green-600 drop-shadow-2xl transition-colors will-change-auto" />
    </span>
  )
}

function Tags({ children }: { children: React.ReactNode }) {
  const ctx = useContext(HiddenContext)
  if (!ctx) {
    throw new Error("Tags must be used within a HiddenContext Provider");
  }
  const { isHidden } = ctx
  return (
    <div className={`inset-1 pointer-events-none absolute flex content-start gap-1 flex-wrap ${isHidden ? "hidden" : ""}`}>
      {children}
    </div>
  )
}

function TagItem({ tag }: { tag: string }) {
  return (
    <span className="w-fit pointer-events-auto text-sm px-1 flex-none flex items-center justify-center gap-1 bg-black/40 text-primary rounded">
      {tag}
      <Search className="aspect-square w-3" />
    </span>
  )
}

export { Info, Tags, TagItem }

export default Wallpaper