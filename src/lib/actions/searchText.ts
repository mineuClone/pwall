"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export const searchText = async (query: string) => {
    const cookieStore = cookies()
    const supabase = await createClient(cookieStore)

    if (!query) {
        return [];
    }

    const tokens = query.split(" ")
    const filter: string[] = []

    for (const token of tokens) {
        filter.push(`tags.cs.${JSON.stringify([token])}`)
    }


    const { data, error } = await supabase
        .from("metadata")
        .select()
        .or(`title.ilike.%${query}%,${filter.join(",")}`)

    console.log("filter : ", filter.join(","));


    console.log("data : ", data);

    if (error) {
        console.error(error);
        return [];
    }

    return data ?? [];
};
