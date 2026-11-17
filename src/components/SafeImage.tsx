import React, { useState } from 'react';

export const SafeImage: React.FC<{ src: string; alt: string; className?: string; fallbackText: string }> = ({
  src,
  alt,
  className,
  fallbackText,
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className={`${className} flex items-center justify-center bg-zinc-800 text-zinc-400 font-black text-xs rounded-xl`}>
        {fallbackText}
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={alt} 
      className={className} 
      onError={() => setHasError(true)} 
    />
  );
};
