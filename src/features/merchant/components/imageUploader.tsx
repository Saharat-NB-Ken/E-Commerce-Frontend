import { useRef } from "react";
import { animate } from "animejs";

interface ImageUploaderProps {
  images: File[];
  previewUrls: string[];
  setImages: React.Dispatch<React.SetStateAction<File[]>>;
  setPreviewUrls: React.Dispatch<React.SetStateAction<string[]>>;
  maxImages: number;
}

export default function ImageUploader({
  images,
  previewUrls,
  setImages,
  setPreviewUrls,
  maxImages,
}: ImageUploaderProps) {
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    if (images.length + files.length > maxImages) {
      alert(`You can upload up to ${maxImages} images.`);
      return;
    }
    setImages((prev) => [...prev, ...files]);
    setPreviewUrls((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
    e.target.value = ""; // reset
  };

  const handleDragStart = (index: number) => (e: React.DragEvent<HTMLDivElement>) => {
    dragItem.current = index;
  };

  const handleDragEnter = (index: number) => (e: React.DragEvent<HTMLDivElement>) => {
    dragOverItem.current = index;
  };

  const handleDragEnd = () => {
    const dragIndex = dragItem.current;
    const overIndex = dragOverItem.current;
    if (dragIndex === null || overIndex === null) return;

    const newImages = [...images];
    const newPreviews = [...previewUrls];

    const draggedImage = newImages[dragIndex];
    const draggedPreview = newPreviews[dragIndex];

    newImages.splice(dragIndex, 1);
    newPreviews.splice(dragIndex, 1);

    newImages.splice(overIndex, 0, draggedImage);
    newPreviews.splice(overIndex, 0, draggedPreview);

    setImages(newImages);
    setPreviewUrls(newPreviews);

    animate(".image-block", {
      scale: [0.9, 1],
      easing: "easeOutElastic(1, .8)",
      duration: 500,
    });

    dragItem.current = null;
    dragOverItem.current = null;
  };

  const handleRemove = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      {/* Hidden input */}
      <input
        type="file"
        accept="image/*"
        multiple
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />

      {/* Grid preview */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {[...Array(maxImages)].map((_, index) => (
          <div
            key={index}
            className={`relative w-full h-24 border-2 border-dashed rounded-lg flex items-center justify-center overflow-hidden image-block ${
              index === 0 ? "border-green-600" : "border-gray-300"
            } cursor-pointer`}
            draggable={!!previewUrls[index]}
            onDragStart={handleDragStart(index)}
            onDragEnter={handleDragEnter(index)}
            onDragEnd={handleDragEnd}
            onClick={() => !previewUrls[index] && inputRef.current?.click()}
          >
            {previewUrls[index] ? (
              <>
                <img
                  src={previewUrls[index]}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(index);
                  }}
                  className="absolute top-1 right-1 bg-red-600 text-white text-xs rounded-full px-2"
                >
                  ✕
                </button>
                {index === 0 && (
                  <span className="absolute bottom-1 left-1 bg-green-600 text-white text-xs px-2 py-0.5 rounded">
                    Main
                  </span>
                )}
              </>
            ) : (
              <span className="text-gray-400 text-xs">Click to upload</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
