import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import './ChartCarousel.css'

interface ChartCarouselProps {
  charts: React.ReactNode[]
}

const ChartCarousel: React.FC<ChartCarouselProps> = ({ charts }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? charts.length - 1 : prevIndex - 1
    )
  }

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === charts.length - 1 ? 0 : prevIndex + 1
    )
  }

  return (
    <div className="carousel-container">
      <button className="arrow-button" onClick={handlePrev}>
        <ChevronLeft />
      </button>
      <div className="chart-wrapper">{charts[currentIndex]}</div>
      <button className="arrow-button" onClick={handleNext}>
        <ChevronRight />
      </button>
    </div>
  )
}

export default ChartCarousel
