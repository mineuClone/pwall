"use client"
import Wallpaper, { Info, Tags, TagItem } from "@/components/custom/wallpaper";
import { SearchResultContext } from "@/components/custom/Home";
import { useContext } from "react";

function WallpaperWrapper({ imgs }: { imgs: any[] }) {
    const ctx = useContext(SearchResultContext)

    if (ctx) {
        const { searchResults } = ctx
        if (searchResults.length > 0) {
            imgs = searchResults
        }
    }

    return (
        <div className="bg-red columns-3 gap-0 *:m-1 p-1">
            {imgs.map((metadata) => (
                <Wallpaper href={`i/${metadata.id}`} key={metadata.id} img={`/i/${metadata.id}`} >
                    <Info>
                        {metadata.title}
                    </Info>
                    <Tags>
                        {metadata.tags.map((tag: string) => (
                            <TagItem key={metadata.tags.indexOf(tag)} tag={tag} />
                        ))}
                    </Tags>
                </Wallpaper>
            ))}
        </div>
    )
}

export default WallpaperWrapper