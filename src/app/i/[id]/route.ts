import { NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = cookies()
  const supabase = await createClient(cookieStore)

  const { id } = await params

  const { data, error } = await supabase
    .storage
    .from("images")
    .download(id)

  if (error || !data) {
    return new Response("Not found", { status: 404 })
  }

  return new Response(data.stream(), {
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "public, max-age=31536000, immutable"
    }
  })
}
