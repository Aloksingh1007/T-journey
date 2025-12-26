import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  label?: string;
  files?: File[];
  images?: File[];
  onChange?: (files: File[]) => void;
  onImagesChange?: (images: File[]) => void;
  maxFiles?: number;
  maxSize?: number; // in MB
  error?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  label = "Screenshots",
  files,
  images: imagesProp,
  onChange,
  onImagesChange: onImagesChangeProp,
  maxFiles = 5,
  maxSize = 5,
  error,
}) => {
  // Support both prop names for flexibility
  const images = files || imagesProp || [];
  const onImagesChange = onChange || onImagesChangeProp || (() => {});
  const [uploadError, setUploadError] = useState<string>("");

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      setUploadError("");

      // Handle rejected files
      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        if (rejection.errors[0]?.code === "file-too-large") {
          setUploadError(`File size must be less than ${maxSize}MB`);
        } else if (rejection.errors[0]?.code === "file-invalid-type") {
          setUploadError("Only PNG, JPG, and JPEG images are allowed");
        } else {
          setUploadError("File upload failed");
        }
        return;
      }

      // Check if adding files would exceed max
      if (images.length + acceptedFiles.length > maxFiles) {
        setUploadError(`Maximum ${maxFiles} images allowed`);
        return;
      }

      onImagesChange([...images, ...acceptedFiles]);
    },
    [images, onImagesChange, maxFiles, maxSize]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
    },
    maxSize: maxSize * 1024 * 1024,
    multiple: true,
  });

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
    setUploadError("");
  };

  const displayError = error || uploadError;

  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-blue-500 bg-blue-50"
            : displayError
            ? "border-red-500 bg-red-50"
            : "border-gray-300 hover:border-gray-400 bg-gray-50"
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
        {isDragActive ? (
          <p className="text-sm text-blue-600 font-medium">
            Drop the images here...
          </p>
        ) : (
          <div>
            <p className="text-sm text-gray-600 mb-1">
              Drag & drop images here, or click to select
            </p>
            <p className="text-xs text-gray-500">
              PNG, JPG up to {maxSize}MB (max {maxFiles} images)
            </p>
          </div>
        )}
      </div>

      {displayError && (
        <p className="text-sm text-red-500">{displayError}</p>
      )}

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {images.map((file, index) => (
            <ImagePreview
              key={`${file.name}-${index}`}
              file={file}
              onRemove={() => removeImage(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface ImagePreviewProps {
  file: File;
  onRemove: () => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ file, onRemove }) => {
  const [preview, setPreview] = useState<string>("");

  // Generate preview URL
  useState(() => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  });

  return (
    <div className="relative group">
      <div className="aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
        {preview ? (
          <img
            src={preview}
            alt={file.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="h-8 w-8 text-gray-400" />
          </div>
        )}
      </div>
      <Button
        type="button"
        onClick={onRemove}
        className="absolute top-2 right-2 h-6 w-6 p-0 rounded-full bg-red-500 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
        variant="destructive"
      >
        <X className="h-4 w-4" />
      </Button>
      <p className="text-xs text-gray-600 mt-1 truncate">{file.name}</p>
      <p className="text-xs text-gray-500">
        {(file.size / 1024 / 1024).toFixed(2)} MB
      </p>
    </div>
  );
};
