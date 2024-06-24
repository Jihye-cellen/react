import React from 'react'
import{Row, Col} from 'react-bootstrap'
import Chart1 from './Chart1'
import Chart2 from './Chart2'
import Chart3 from './Chart3'
import FinancePage from '../components/crawl/FinancePage'

const HomePage = () => {
  return (
    <div>
        <h1>홈페이지</h1>
        <Row>
          <Col>
          <Chart1/>
          <Chart2/>
          <Chart3/>
          <FinancePage/>
          </Col>
        </Row>
    </div>
  )
}

export default HomePage