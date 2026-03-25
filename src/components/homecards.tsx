import React from "react";
import Link from "next/link";
import Image from "next/image";

interface TrekCardProps {
  Name: string;
  Img?: string | null;
  State: string;
  Description: string;
  Distance: string | number;
  Duration: string | number;
  Difficulty: string;
  Date: [string, ...string[]] | string[];
  PageLink?: string;
}

export default function TrekCard({
  Name,
  Img,
  State,
  Description,
  Distance,
  Duration,
  Difficulty,
  Date,
  PageLink,
}: TrekCardProps) {
  const default_Image =
    "https://res.cloudinary.com/thetrail/image/upload/v1714107209/default_trek_image.jpg";

  return (
    <div
      className="m-4 border snap-center relative border-border bg-bg-card shadow-warm
                        w-80 shrink-0 rounded-card-lg font"
    >
      <Link href={PageLink || "/contact"}>
        <Image
          src={Img || default_Image}
          alt={Name}
          width={320}
          height={192}
          className="object-cover w-80 h-48 rounded-t-card-lg p-2"
          sizes="(max-width: 768px) 320px, 320px"
        ></Image>
      </Link>

      <div className="border-b border-border p-2 min-h-40">
        <div className="flex items-center">
          <h2 className=" pl-1 font-semibold uppercase text-text-primary ">
            {Name}
          </h2>
          <h4 className=" px-2 ml-4 text-[10px] text-center font-medium uppercase rounded-pill bg-accent-peach text-primary ">
            {State}
          </h4>
        </div>

        <p className=" text-sm p-1 text-text-secondary">{Description}</p>
      </div>

      <div className="p-2 pt-1 border-border">
        <h3 className=" pl-1 font-bold text-sm uppercase text-text-muted inline-block">
          {" "}
          Details
        </h3>
        <div className="px-4 pt-1 flex justify-between">
          <div className="">
            <h4 className="text-xs text-primary">Distance</h4>
            <h6 className=" text-primary font-medium">{Distance}</h6>
          </div>
          <div className="">
            <h4 className="text-xs text-primary">Duration</h4>
            <h6 className=" text-primary font-medium">{Duration} Days</h6>
          </div>
          <div className="">
            <h4 className="text-xs text-primary">Difficulty</h4>
            <h6 className=" text-primary font-medium">{Difficulty}</h6>
          </div>
        </div>
      </div>

      <Link href={PageLink || "/contact"}>
        <div className="text-center flex flex-col items-center pt-4">
          <p
            className="text-white bg-primary hover:bg-primary-dark
                py-1 w-3/4 font-bold text-lg rounded-t-card-lg"
          >
            {Date[0]}
          </p>
        </div>
      </Link>
    </div>
  );
}
