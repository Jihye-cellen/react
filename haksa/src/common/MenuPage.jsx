import React from 'react'
import { Link } from 'react-router-dom'
import RouterPage from '../router/RouterPage'

const MenuPage = () => {
  return (
    <div className='my-5'>
        <>
            <Link to = "" className='me-3'>HOME</Link>
            <Link to="/stu" className='me-3'>학생관리</Link>
            <Link to="/cou" className='me-3'>강좌관리</Link>
            <Link to="/crawl/cgv" className='me-3'>CGV</Link>
            <Link to="/crawl/gmarket" className='me-3'>지마켓</Link>
            <hr/>
        </>
        <RouterPage/>
    </div>
    
  )
}

export default MenuPage