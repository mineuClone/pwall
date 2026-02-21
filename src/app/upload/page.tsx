"use client"

import { useState } from "react"
import ImageUploadZone from "@/components/custom/image-upload-zone"
import UploadForm from "@/components/custom/upload-form"

export default function page() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploadedData, setUploadedData] = useState<{
    title: string
    tags: string[]
    imageUrl: string
  } | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleUpload = async (title: string, tags: string[]) => {
    if (!selectedFile) return

    setIsUploading(true)

    const formData = new FormData()
    formData.append("title", title)
    formData.append("tags", JSON.stringify(tags)) 
    formData.append("image", selectedFile)

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })
      const result = await response.json()

      // Handle the API response here
      console.log("Upload successful:", result)
      setUploadedData({
        title,
        tags,
        imageUrl: imagePreview || "",  // TODO : uploaded image url from the database
      })
    } catch (error) {
      console.error("Upload failed:", error)
    } finally {
      setIsUploading(false)
    }
  }


  return (
    <main className="min-h-screen h-screen overflow-hidden bg-background text-foreground p-3 md:p-6">
      <div className="h-full flex flex-col max-w-6xl mx-auto">
        {!uploadedData ? (
          <>
            <div className="border-b-4 border-foreground pb-3 mb-4 shrink-0">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-1">UPLOAD</h1>
            </div>

            <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-4">
              <section className="overflow-y-auto">
                <h2 className="text-lg font-bold mb-3 uppercase shrink-0">Select Image</h2>
                <ImageUploadZone
                  onFileSelect={handleFileSelect}
                  selectedFile={selectedFile}
                  imagePreview={imagePreview}
                />
              </section>

              {selectedFile && (
                <section className="overflow-y-auto">
                  <h2 className="text-lg font-bold mb-3 uppercase shrink-0">Image Details</h2>
                  <UploadForm onSubmit={handleUpload} isLoading={isUploading} selectedFile={selectedFile} />
                </section>
              )}
            </div>
          </>
        ) : (
          <div className="border-4 border-foreground p-4 md:p-6 overflow-y-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-accent uppercase">Upload Successful</h2>
            <div className="space-y-4">
              {uploadedData.imageUrl && (
                <div className="border-4 border-foreground p-2">
                  <img
                    src={uploadedData.imageUrl || "/placeholder.svg"}
                    alt={uploadedData.title}
                    className="w-full h-auto max-h-64 object-cover"
                  />
                </div>
              )}

              <div className="space-y-3">
                <div className="border-l-4 border-accent pl-4">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Title</p>
                  <p className="text-lg font-bold">{uploadedData.title}</p>
                </div>

                <div className="border-l-4 border-accent pl-4">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {uploadedData.tags.map((tag, idx) => (
                      <div key={idx} className="border-2 border-foreground px-3 py-1 bg-muted">
                        <p className="font-bold text-xs uppercase">{tag}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setUploadedData(null)}
                className="w-full bg-accent text-accent-foreground border-4 border-accent px-6 py-3 font-bold text-base uppercase tracking-wide hover:bg-opacity-90 transition-all active:scale-95"
              >
                Upload Another Image
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
