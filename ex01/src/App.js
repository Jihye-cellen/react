import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Row, Col, Container } from 'react-bootstrap';
import BookSearch from './components2/BookSearch';

const App =()=> {
  return (
    <Container>
      <BookSearch/>
      </Container>
  );
}

export default App;
