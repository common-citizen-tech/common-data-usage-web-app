"use client";
import { useState } from "react";

const OrgImage = ({ imageUrl, orgName }) => {
  const [isImgValid, setIsImgValid] = useState(false);
  const isImageUrlEmpty = imageUrl.trim().length === 0;
  return (
    <div className="">
      {!isImageUrlEmpty && (
        <img
          alt={`${orgName} logo`}
          src={imageUrl}
          onLoad={() => setIsImgValid(true)}
          className={`h-40 w-40 rounded object-contain ${!isImgValid && "hidden"}`}
        />
      )}
      <div
        className={`h-40 w-40 rounded-full bg-gray-100 ${isImgValid && "hidden"}`}
      />
    </div>
  );
};

export default OrgImage;
