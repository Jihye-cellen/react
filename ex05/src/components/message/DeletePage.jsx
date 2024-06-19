import axios from 'axios';
import React, { useEffect, useState } from 'react'
import{Table, Button} from 'react-bootstrap'
import { ClockLoader } from 'react-spinners';
const DeletePage = () => {
    const [loading, setLoading] = useState(false);
    const uid=sessionStorage.getItem("uid");
    const [checked, setChecked] = useState(0);
    const [list, setList]=useState([]);
    const callAPI=async()=>{
        const res = await axios.get(`/message/delete/list/${uid}`);
        console.log(res.data);
        const data = res.data.map(msg=>msg && {...msg, checked:false, type:uid===msg.sender ? 'send' : 'receive' });
        setList(data);
    }

    useEffect(()=>{
        callAPI();
    },[])

    const onChangeAll =(e)=>{
        const data = list.map(msg=> msg && {...msg, checked:e.target.checked});
        setList(data);
    }

    const onChangeSingle = (e, mid)=> {
        const data = list.map(msg=>msg.mid===mid ? {...msg, checked:e.target.checked} : msg);
        setList(data);
    }

    useEffect (()=>{
        let cnt = 0;
        list.forEach(msg=>msg.checked && cnt++)
        setChecked(cnt);
    },[list])

    const onReset = ()=>{
        if(checked===0){
            alert("복원할 메시지를 선택하세요!")
            return;
        }

        let cnt=0;
        setLoading(true);
        list.forEach(async msg=>{
            if(msg.checked){
            await axios.post(`/message/reset/delete/${msg.mid}?type=${msg.type}`);
            cnt++;
         }
         if(cnt===checked) callAPI();
         setTimeout(()=>{
            setLoading(false);}, 1000)
         
        })
    }    

if(loading) return  <div className='text-center my-5'><ClockLoader/></div>
  return (
    <div>
      <h1 className='text-center'>휴지통</h1>
      <div>
        <input type="checkbox" onChange={onChangeAll} checked={list.length>0 && checked===list.length}/>
        <Button size="sm" className='mx-2'>영구삭제</Button>
        <Button size="sm" className='px-4' onClick={onReset}>복원</Button>
      </div>
        <Table>
           <tbody>
            {list.map(msg=>
                <tr key={msg.mid}>
                    <td><input type="checkbox" checked={msg.checked} onChange={(e)=>onChangeSingle(e, msg.mid)}/></td>
                    <td>{msg.type}</td>
                    <td>{msg.mid}</td>
                    <td>{msg.sendDelete===1 ? `보낸메시지 : ${msg.sender}` : `받은메시지: ${msg.receiver}`}</td>
                    <td>{msg.message.substring(0,30)}</td>
                    <td>{msg.sendDate}</td>
                </tr>
            )}
           </tbody>
        </Table>

      </div>
  )
}

export default DeletePage