import React from 'react';
import { PLACEHOLDER_IMAGE } from '../../config/constants';

const Image = ({ src, alt, className, ...props }) => {
  const handleImageError = (e) => {
    e.target.onerror = null; // Prevent infinite loops if fallback fails
    e.target.src = PLACEHOLDER_IMAGE;
  };

  // If no source is passed, use the premium fallback image directly
  const imageSrc = src || PLACEHOLDER_IMAGE;

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      onError={handleImageError}
      {...props}
    />
  );
};

export default Image;
