"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export const ImagesSlider = ({
  images,
  children,
  overlay = true,
  overlayClassName,
  className,
  autoplayInterval = 5000,
  direction = "up",
}: {
  images: string[]
  children?: React.ReactNode
  overlay?: boolean
  overlayClassName?: string
  className?: string
  autoplayInterval?: number
  direction?: "up" | "down" | "left" | "right"
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadedImages, setLoadedImages] = useState<string[]>([])

  const handleImageLoad = (image: string) => {
    setLoadedImages((prev) => {
      if (prev.includes(image)) {
        return prev
      }
      return [...prev, image]
    })
  }

  useEffect(() => {
    // Preload images
    images.forEach((image) => {
      const img = new Image()
      img.src = image
      img.onload = () => handleImageLoad(image)
    })
  }, [images])

  useEffect(() => {
    // Set loading to false when all images are loaded
    if (loadedImages.length === images.length) {
      setLoading(false)
    }
  }, [loadedImages, images])

  useEffect(() => {
    // Autoplay functionality
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, autoplayInterval)

    return () => clearInterval(interval)
  }, [autoplayInterval, images.length])

  const slideVariants = {
    initial: {
      scale: 1,
      opacity: 0,
      ...(direction === "up" && { y: 20 }),
      ...(direction === "down" && { y: -20 }),
      ...(direction === "left" && { x: 20 }),
      ...(direction === "right" && { x: -20 }),
    },
    animate: {
      scale: 1,
      y: 0,
      x: 0,
      opacity: 1,
    },
    exit: {
      scale: 1,
      opacity: 0,
      ...(direction === "up" && { y: -20 }),
      ...(direction === "down" && { y: 20 }),
      ...(direction === "left" && { x: -20 }),
      ...(direction === "right" && { x: 20 }),
    },
  }

  return (
    <div
      className={cn("overflow-hidden h-full w-full relative flex items-center justify-center bg-gray-800", className)}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background z-50">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        </div>
      )}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          className="absolute inset-0 bg-gray-800"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={slideVariants}
          transition={{
            duration: 1,
            ease: "easeInOut",
          }}
        >
          <img
            src={images[currentIndex] || "/placeholder.svg"}
            alt={`Slide ${currentIndex}`}
            className="h-full w-full object-cover"
          />
          {overlay && <div className={cn("absolute inset-0 bg-black/50", overlayClassName)} />}
        </motion.div>
      </AnimatePresence>
      {children && <div className="relative z-10 flex items-center justify-center">{children}</div>}
    </div>
  )
}
