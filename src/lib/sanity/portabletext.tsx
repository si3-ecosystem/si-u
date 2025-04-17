"use client";

import Link from "next/link";
import { PortableText as PortableTextComponent } from "@portabletext/react";
import Iframe from "react-iframe";
import getVideoId from "get-video-id";

import { urlForImage } from "./image";
import { cn } from "../utils";

const getImageDimensions = (value) => {
  if (!value) return { width: 0, height: 0 };

  if (value.asset && value.asset.metadata && value.asset.metadata.dimensions) {
    return {
      width: value.asset.metadata.dimensions.width,
      height: value.asset.metadata.dimensions.height,
    };
  }

  return {
    width: value.width || 800,
    height: value.height || 600,
  };
};

const ImageComponent = ({ value }) => {
  const { width, height } = getImageDimensions(value);
  const imageUrl = urlForImage(value);

  if (!imageUrl) {
    return null;
  }

  return (
    <img
      src={imageUrl.src}
      alt={value.alt || " "}
      loading="lazy"
      style={{
        display: "inline-block",
        aspectRatio: width / height,
      }}
    />
  );
};

const PortableTextTable = ({ value }) => {
  const [head, ...rows] = value.table.rows;

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full p-1.5 align-middle">
          <div className="overflow-hidden rounded-lg">
            <table className="!my-0 min-w-full divide-y divide-gray-200 !py-0">
              {head.cells.filter(Boolean).length > 0 && (
                <thead className="bg-secondary ml-6 text-white">
                  <tr>
                    {head.cells.map((cell) => (
                      <th
                        scope="col"
                        className="ml-6 px-6 py-3 text-start text-xs font-medium text-white uppercase"
                        key={cell}
                      >
                        {cell}
                      </th>
                    ))}
                  </tr>
                </thead>
              )}
              <tbody className="divide-y divide-gray-200">
                {rows.map((row, index) => (
                  <tr key={index}>
                    {row.cells.map((cell) => (
                      <td
                        className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-800"
                        key={cell}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const IframePreview = ({ value }) => {
  const { url, height } = value;
  if (!url) {
    return <p>Missing Embed URL</p>;
  }
  const { id, service } = getVideoId(url);

  const isYoutubeVideo = id && service === "youtube";

  const finalURL = isYoutubeVideo
    ? `https://www.youtube-nocookie.com/embed/${id}`
    : url;

  return (
    <Iframe
      url={finalURL}
      width="100%"
      height={height || "350"}
      className={cn(!height && "aspect-video", "rounded-md")}
      display="block"
      position="relative"
      frameBorder={0}
      allowFullScreen
      loading="lazy"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; gyroscope; picture-in-picture"
    />
  );
};

const components = {
  types: {
    image: ImageComponent,
    embed: IframePreview,
    tables: PortableTextTable,
  },
  marks: {
    center: (props) => <div className="text-center">{props.children}</div>,
    highlight: (props) => (
      <span className="font-bold text-blue-500">{props.children}</span>
    ),
    link: ({ children, value }) => {
      const rel = !value?.href?.startsWith("/") ? "noopener" : undefined;
      const target = !value?.href?.startsWith("/") ? "_blank" : undefined;
      return (
        <a href={value?.href} rel={rel} target={target}>
          {children}
        </a>
      );
    },
    internalLink: ({ children, value }) => {
      return <Link href={`/blog/${value?.slug?.current}`}>{children}</Link>;
    },
  },
};
// Set up Portable Text serialization
export const PortableText = (props) => (
  <PortableTextComponent components={components} {...props} />
);
