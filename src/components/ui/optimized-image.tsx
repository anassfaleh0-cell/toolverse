import { cn } from "@/lib/utils";
import Image from "next/image";
import type { ImageProps } from "next/image";

interface OptimizedImageProps extends Omit<ImageProps, "loading" | "placeholder" | "blurDataURL"> {
  containerClassName?: string;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  containerClassName,
  priority = false,
  fill,
  sizes,
  ...props
}: OptimizedImageProps) {
  if (fill) {
    return (
      <div className={cn("relative overflow-hidden bg-surface-secondary", containerClassName)}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes ?? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
          priority={priority}
          loading={priority ? undefined : "lazy"}
          className={cn("object-cover", className)}
          {...props}
        />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes ?? "100vw"}
      priority={priority}
      loading={priority ? undefined : "lazy"}
      className={cn("h-auto", className)}
      {...props}
    />
  );
}