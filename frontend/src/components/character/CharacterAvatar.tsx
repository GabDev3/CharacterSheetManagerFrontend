// src/components/character/CharacterAvatar.tsx - FIXED IMAGE RENDERING
import React, { useState } from 'react';
import { User } from 'lucide-react';
import { clsx } from 'clsx';

interface CharacterAvatarProps {
  imageBase64?: string | null;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const CharacterAvatar: React.FC<CharacterAvatarProps> = ({
  imageBase64,
  name,
  size = 'md',
  className,
}) => {
  const [imageError, setImageError] = useState(false);
  
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const iconSizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  // Show placeholder if no image, empty image, or image failed to load
  const shouldShowPlaceholder = !imageBase64 || imageBase64.trim() === '' || imageError;

  if (shouldShowPlaceholder) {
    return (
      <div
        className={clsx(
          'rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white border-2 border-white shadow-md',
          sizeClasses[size],
          className
        )}
      >
        <User className={iconSizeClasses[size]} />
      </div>
    );
  }

  return (
    <img
      src={`data:image/jpeg;base64,${imageBase64}`}
      alt={name}
      className={clsx(
        'rounded-full object-cover border-2 border-white shadow-md',
        sizeClasses[size],
        className
      )}
      onError={() => {
        console.warn('Failed to load character image:', imageBase64?.substring(0, 50));
        setImageError(true);
      }}
    />
  );
};