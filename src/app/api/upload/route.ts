// app/api/upload/route.ts

import { NextResponse } from "next/server"
import { nanoid } from "nanoid";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  // Get form data (you can also parse JSON, but for multipart you need FormData)
  const formData = await request.formData()

  // Extract title, tags, and image from the form data
  const title = formData.get("title") as string
  const tags = JSON.parse(formData.get("tags") as string) as string[] // Parse the tags string into an array
  const image = formData.get("image") as Blob // The image file (can be uploaded to a server)

  const id = nanoid(7);

  const cookie = cookies()
  const supabase = await createClient(cookie)

  const { data, error } = await supabase.storage.from('images').upload(id, image, {
    cacheControl: '3600',
    upsert: false
  })

  if (error) {
    return NextResponse.error()
  }

  const { error: metadataError } = await supabase.from('metadata').insert({
    id: id,
    title: title,
    tags: tags,
    full_path: data.fullPath
  })

  if (metadataError) {
    supabase.storage.from('images').remove([id])
    return NextResponse.error()
  }

  // Returning the same data back as the response (as a JSON object)
  return NextResponse.json({
    title,
    tags,
    imageUrl: data.path, // Normally this would be the URL of the uploaded image if you save it
  })
}
