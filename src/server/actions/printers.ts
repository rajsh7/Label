"use server"

import { createUserClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getPrinters() {
  const { supabase } = await createUserClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { data: null, error: "Not authenticated" }

  const { data, error } = await supabase
    .from("printers")
    .select("*")
    .eq("user_id", user.id)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false })

  return { data, error }
}

export async function addPrinter(formData: {
  name: string
  printer_type: string
  connection_type: string
  network_ip?: string
  paper_size?: string
}) {
  const { supabase } = await createUserClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { data: null, error: "Not authenticated" }

  const { data, error } = await supabase
    .from("printers")
    .insert({
      user_id: user.id,
      ...formData,
      status: "offline"
    })
    .select()
    .single()

  revalidatePath("/dashboard/printers")
  return { data, error }
}

export async function updatePrinter(id: string, updates: {
  name?: string
  paper_size?: string
  status?: string
  is_default?: boolean
  labels_remaining?: number
}) {
  const { supabase } = await createUserClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { data: null, error: "Not authenticated" }

  if (updates.is_default) {
    await supabase
      .from("printers")
      .update({ is_default: false })
      .eq("user_id", user.id)
  }

  const { data, error } = await supabase
    .from("printers")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single()

  revalidatePath("/dashboard/printers")
  return { data, error }
}

export async function deletePrinter(id: string) {
  const { supabase } = await createUserClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { error: "Not authenticated" }

  const { error } = await supabase
    .from("printers")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)

  revalidatePath("/dashboard/printers")
  return { error }
}

export async function getPrintQueue() {
  const { supabase } = await createUserClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { data: null, error: "Not authenticated" }

  const { data, error } = await supabase
    .from("print_queue")
    .select(`
      *,
      printer:printers(name)
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return { data, error }
}

export async function addToPrintQueue(formData: {
  printer_id: string
  file_name: string
  copies?: number
}) {
  const { supabase } = await createUserClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { data: null, error: "Not authenticated" }

  const { data, error } = await supabase
    .from("print_queue")
    .insert({
      user_id: user.id,
      ...formData,
      status: "queued"
    })
    .select()
    .single()

  revalidatePath("/dashboard/printers")
  return { data, error }
}

export async function updatePrintJob(id: string, updates: {
  status?: string
  progress?: number
  error_message?: string
}) {
  const { supabase } = await createUserClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { data: null, error: "Not authenticated" }

  const { data, error } = await supabase
    .from("print_queue")
    .update(updates)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single()

  revalidatePath("/dashboard/printers")
  return { data, error }
}

export async function deletePrintJob(id: string) {
  const { supabase } = await createUserClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { error: "Not authenticated" }

  const { error } = await supabase
    .from("print_queue")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)

  revalidatePath("/dashboard/printers")
  return { error }
}
