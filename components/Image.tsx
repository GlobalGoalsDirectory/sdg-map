import NextImage from "next/image";

import type { ImageProps } from "next/image";

// opt-out of image optimization, no-op
const customLoader = ({ src }: { src: string }) => src;

// See: https://github.com/vercel/next.js/discussions/19065#discussioncomment-2008348
const Image = (props: ImageProps) => (
  <NextImage {...props} unoptimized={true} loader={customLoader} />
);

export default Image;
