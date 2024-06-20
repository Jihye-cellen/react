import React from 'react'
import StudentRouter from './StudentRouter'
import { Route, Routes } from 'react-router-dom'
import HomePage from '../common/HomePage'
import CourseRouter from './CourseRouter'

const RouterPage = () => {
  return (
    <Routes>
        <Route path="/stu/*" element={<StudentRouter/>}/>
        <Route path="/cou/*" element={<CourseRouter/>}/>
        <Route path="/" element={<HomePage/>}/>
    </Routes>
  )
}

export default RouterPage