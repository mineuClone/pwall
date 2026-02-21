import { getImages } from "@/lib/actions/getImages";
// import { createClient } from "@/lib/supabase/server";
// import { cookies } from 'next/headers';

export default async function Page() {
  // const cookie = cookies()
  // const supabase = await createClient(cookie)

  const images = await getImages()

  return (
    <div>
      <h1>metadata</h1>
      <pre>{JSON.stringify(images, null, 2)}</pre>
    </div>
  )
}
