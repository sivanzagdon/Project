import React, { useState, useCallback, useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import './ChartCarousel.css'

interface ChartCarouselProps {
  charts: React.ReactNode[]
}

// Carousel component that displays charts with navigation arrows for browsing through multiple charts
const ChartCarousel: React.FC<ChartCarouselProps> = ({ charts }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Navigates to the previous chart in the carousel
  const handlePrev = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? charts.length - 1 : prevIndex - 1
    )
  }, [charts.length])

  // Navigates to the next chart in the carousel
  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? 0 : prevIndex + 1
    )
  }, [])

  // Memoize current chart to prevent unnecessary re-renders
  const currentChart = useMemo(() => {
    return charts[currentIndex] || null
  }, [charts, currentIndex])

  // Don't render if no charts
  if (!charts || charts.length === 0) {
    return null
  }

  return (
    <div className="carousel-container">
      <button className="arrow-button" onClick={handlePrev}>
        <ChevronLeft />
      </button>
      <div className="chart-wrapper">{currentChart}</div>
      <button className="arrow-button" onClick={handleNext}>
        <ChevronRight />
      </button>
    </div>
  )
}

export default ChartCarousel
