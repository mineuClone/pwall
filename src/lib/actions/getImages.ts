"use server"

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export const getImages = async () => {
    const cookie = cookies()
    const supabase = await createClient(cookie)
    const { data: images, error } = await supabase.from('metadata').select()
    if (error) {
        console.error(error);
        return [];
    }
    return images ?? []
}