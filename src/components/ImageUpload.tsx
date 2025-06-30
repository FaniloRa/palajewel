'use client';
import { useState } from 'react';
import { UploadCloud, X, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { getSignature } from '@/app/actions/cloudinaryActions';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
  id: string;
  name: string;
  onUpload?: (url: string) => void;
  initialUrl?: string;
}

export default function ImageUpload({ id, name, onUpload, initialUrl = '' }: ImageUploadProps) {
  const [imageUrl, setImageUrl] = useState(initialUrl);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);

    try {
      const { signature, timestamp } = await getSignature();
      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);
      formData.append('signature', signature);
      formData.append('timestamp', timestamp.toString());
      
      const endpoint = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!}/image/upload`;
      
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const url = data.secure_url;
        setImageUrl(url);
        onUpload?.(url);
        toast({ title: "Succès", description: "Image téléversée avec succès." });
      } else {
          const errorData = await response.json();
          console.error('Cloudinary upload error:', errorData);
          toast({ title: "Erreur", description: "Échec du téléversement de l'image.", variant: "destructive" });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({ title: "Erreur", description: "Une erreur est survenue.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = () => {
      setImageUrl('');
      onUpload?.('');
  }

  return (
    <div className="flex flex-col gap-2">
        {imageUrl ? (
            <div className="relative w-full h-48 rounded-md overflow-hidden border">
                <Image src={imageUrl} alt="Aperçu de l'image" fill style={{ objectFit: 'cover' }} />
                <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    className="absolute top-2 right-2 h-7 w-7"
                    onClick={handleRemoveImage}
                >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Supprimer l'image</span>
                </Button>
            </div>
        ) : (
            <label htmlFor={id} className="w-full h-48 border-2 border-dashed border-muted-foreground/50 rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-muted transition-colors">
                {loading ? (
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                ) : (
                    <>
                        <UploadCloud className="h-8 w-8 text-muted-foreground" />
                        <span className="mt-2 text-sm text-muted-foreground">Téléverser</span>
                    </>
                )}
                <input
                    id={id}
                    name={`${id}-file`}
                    type="file"
                    className="sr-only"
                    onChange={handleFileChange}
                    accept="image/png, image/jpeg, image/gif, image/webp"
                    disabled={loading}
                />
            </label>
        )}
        <input type="hidden" name={name} value={imageUrl} />
    </div>
  );
}
