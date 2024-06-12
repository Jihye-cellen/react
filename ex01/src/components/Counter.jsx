import  react, { useState } from 'react';
import {Button, Card} from 'react-bootstrap';
const Counter =()=> {
    const [count, setCount] = useState(100);

    const onClickInc =()=> {
        setCount(count+1);
    }
    const style={
        fontSize:'25px',
        color:'red'
    }
    
    return(
        <Card className="m-5">
            <Card.Header>
            <h1>카운터</h1>
            </Card.Header>
           <Card.Body>
             <Button variant ='success' onClick={()=>setCount(count-1) }>감소</Button>
            <span className='mx-3' style={style}>{count}</span> 
             <Button variant='secondary' onClick={onClickInc}>증가</Button>
           </Card.Body> 
        </Card>
    )
}
export default Counter;

