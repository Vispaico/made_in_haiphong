// src/components/common/ImageUploader.tsx
'use client';

import { useState } from 'react';
import { UploadCloud, X } from 'lucide-react';
import Image from 'next/image';

interface ImageUploaderProps {
  onUploadComplete: (url: string) => void;
  onUploadRemove: () => void;
}

export default function ImageUploader({ onUploadComplete, onUploadRemove }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
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
      // THE FIX: The incorrect 'source' parameter has been removed to match the new signature.

      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`;
      const uploadResponse = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        // More detailed error logging for debugging
        const errorData = await uploadResponse.json();
        console.error("Cloudinary upload failed:", errorData);
        throw new Error('Upload to Cloudinary failed.');
      }

      const uploadData = await uploadResponse.json();
      const secureUrl = uploadData.secure_url;

      setUploadedImageUrl(secureUrl);
      onUploadComplete(secureUrl);

    } catch {
      setError('An error occurred during upload. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleRemoveImage = () => {
    setUploadedImageUrl(null);
    onUploadRemove();
  };

  return (
    <div className="w-full">
      {uploadedImageUrl ? (
        <div className="relative w-full rounded-lg border-2 border-dashed border-secondary p-4">
          <Image 
            src={uploadedImageUrl} 
            alt="Uploaded preview" 
            width={500}
            height={300}
            className="h-auto w-full rounded-md" 
          />
          <button 
            type="button" 
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 rounded-full bg-background/80 p-1 text-foreground shadow-md transition-colors hover:bg-red-500 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <label className="relative flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-secondary p-8 text-center transition-colors hover:border-primary">
          <UploadCloud className="h-12 w-12 text-foreground/50" />
          <p className="mt-2 font-semibold text-foreground">
            {isUploading ? 'Uploading...' : 'Click to add an image'}
          </p>
          <p className="text-sm text-foreground/70">PNG, JPG, or GIF</p>
          <input
            type="file"
            onChange={handleFileChange}
            className="absolute h-full w-full opacity-0"
            accept="image/png, image/jpeg, image/gif"
            disabled={isUploading}
          />
        </label>
      )}
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}