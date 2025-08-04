// src/components/common/ImageUploader.tsx
'use client';

import { useState, useEffect } from 'react'; // Import useEffect
import { UploadCloud, X, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface ImageUploaderProps {
  // THE FIX: Add a new optional prop to accept existing images
  initialImageUrls?: string[];
  onUploadComplete: (urls: string[]) => void;
  onUploadRemove: (url: string) => void;
}

export default function ImageUploader({ onUploadComplete, onUploadRemove, initialImageUrls = [] }: ImageUploaderProps) {
  // THE FIX: Initialize the state with the `initialImageUrls` prop
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>(initialImageUrls);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // THE FIX: Use useEffect to notify the parent form of the initial state
  useEffect(() => {
    onUploadComplete(initialImageUrls);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setError(null);
    
    const newUrls = [...uploadedImageUrls];

    try {
      for (const file of Array.from(files)) {
        const signResponse = await fetch('/api/sign-image', { method: 'POST' });
        if (!signResponse.ok) throw new Error('Failed to get signature.');
        
        const signData = await signResponse.json();
        const { signature, timestamp, api_key, cloud_name, folder } = signData;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('api_key', api_key);
        formData.append('signature', signature);
        formData.append('timestamp', timestamp);
        formData.append('folder', folder);

        const uploadUrl = `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`;
        const uploadResponse = await fetch(uploadUrl, {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) throw new Error('Upload to Cloudinary failed.');

        const uploadData = await uploadResponse.json();
        newUrls.push(uploadData.secure_url);
      }

      setUploadedImageUrls(newUrls);
      onUploadComplete(newUrls);

    } catch {
      setError('An error occurred during upload. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleRemoveImage = (urlToRemove: string) => {
    const updatedUrls = uploadedImageUrls.filter(url => url !== urlToRemove);
    setUploadedImageUrls(updatedUrls);
    onUploadRemove(urlToRemove);
  };

  return (
    <div className="w-full space-y-4">
      {uploadedImageUrls.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {uploadedImageUrls.map((url) => (
            <div key={url} className="relative aspect-square overflow-hidden rounded-lg">
              <Image src={url} alt="Uploaded preview" fill className="object-cover" />
              <button 
                type="button" 
                onClick={() => handleRemoveImage(url)}
                className="absolute top-1 right-1 rounded-full bg-background/80 p-1 text-foreground shadow-md transition-colors hover:bg-red-500 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <label className="relative flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-secondary p-8 text-center transition-colors hover:border-primary">
        {isUploading ? (
          <Loader2 className="h-12 w-12 animate-spin text-foreground/50" />
        ) : (
          <UploadCloud className="h-12 w-12 text-foreground/50" />
        )}
        <p className="mt-2 font-semibold text-foreground">
          {isUploading ? 'Uploading...' : 'Click to add images'}
        </p>
        <p className="text-sm text-foreground/70">Select one or more files</p>
        <input
          type="file"
          onChange={handleFileChange}
          className="absolute h-full w-full opacity-0"
          accept="image/png, image/jpeg, image/gif"
          disabled={isUploading}
          multiple
        />
      </label>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}