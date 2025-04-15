export const calculateOpeningAndClosingRates = (
  data: any,
  selectedBuilding: 'A' | 'B' | 'C',
  setCalculatedTimeData: any,
  createCombinedData: any,
  setCombinedRateData: any
) => {
  const siteRates: {
    A: { opening_rate: any[]; closing_rate: any[] }
    B: { opening_rate: any[]; closing_rate: any[] }
    C: { opening_rate: any[]; closing_rate: any[] }
  } = {
    A: { opening_rate: [], closing_rate: [] },
    B: { opening_rate: [], closing_rate: [] },
    C: { opening_rate: [], closing_rate: [] },
  }

  for (const site in data) {
    if (data[site]) {
      const siteData = data[site]

      const openingDates = siteData
        .map((entry: any) => new Date(entry.created_on))
        .sort((a: Date, b: Date) => a.getTime() - b.getTime())
      const closingDates = siteData
        .map((entry: any) => new Date(entry.closed_at))
        .sort((a: Date, b: Date) => a.getTime() - b.getTime())

      const openingDateCounts: { [key: string]: number } = {}
      const closingDateCounts: { [key: string]: number } = {}

      openingDates.forEach((date: Date) => {
        const dateStr = date.toISOString().split('T')[0]
        openingDateCounts[dateStr] = (openingDateCounts[dateStr] || 0) + 1
      })

      closingDates.forEach((date: Date) => {
        const dateStr = date.toISOString().split('T')[0]
        closingDateCounts[dateStr] = (closingDateCounts[dateStr] || 0) + 1
      })

      for (const dateStr in openingDateCounts) {
        siteRates[site as keyof typeof siteRates].opening_rate.push({
          date: dateStr,
          opening_rate: openingDateCounts[dateStr],
        })
      }

      for (const dateStr in closingDateCounts) {
        siteRates[site as keyof typeof siteRates].closing_rate.push({
          date: dateStr,
          closing_rate: closingDateCounts[dateStr],
        })
      }

      siteRates[site as keyof typeof siteRates].opening_rate.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      )

      siteRates[site as keyof typeof siteRates].closing_rate.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      )
    } else {
      console.log(`No time_data for site ${site}`)
    }
  }

  console.log('utils 68:', siteRates)
  setCalculatedTimeData(siteRates)
  createCombinedData(siteRates, setCombinedRateData)
}

export const createCombinedData = (siteData: any, setCombinedRateData: any) => {
  const combinedData: { A: any[]; B: any[]; C: any[] } = {
    A: [],
    B: [],
    C: [],
  }

  // עבור כל אתר: A, B, C
  for (const site in siteData) {
    if (site === 'A' || site === 'B' || site === 'C') {
      // ודא שהמפתח הוא A, B, או C
      const siteSpecificData = siteData[site]
      if (!siteSpecificData) continue

      const { opening_rate, closing_rate } = siteSpecificData
      const allDates = new Set<string>()

      opening_rate.forEach((item: any) => allDates.add(item.date))
      closing_rate.forEach((item: any) => allDates.add(item.date))

      const sortedDates = Array.from(allDates).sort(
        (a, b) => new Date(a).getTime() - new Date(b).getTime()
      )

      const openingLookup: { [key: string]: number } = {}
      const closingLookup: { [key: string]: number } = {}

      opening_rate.forEach((item: any) => {
        openingLookup[item.date] = item.opening_rate
      })

      closing_rate.forEach((item: any) => {
        closingLookup[item.date] = item.closing_rate
      })

      const combined = sortedDates.map((date) => ({
        date,
        opening_rate: openingLookup[date] || 0,
        closing_rate: closingLookup[date] || 0,
      }))

      combinedData[site as 'A' | 'B' | 'C'] = combined
    }
  }

  setCombinedRateData(combinedData)
  console.log('utils: ', combinedData)
}
