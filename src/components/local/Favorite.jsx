import React, { useEffect, useState } from 'react'
import { app } from '../../firebaseInit'
import { getDatabase, onValue, ref, remove } from 'firebase/database'
import { Table, Button } from 'react-bootstrap'

const Favorite = () => {
    const [loading, setLoading] = useState(false);
    const db = getDatabase(app);
    const uid = sessionStorage.getItem('uid');
    const [locals, setLocals] = useState([]);

    const callAPI = () => {
        setLoading(true);
        onValue(ref(db, `favorite/${uid}`), snapshot => {
            let rows = [];
            snapshot.forEach(row => {
                rows.push({...row.val()});
            });
            console.log(rows);
            setLocals(rows);
            setLoading(false);
        });
    }

    const onClickDelete = async (local) => {
        if(window.confirm(`${local.id} 번 즐겨찾기 삭제합니다.`)) {
            await remove(ref(db, `favorite/${uid}/${local.id}`));
        }
    }

    useEffect(() => {
        callAPI();
    }, []);

    if(loading) return <h1 className='my-5'>Loading...</h1>
    return (
        <div>
            <h1 className='my-5'>즐겨찾기</h1>
            <Table striped bordered hover>
                <thead>
                    <tr className='text-center'>
                        <td>ID</td>
                        <td>장소명</td>
                        <td>주소</td>
                        <td>전화</td>
                        <td>삭제</td>
                    </tr>
                </thead>
                <tbody>
                    {locals.map(local =>
                        <tr key={local.id}>
                            <td>{local.id}</td>
                            <td>{local.place_name}</td>
                            <td>{local.road_address_name}</td>
                            <td>{local.phone}</td>
                            <td>
                                <Button variant='danger' size='sm' onClick={() => onClickDelete(local)}>삭제</Button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>
    )
}

export default Favorite
