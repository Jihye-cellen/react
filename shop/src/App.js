import logo from './logo.svg';
import './App.css';
import { Container } from 'react-bootstrap';
import TopPage from './components/TopPage';
import BottomPage from './components/BottomPage';
import HomePage from './components/HomePage';
import MenuPage from './components/MenuPage';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { CountContext } from './components/CountContext';
import AdminMenu from './components/admin/AdminMenu';


function App() {
  const [count, setCount]=useState(0);
  const callAPICount =async()=>{
    const res = await axios.get(`/cart/list?uid=${sessionStorage.getItem('uid')}` );
    setCount(res.data.length);
  }

  useEffect(()=>{
    callAPICount();
  },[count])

  return (
    <CountContext.Provider value={{count, setCount, callAPICount}}>
    <Container>
      <TopPage/>
    {sessionStorage.getItem('uid')==='admin'? <AdminMenu/> :<MenuPage/>}
      <BottomPage/>
    </Container>
    </CountContext.Provider>
    
  );
}

export default App;
