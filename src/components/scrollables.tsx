import React from "react";
import Link from "next/link";
import Image from "next/image";

interface ScrollablesProps {
  Name: string;
  Img?: string | null;
  PageLink?: string;
}

function Scrollables({ Name, Img, PageLink }: ScrollablesProps) {
  const default_Image =
    "https://res.cloudinary.com/thetrail/image/upload/v1714107209/default_trek_image.jpg";
  const default_Link = "/contact";

  return (
    <div className="my-4 mx-2 snap-center w-32 h-40 flex-shrink-0">
      <Link href={PageLink || default_Link}>
        <div className="relative  flex flex-col justify-center items-center">
          <Image
            src={Img || default_Image}
            height={320}
            width={240}
            alt={Name}
            className="h-40 w-full object-cover rounded-xl"
            sizes="(max-width: 768px) 250px, 400px"
          ></Image>

          <div className="absolute w-full h-full  bg-gradient-to-b from-black to-transparent to-50% border-t-2 border-t-blue-600 border-e-blue-600 rounded-xl"></div>

          <h4 className="absolute top-2 text-base uppercase text-center leading-5 px-2 font-semibold">
            {Name}
          </h4>
        </div>
      </Link>
    </div>
  );
}

export default Scrollables;
