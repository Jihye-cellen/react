import React from 'react'
import { Link } from 'react-router-dom'
import RouterPage from '../router/RouterPage'

const MenuPage = () => {
  return (
    <div className='my-5'>
        <>
            <Link to = "" className='me-3'>HOME</Link>
            <Link to="/stu" className='me-3'>학생관리</Link>
            <hr/>
        </>
        <RouterPage/>
    </div>
    
  )
}

export default MenuPage