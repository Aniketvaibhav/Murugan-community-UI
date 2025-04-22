"use client"

import { useRef, useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export const AppleCardsCarousel = ({
  items,
  className,
}: {
  items: {
    id: string | number
    title: string
    description: string
    image: string
    content?: string
  }[]
  className?: string
}) => {
  const [activeCard, setActiveCard] = useState<string | number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleCardClick = (id: string | number) => {
    setActiveCard(activeCard === id ? null : id)
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex w-full snap-x snap-mandatory gap-6 overflow-x-auto pb-10 pt-8 [&::-webkit-scrollbar]:hidden",
        className,
      )}
    >
      {items.map((item) => (
        <Card
          key={item.id}
          id={item.id}
          title={item.title}
          description={item.description}
          image={item.image}
          content={item.content}
          isActive={activeCard === item.id}
          onClick={handleCardClick}
        />
      ))}
    </div>
  )
}

const Card = ({
  id,
  title,
  description,
  image,
  content,
  isActive,
  onClick,
}: {
  id: string | number
  title: string
  description: string
  image: string
  content?: string
  isActive: boolean
  onClick: (id: string | number) => void
}) => {
  return (
    <motion.div
      layout
      onClick={() => onClick(id)}
      className={cn(
        "relative flex h-[400px] w-[300px] shrink-0 cursor-pointer flex-col overflow-hidden rounded-xl p-8 snap-center",
        "bg-gradient-to-br from-neutral-900 to-neutral-800",
        "transition-all duration-500 ease-in-out",
        isActive ? "w-[500px]" : "hover:translate-y-[-8px]",
      )}
      style={{
        backgroundImage: `linear-gradient(to bottom right, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.6)), url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <motion.div layout className="flex h-full flex-col justify-between">
        <div className="flex flex-col">
          <motion.span layout className="mb-2 rounded-full bg-primary/20 px-3 py-1 text-xs text-primary w-fit">
            Learn
          </motion.span>
          <motion.h3 layout className="text-xl font-bold text-white">
            {title}
          </motion.h3>
          <motion.p layout className="mt-2 text-sm text-white/80">
            {description}
          </motion.p>
        </div>

        {isActive && content && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 overflow-y-auto text-sm text-white/70 max-h-[180px] custom-scrollbar"
          >
            <div className="whitespace-pre-line">{content}</div>
          </motion.div>
        )}

        <motion.div layout className="mt-auto">
          <motion.button layout className="flex items-center gap-1 text-sm font-medium text-white">
            <span>{isActive ? "Read less" : "Read more"}</span>
            <motion.span animate={{ rotate: isActive ? 180 : 0 }} transition={{ duration: 0.3 }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </motion.span>
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
