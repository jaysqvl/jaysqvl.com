'use client';

import { useState } from 'react';
import Image from 'next/image';

interface LogoOrIconProps {
  logoSrc: string;
  alt: string;
  icon: React.ReactNode;
  className?: string;
  fit?: 'cover' | 'contain';
}

export default function LogoOrIcon({ logoSrc, alt, icon, className = "", fit = 'cover' }: LogoOrIconProps) {
  const [imgError, setImgError] = useState<boolean>(false);

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
        className={`h-full w-full ${fit === 'contain' ? 'object-contain p-1' : 'rounded-full object-cover'}`}
        onError={() => setImgError(true)}
        priority
      />
    </div>
  );
}
