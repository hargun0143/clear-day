export const HAZE_BLOBS = [
  {
    blobClass:
      "haze-blob haze-blob-1 -top-[10%] -left-[10%] h-[55vw] w-[55vw] max-h-[720px] max-w-[720px]",
    opacity: 0.32,
  },
  {
    blobClass:
      "haze-blob haze-blob-2 top-[20%] -right-[15%] h-[60vw] w-[60vw] max-h-[800px] max-w-[800px]",
    opacity: 0.25,
  },
  {
    blobClass:
      "haze-blob haze-blob-3 -bottom-[20%] left-[20%] h-[65vw] w-[65vw] max-h-[860px] max-w-[860px]",
    opacity: 0.28,
  },
] as const;

export const HAZE_GRAIN_CONFIG = {
  baseFrequency: "0.85",
  numOctaves: 3,
  opacityClassName: "opacity-16",
} as const;
