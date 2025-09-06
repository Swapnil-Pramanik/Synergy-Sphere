import React from 'react'

interface ImageWithFallbackProps {
  src: string
  alt: string
  fallback?: string
  className?: string
  width?: number
  height?: number
}

export function ImageWithFallback({ 
  src, 
  alt, 
  fallback = '', 
  className = '',
  width,
  height 
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = React.useState(src)
  const [hasError, setHasError] = React.useState(false)

  const handleError = () => {
    if (!hasError) {
      setHasError(true)
      if (fallback) {
        setImgSrc(fallback)
      }
    }
  }

  React.useEffect(() => {
    setImgSrc(src)
    setHasError(false)
  }, [src])

  if (hasError && !fallback) {
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <span className="text-gray-500 text-sm">Image not found</span>
      </div>
    )
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      width={width}
      height={height}
      onError={handleError}
      loading="lazy"
    />
  )
}