import React, { useMemo, useState } from "react";

export type Step = {
  id: number;
  index: number;
  imageUrl: string;
  caption?: string;
  dir?: string;
};

type Props = { steps: Step[] };


function normalizeUrl(u: string) {
  if (!u) return u;
  // If absolute, return as is
  if (/^https?:\/\//i.test(u)) return u;
  // Ensure single leading slash
  const out = ("/" + u).replace(/\/+/g, "/");
  return out;
}

export default function ImageStepPlayer({ steps }: Props) {
  const ordered = useMemo(
    () => [...steps].sort((a, b) => a.index - b.index),
    [steps]
  );

  const [i, setI] = useState(0);
  const current = ordered[i];

  function next() {
    setI((v) => Math.min(v + 1, ordered.length - 1));
  }

  function prev() {
    setI((v) => Math.max(v - 1, 0));
  }

  if (!ordered.length)
    return (
      <div className="p-4 border rounded-lg bg-white shadow text-center">
        No steps available for this route.
      </div>
    );

  return (
    <div className="p-4 border rounded-lg shadow bg-white max-w-xl mx-auto mt-4">

      {/* Image Wrapper */}
      <div className="relative">
        <img
          src={normalizeUrl(current.imageUrl)}
          alt={current.caption || "Step"}
          className="rounded-lg w-full"
        />

        {/* Direction Label */}
        {current.dir && (
          <div className="absolute top-2 right-2 bg-black/75 text-white text-xs px-2 py-1 rounded">
            {current.dir.toUpperCase()}
          </div>
        )}
      </div>

      {/* Caption */}
      {current.caption && (
        <p className="text-center text-gray-700 mt-2">{current.caption}</p>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center mt-4">
        <button
          className={`px-3 py-1 border rounded ${
            i === 0
              ? "opacity-40 cursor-not-allowed"
              : "hover:bg-gray-100"
          }`}
          disabled={i === 0}
          onClick={prev}
        >
          Prev
        </button>

        <div className="text-sm text-gray-600">
          Step {i + 1} of {ordered.length}
        </div>

        <button
          className={`px-3 py-1 border rounded ${
            i === ordered.length - 1
              ? "opacity-40 cursor-not-allowed"
              : "hover:bg-gray-100"
          }`}
          disabled={i === ordered.length - 1}
          onClick={next}
        >
          Next
        </button>
      </div>
    </div>
  );
}
