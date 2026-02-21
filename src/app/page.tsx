import WallpaperWrapper from "@/components/custom/wallpaperWrapper";
import { getImages } from "@/lib/actions/getImages";

export default async function Home() {

  const imgs = await getImages()

  return (
    <WallpaperWrapper imgs={imgs} />
  );
}
