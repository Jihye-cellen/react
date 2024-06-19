import './App.css';
import MenuPage from './common/MenuPage';
import { Container } from 'react-bootstrap';
import { BoxContext } from './context/BoxContext';
import Box from './common/Box';
import { useState } from 'react';

function App() {
  const [box, setBox] = useState({
    show:false,
    message:'',
    action:null
  });


  return (
    <BoxContext.Provider value={{box,setBox}}>
      <Container>
        <MenuPage/>
      </Container>
      {box.show && <Box box={box} setBox={setBox}/>}
    </BoxContext.Provider>
  );
}

export default App;
