'use client';

import { useState } from 'react';
import Image from 'next/image';

interface LogoOrIconProps {
  logoSrc: string;
  alt: string;
  icon: React.ReactNode;
  className?: string;
  fit?: 'cover' | 'contain';
  sizes?: string;
}

export default function LogoOrIcon({ logoSrc, alt, icon, className = "", fit = 'cover', sizes = '48px' }: LogoOrIconProps) {
  const [imgError, setImgError] = useState<boolean>(false);

  if (!logoSrc || imgError) {
    return <>{icon}</>;
  }

  return (
    <div className={`relative h-full w-full ${className}`}>
      <Image
        src={logoSrc}
        alt={alt}
        fill
        sizes={sizes}
        className={fit === 'contain' ? 'object-contain' : 'object-cover'}
        onError={() => setImgError(true)}
      />
    </div>
  );
}
