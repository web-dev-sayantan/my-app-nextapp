import React from "react";
import Image from "next/image";

interface ArticleProps {
  ImageLink: string;
  ImageAlt: string;
  Title: string;
  Brief: string;
  Author: string;
  CreatedOn: string;
  Likes: string | number;
}

function Article({
  ImageLink,
  ImageAlt,
  Title,
  Brief,
  Author,
  CreatedOn,
  Likes,
}: ArticleProps) {
  return (
    <div className="max-w-80 h-[500px] bg-white rounded-3xl snap-center flex-shrink-0 shadow-lg text-black m-4">
      <div className="relative w-80 h-48">
        <Image
          src={ImageLink}
          alt={ImageAlt}
          width={384}
          height={192}
          className="object-cover rounded-t-3xl max-w-80 h-48 object-[0%_80%]"
        ></Image>
        <div className="absolute bottom-2 left-2 text-2xl font-extrabold text-white">
          {" "}
          Like {Likes}
        </div>
      </div>

      <div className="p-4">
        <h4 className=" pb-2 font-bold text-xl leading-6">{Title}</h4>
        <p className="text-sm h-32">{Brief}</p>
      </div>

      <div className="px-4  flex justify-between items-end">
        <div className="flex flex-col">
          <h5 className="leading-5 font-bold text-stone-700">{Author}</h5>
          <h6 className="text-xs text-stone-500">Published on {CreatedOn}</h6>
        </div>
        <div className="font-extrabold text-xl text-slate-500 text-right">
          <div>Share</div>
          <div>Save</div>
        </div>
      </div>
    </div>
  );
}

export default Article;
