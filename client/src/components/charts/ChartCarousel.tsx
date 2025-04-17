// ChartCarousel.tsx
import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

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
    <div style={styles.carouselContainer}>
      <button style={styles.arrowButton} onClick={handlePrev}>
        <ChevronLeft size={24} />
      </button>
      <div style={styles.chartWrapper}>{charts[currentIndex]}</div>
      <button style={styles.arrowButton} onClick={handleNext}>
        <ChevronRight size={24} />
      </button>
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  carouselContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    gap: '1rem',
    marginTop: '3rem',
  },
  arrowButton: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '0.5rem',
    borderRadius: '50%',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  chartWrapper: {
    flex: 1,
    maxWidth: '1000px',
    overflow: 'hidden',
  },
}

export default ChartCarousel
