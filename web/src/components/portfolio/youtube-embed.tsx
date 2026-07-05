"use client";

import { useState } from "react";
import { ytEmbedUrl, ytThumbUrl } from "@/lib/portfolio-data";

type Props = {
  youtubeId: string;
  title: string;
};

// Facade: renders the thumbnail only; the YouTube iframe loads on click.
export function YouTubeEmbed({ youtubeId, title }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);

  if (isPlaying) {
    return (
      <iframe
        src={ytEmbedUrl(youtubeId)}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="aspect-video w-full rounded-2xl border-0"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setIsPlaying(true)}
      aria-label={`Lire la vidéo : ${title}`}
      className="group relative block aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-[#121a2b]"
    >
      <img
        src={ytThumbUrl(youtubeId)}
        alt={title}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover transition duration-200 group-hover:scale-[1.02]"
      />
      <span className="absolute inset-0 bg-black/25 transition group-hover:bg-black/15" />
      <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#4f8cff] text-white shadow-[0_12px_40px_rgba(7,17,34,0.5)] transition duration-200 group-hover:scale-110">
        <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7" aria-hidden="true">
          <path fill="currentColor" d="M8 5v14l11-7L8 5z" />
        </svg>
      </span>
    </button>
  );
}
