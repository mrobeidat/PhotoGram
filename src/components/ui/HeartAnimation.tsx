import React, { useEffect, useState } from "react";
import { Favorite } from "@mui/icons-material";

interface Heart {
  id: number;
  style: React.CSSProperties;
}

interface HeartAnimationProps {
  showHearts: boolean;
}

const HeartAnimation: React.FC<HeartAnimationProps> = ({ showHearts }) => {
  const [hearts, setHearts] = useState<Heart[]>([]);

  useEffect(() => {
    if (showHearts) {
      const newHearts = Array.from({ length: 5 }).map((_, i) => ({
        id: i,
        style: {
          "--random-x": Math.random(),
        } as React.CSSProperties,
      }));
      setHearts(newHearts);
    } else {
      setHearts([]);
    }
  }, [showHearts]);

  return (
    <>
      {hearts.map((heart) => (
        <Favorite key={heart.id} className="heart" style={heart.style} />
      ))}
    </>
  );
};

export default HeartAnimation;
