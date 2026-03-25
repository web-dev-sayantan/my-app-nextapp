import React from "react";
import Image from "next/image";

interface GalleryImageProps {
  ImageLinks?: string | null;
}

function GalleryImage({ ImageLinks }: GalleryImageProps) {
  const default_Image =
    "https://res.cloudinary.com/thetrail/image/upload/v1714107209/default_trek_image.jpg";

  return (
    <div className="snap-center mx-2 h-96 shrink-0">
      <div className="relative h-96">
        <Image
          src={ImageLinks || default_Image}
          alt="Beas Kund"
          width={480}
          height={480}
          sizes="(max-width: 768px) 80vw, 480px"
          className="h-96 w-auto object-cover rounded-2xl"
        />
      </div>
    </div>
  );
}

export default GalleryImage;
