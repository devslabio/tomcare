import Image, { type ImageProps } from "next/image";

import { isResizable } from "@/lib/image-loader";

/** next/image for site photos: Unsplash photos are resized on their CDN; uploads are served as-is. */
export function Photo({ alt, ...props }: ImageProps) {
  const src = typeof props.src === "string" ? props.src : "";
  return <Image alt={alt} quality={85} {...props} unoptimized={props.unoptimized ?? !isResizable(src)} />;
}
