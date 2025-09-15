import React, { useEffect, useState } from "react";

// Import your 4 images. Place files in client/src/assets/
import hero1 from "../assets/hero1.jpg";
import hero2 from "../assets/hero2.jpg";
import hero3 from "../assets/hero3.jpg";
import hero4 from "../assets/hero4.jpg";

/**
 * Home shows a full-bleed 4-image carousel with:
 * - Auto-rotate
 * - Hover overlay message
 * - Bottom dot indicators (click to jump)
 */
export default function Home() {
  const images = [hero1, hero2, hero3, hero4];
  const [active, setActive] = useState(0);

  // Auto-rotate every 4 seconds
  useEffect(() => {
    const id = setInterval(() => {
      setActive((i) => (i + 1) % images.length);
    }, 4000);
    return () => clearInterval(id);
  }, [images.length]);

  // Click a dot to jump to the slide
  const jumpTo = (index) => setActive(index);

  return (
    <div className="carousel">
      {/* Slides */}
      {images.map((src, i) => (
        <div
          key={i}
          className={`slide ${i === active ? "active" : ""}`}
          style={{ backgroundImage: `url(${src})` }}
          aria-hidden={i !== active}
        />
      ))}

      {/* Hover overlay message */}
      <div className="overlay">
        <div>
          <h1>Welcome to DEV@Deakin</h1>
          <p>I'm StevenQu, the developer of this website, nice to meet you guys.</p>
        </div>
      </div>

      {/* Dot indicators (bottom center) */}
      <div className="dots" role="tablist" aria-label="Carousel slides">
        {images.map((_, i) => (
          <button
            key={i}
            className={`dot ${i === active ? "active" : ""}`}
            onClick={() => jumpTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-selected={i === active}
            role="tab"
          />
        ))}
      </div>
    </div>
  );
}
