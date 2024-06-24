import React from 'react'
import { Route, Routes } from 'react-router-dom'
import CGVPage from '../components/crawl/CGVPage'
import FinancePage from '../components/crawl/FinancePage'
import Gmarket from '../components/crawl/Gmarket'


const CrawlingRouter = () => {
  return (
    <Routes>
        <Route path="cgv" element={<CGVPage/>}/>
        <Route path="finance" element={<FinancePage/>}/>
        <Route path="gmarket" element={<Gmarket/>}/>
    </Routes>
  )
}

export default CrawlingRouter