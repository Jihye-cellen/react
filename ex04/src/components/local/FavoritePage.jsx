import React, { useEffect, useState } from 'react'
import { app } from '../../firebaseInit'
import { getDatabase, ref, onValue, remove} from 'firebase/database'
import { Table, Button } from 'react-bootstrap'
import ModalMap from './ModalMap';
import { ClipLoader} from 'react-spinners'

const FavoritePage = () => {
  const [loading, setLoading] =useState(false);
  const [locals, setLocals] =useState([]);
  const db = getDatabase(app);
  const uid = sessionStorage.getItem('uid');

  const callAPI=()=>{
    onValue(ref(db, `favorite/${uid}`), res=>{
      let rows =[];
      let count =0;
      res.forEach(row=>{
        count++;
        rows.push({no:count, key:row.key, ...row.val()});
      });
      //console.log(rows);
      setLocals(rows);
      setLoading(false);
    });
  }


  useEffect (()=> {
    callAPI();
  }, []);

  const onClickDelete = (local) =>{
    if(window.confirm(`"${local.place_name}" 삭제하시겠습니까?`)){
      remove(ref(db, `favorite/${uid}/${local.key}`));
    }
  }



if(loading) return <h1 className='text-center my-5'><ClipLoader/></h1>
  return (
    <div>
        <h1 className='text-center my-5'>즐겨찾기</h1>
        <Table>
          <thead>
            <tr>
              <td>No.</td>
              <td>장소명</td>
              <td>전화번호</td>
              <td>주소</td>
              <td></td>
              <td></td>
            </tr>
          </thead>
          <tbody>
              {locals.map(local => 
                <tr key={local.key}>
                  <td>{local.no}</td>
                  <td>{local.place_name}</td>
                  <td>{local.phone || '-'}</td>
                  <td>{local.address_name}</td>
                  <td><ModalMap local={local}/></td>
                  <td><Button variant="secondary" size="sm" onClick={()=>onClickDelete(local)}>삭제</Button></td>
                </tr>
              )}
          </tbody>
        </Table>
    </div>
  )
}

export default FavoritePage