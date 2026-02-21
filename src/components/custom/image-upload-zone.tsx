"use client"

import type React from "react"

import { useState } from "react"

interface ImageUploadZoneProps {
  onFileSelect: (file: File) => void
  selectedFile: File | null
  imagePreview: string | null
}

export default function ImageUploadZone({ onFileSelect, selectedFile, imagePreview }: ImageUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validateFile = (file: File) => {
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    if (!validTypes.includes(file.type)) {
      setError("INVALID FILE TYPE: Please upload a JPEG, PNG, GIF, or WebP image.")
      return false
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("FILE TOO LARGE: Maximum file size is 10MB.")
      return false
    }
    setError(null)
    return true
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      if (validateFile(file)) {
        onFileSelect(file)
      }
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items
    if (items) {
      for (const item of items) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile()
          if (file && validateFile(file)) {
            onFileSelect(file)
          }
          break
        }
      }
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (files && files.length > 0) {
      const file = files[0]
      if (validateFile(file)) {
        onFileSelect(file)
      }
    }
  }

  return (
    <div className="space-y-3">
      {/* Drag and Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onPaste={handlePaste}
        className={`border-4 transition-all p-5 cursor-pointer ${
          isDragging ? "border-accent bg-muted" : "border-foreground bg-background"
        } ${selectedFile ? "opacity-50 pointer-events-none" : ""}`}
      >
        <label className="block">
          <input type="file" accept="image/*" onChange={handleFileInput} className="hidden" disabled={!!selectedFile} />
          <div className="text-center">
            <p className="text-lg md:text-xl font-bold uppercase mb-2 text-balance">
              {isDragging ? "Drop Image Here" : "Drag & Drop or Click"}
            </p>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">JPEG, PNG, GIF, WebP (Max 10MB)</p>
          </div>
        </label>
      </div>

      {/* Paste Zone */}
      <div
        onPaste={handlePaste}
        className={`border-4 border-dashed border-muted p-3 text-center ${
          selectedFile ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Or paste from clipboard</p>
      </div>

      {/* Error State */}
      {error && (
        <div className="border-4 border-destructive bg-destructive/10 p-3">
          <p className="text-xs font-bold uppercase text-destructive mb-1">⚠ Error</p>
          <p className="text-sm font-bold">{error}</p>
        </div>
      )}

      {/* Image Preview */}
      {imagePreview && selectedFile && (
        <div className="border-4 border-foreground p-3 space-y-2">
          <div className="flex justify-between items-start">
            <p className="text-xs uppercase tracking-widest font-bold">Preview</p>
            <button
              onClick={() => {
                onFileSelect(null as any)
              }}
              className="text-xs font-bold uppercase px-2 py-1 border-2 border-foreground hover:bg-muted transition-colors"
            >
              Remove
            </button>
          </div>
          <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="w-full h-auto max-h-48 object-cover" />
          <p className="text-xs uppercase text-muted-foreground">
            {selectedFile.name} • {(selectedFile.size / 1024).toFixed(2)} KB
          </p>
        </div>
      )}
    </div>
  )
}
