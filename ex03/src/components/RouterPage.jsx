import React from 'react'
import { Route, Routes } from 'react-router-dom'
import BookSearch from './book/BookSearch'
import LocalSeach from './local/LocalSeach'
import LoginPage from './user/LoginPage'
import JoinPage from './user/JoinPage'
import CartPage from './user/CartPage'
import FavoritePage from './local/FavoritePage'

const RouterPage = () => {
  return (
    <Routes>
        <Route path = "/book/search" element={<BookSearch/>}/>
        <Route path = "/local/search" element={<LocalSeach/>}/>
        <Route path = "/user/login" element={<LoginPage/>}/>
        <Route path = "/user/join" element={<JoinPage/>}/>
        <Route path = "/user/cart" element={<CartPage/>}/>
        <Route path = "/local/favorite" element={<FavoritePage/>}/>
    </Routes>
  )
}

export default RouterPage