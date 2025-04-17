import React from 'react'
import OpeningClosingChart from './OpeningClosingChart'
import SubCategoryChart from './SubCategoryChart'
import MainCategoryChart from './MainCategoryChart'
import RequestsByWeekdayChart from './RequestsByWeekdayChart'

interface Props {
  site: 'A' | 'B' | 'C'
  siteData: any
  rates: any[]
}

const SiteCharts: React.FC<Props> = ({ site, siteData, rates }) => {
  return (
    <>
      {/* <OpeningClosingChart site={site} data={rates} />
      <SubCategoryChart site={site} data={siteData.sub_category} />
      <MainCategoryChart site={site} data={siteData.main_category} />
      <RequestsByWeekdayChart site={site} data={siteData.by_weekday} /> */}
    </>
  )
}

export default SiteCharts
