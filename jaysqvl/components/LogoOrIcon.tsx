'use client';

import { useState } from 'react';
import Image from 'next/image';

interface LogoOrIconProps {
  logoSrc: string;
  alt: string;
  icon: React.ReactNode;
  className?: string;
}

export default function LogoOrIcon({ logoSrc, alt, icon, className = "" }: LogoOrIconProps) {
  const [imgError, setImgError] = useState<boolean>(false);

  // Simple approach - just render the image and handle the error
  if (!logoSrc || imgError) {
    return <>{icon}</>;
  }

  return (
    <div className={`flex items-center justify-center w-full h-full ${className}`}>
      <Image
        src={logoSrc}
        alt={alt}
        width={24}
        height={24}
        className="w-full h-full object-cover rounded-full"
        onError={() => setImgError(true)}
        priority
      />
    </div>
  );
} 