"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export const ExpandableCard = ({
  children,
  className,
  expandedClassName,
  cardTitle,
  cardDescription,
  cardContent,
}: {
  children?: React.ReactNode
  className?: string
  expandedClassName?: string
  cardTitle: string | React.ReactNode
  cardDescription?: string | React.ReactNode
  cardContent: React.ReactNode
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleClick = () => {
    setIsOpen(!isOpen)
  }

  return (
    <motion.div
      layout
      onClick={handleClick}
      className={cn(
        "relative overflow-hidden rounded-lg border border-muted bg-background shadow-md transition-colors",
        isOpen ? expandedClassName : className,
      )}
      style={{
        cursor: "pointer",
        width: "100%",
      }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <motion.div layout className="flex flex-col gap-2 p-6">
        <motion.div layout className="flex flex-col gap-1">
          <motion.h3 layout className="text-xl font-semibold">
            {cardTitle}
          </motion.h3>
          {cardDescription && (
            <motion.p layout className="text-muted-foreground">
              {cardDescription}
            </motion.p>
          )}
        </motion.div>
        <motion.div
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: isOpen ? 1 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={cn("overflow-hidden", isOpen ? "block" : "hidden")}
        >
          {cardContent}
        </motion.div>
      </motion.div>
      <div className="absolute bottom-4 right-4">
        <motion.div
          layout
          initial={{ rotate: 0 }}
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
        </motion.div>
      </div>
    </motion.div>
  )
}
