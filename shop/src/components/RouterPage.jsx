import React from 'react'
import LoginPage from './users/LoginPage'
import HomePage from './HomePage'
import ReadPage from './users/ReadPage'
import { Routes, Route } from 'react-router-dom'
import SearchPage from './books/SearchPage'
import ListPage from './books/ListPage'
import UpdatePage from './books/UpdatePage'
import BookReadPage from './books/BookReadPage'
import CartPage from './orders/CartPage'
import OrderList from './orders/OrderList'

const RouterPage = () => {
  return (
    <Routes>
        <Route path="/users/login" element={<LoginPage/>}/>
        <Route path="/users/read" element={<ReadPage/>}/>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/books/search" element={<SearchPage/>}/>
        <Route path="/books/list" element={<ListPage/>}/>
        <Route path="/books/update/:bid" element={<UpdatePage/>}/>
        <Route path="/books/read/:bid" element={<BookReadPage/>}/>
        <Route path="/orders/cart" element={<CartPage/>}/>
        <Route path="/orders/list" element={<OrderList/>}/>
    </Routes>
  )
}

export default RouterPage