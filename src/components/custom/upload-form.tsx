"use client"

import type React from "react"

import { useState } from "react"

interface UploadFormProps {
  onSubmit: (title: string, tags: string[]) => void
  isLoading: boolean
  selectedFile: File | null
}

export default function UploadForm({ onSubmit, isLoading, selectedFile }: UploadFormProps) {
  const [title, setTitle] = useState("")
  const [tagsInput, setTagsInput] = useState("")
  const [errors, setErrors] = useState<{
    title?: string
    tags?: string
  }>({})

  const validateForm = () => {
    const newErrors: { title?: string; tags?: string } = {}

    if (!title.trim()) {
      newErrors.title = "TITLE IS REQUIRED"
    }

    if (!tagsInput.trim()) {
      newErrors.tags = "AT LEAST ONE TAG IS REQUIRED"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return false
    }

    setErrors({})
    return true
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    const tags = tagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0)

    onSubmit(title, tags)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title Input */}
      <div className="space-y-2">
        <label className="block text-xs uppercase tracking-widest font-bold">Image Title *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isLoading}
          className="w-full border-4 border-foreground px-4 py-3 bg-background text-foreground text-sm font-bold uppercase placeholder:text-muted-foreground focus:outline-none focus:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="Enter image title"
        />
        {errors.title && (
          <div className="border-4 border-destructive bg-destructive/10 p-2">
            <p className="font-bold text-destructive text-xs">{errors.title}</p>
          </div>
        )}
      </div>

      {/* Tags Input */}
      <div className="space-y-2">
        <label className="block text-xs uppercase tracking-widest font-bold">Tags (Comma-Separated) *</label>
        <textarea
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          disabled={isLoading}
          rows={2}
          className="w-full border-4 border-foreground px-4 py-3 bg-background text-foreground text-sm font-bold uppercase placeholder:text-muted-foreground focus:outline-none focus:bg-muted disabled:opacity-50 disabled:cursor-not-allowed resize-none"
          placeholder="e.g. architecture, brutalism, modern"
        />
        <p className="text-xs uppercase text-muted-foreground">Comma-separated</p>
        {errors.tags && (
          <div className="border-4 border-destructive bg-destructive/10 p-2">
            <p className="font-bold text-destructive text-xs">{errors.tags}</p>
          </div>
        )}
      </div>

      {/* File Info */}
      {selectedFile && (
        <div className="border-l-4 border-accent pl-3 py-2">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Selected File</p>
          <p className="font-bold text-sm">{selectedFile.name}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-accent text-accent-foreground border-4 border-accent px-6 py-3 font-bold text-base uppercase tracking-wide hover:bg-opacity-90 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Uploading..." : "Upload Image"}
      </button>
    </form>
  )
}
