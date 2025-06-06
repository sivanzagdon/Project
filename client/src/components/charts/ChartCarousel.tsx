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
        <ChevronLeft />
      </button>
      <div style={styles.chartWrapper}>{charts[currentIndex]}</div>
      <button style={styles.arrowButton} onClick={handleNext}>
        <ChevronRight />
      </button>
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  carouselContainer: {
    display: 'grid ',
    gridTemplateColumns: 'auto 1fr auto',
    alignItems: 'center',
    width: '100%',
    marginTop: '2rem',
    gap: '0.5rem',
  },
  arrowButton: {
    background: 'white',
    border: '1px solid #e5e7eb',
    cursor: 'pointer',
    padding: '0.25rem',
    borderRadius: '50%',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartWrapper: {
    width: '100%',
    maxWidth: '1800px',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}

export default ChartCarousel
