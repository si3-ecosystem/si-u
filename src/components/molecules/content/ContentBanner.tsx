import Image from "next/image";
import { urlForImage } from "@/lib/sanity/image";
import { cn } from "@/lib/utils";

interface ContentBannerProps {
  title: string;
  description: string;
  backgroundImage?: any;
  thumbnailImage?: any;
  variant?: 'default' | 'compact' | 'hero';
  overlay?: boolean;
  textColor?: 'light' | 'dark';
  className?: string;
  children?: React.ReactNode;
}

export function ContentBanner({
  title,
  description,
  backgroundImage,
  thumbnailImage,
  variant = 'default',
  overlay = true,
  textColor = 'dark',
  className = '',
  children,
}: ContentBannerProps) {
  const backgroundImageUrl = backgroundImage && urlForImage(backgroundImage)?.src;
  const thumbnailImageUrl = thumbnailImage && urlForImage(thumbnailImage)?.src;

  const variantClasses = {
    default: 'min-h-[240px] md:min-h-[280px]',
    compact: 'min-h-[180px] md:min-h-[220px]',
    hero: 'min-h-[320px] md:min-h-[400px] lg:min-h-[480px]',
  };

  const textColorClasses = {
    light: 'text-white',
    dark: 'text-gray-900',
  };

  return (
    <section className={cn('w-full relative', className)}>
      <div className={cn(
        'w-full flex items-center px-4 lg:px-6 py-6 lg:py-8 relative z-10 rounded-lg',
        variantClasses[variant]
      )}>
        {/* Background Image */}
        {backgroundImageUrl && (
          <>
            <Image
              src={backgroundImageUrl}
              alt="Background"
              fill
              className="absolute inset-0 z-0 object-cover object-center rounded-lg"
              priority={variant === 'hero'}
            />
            {overlay && (
              <div className="absolute inset-0 z-0 bg-black/20 rounded-lg" />
            )}
          </>
        )}

        {/* Content Container */}
        <div className="w-full flex items-center gap-6 z-10 relative">
          {/* Thumbnail Image */}
          {thumbnailImageUrl && (
            <div className="hidden md:block flex-shrink-0">
              <div className="relative w-24 h-24 lg:w-32 lg:h-32 rounded-lg overflow-hidden bg-white/10 backdrop-blur-sm">
                <Image
                  src={thumbnailImageUrl}
                  alt="Thumbnail"
                  fill
                  className="object-cover object-center"
                />
              </div>
            </div>
          )}

          {/* Text Content */}
          <div className="flex-1 min-w-0">
            <h1 className={cn(
              'font-bold mb-3 leading-tight',
              textColorClasses[textColor],
              variant === 'hero' ? 'text-3xl lg:text-4xl xl:text-5xl' : 'text-2xl lg:text-3xl'
            )}>
              {title}
            </h1>
            
            <p className={cn(
              'leading-relaxed max-w-3xl',
              textColor === 'light' ? 'text-gray-100' : 'text-gray-600',
              variant === 'hero' ? 'text-lg lg:text-xl' : 'text-base lg:text-lg'
            )}>
              {description}
            </p>

            {/* Additional content */}
            {children && (
              <div className="mt-4">
                {children}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
