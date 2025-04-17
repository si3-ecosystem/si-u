import createImageUrlBuilder from "@sanity/image-url";
import { projectId, dataset } from "./config";

interface SanityImageSource {
  asset?: {
    _ref?: string;
  };
}

const imageBuilder = createImageUrlBuilder({ projectId, dataset });

export const urlForImage = (source: SanityImageSource) => {
  if (!source || !source.asset) return null;

  const dimensions = source?.asset?._ref?.split("-")[2];
  if (!dimensions) return null;

  const [width, height] = dimensions
    ?.split("x")
    .map((num) => parseInt(num, 10)) || [0, 0];

  const url = imageBuilder
    .image(source)
    .auto("format")
    .width(Math.min(width, 2000))
    .url();

  return {
    src: url,
    width: width || 0,
    height: height || 0,
  };
};
