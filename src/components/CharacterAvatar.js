"use client";

import { useState } from "react";

export default function CharacterAvatar({ slug, name, accentColor, className, size }) {
  const [imgError, setImgError] = useState(false);
  const imagePath = `/images/characters/${slug}.png`;

  return (
    <div
      className={className}
      style={{
        backgroundColor: accentColor,
        position: "relative",
        overflow: "hidden",
        borderRadius: "50%",
      }}
    >
      {!imgError ? (
        <img
          src={imagePath}
          alt={name}
          onError={() => setImgError(true)}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            transform: "scale(2)",
          }}
        />
      ) : (
        <span>{name.charAt(0)}</span>
      )}
    </div>
  );
}
