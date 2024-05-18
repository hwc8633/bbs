import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Table, Row, Col, Form, Button, InputGroup } from 'react-bootstrap'
import { app } from '../../firebaseInit'
import { getDatabase, ref, set ,get } from 'firebase/database'
import { useNavigate } from 'react-router-dom'

const Locals = () => {
    const navi = useNavigate();
    const db = getDatabase(app);
    const uid = sessionStorage.getItem('uid');
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState('인하대학교');
    const [page, setPage] = useState(1);
    const [last, setLast] = useState();
    const [locals, setLocals] = useState([]);

    const callAPI = async () => {
        setLoading(true);
        const url = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${query}&size=10&page=${page}`;
        const config = {
            headers: { 'Authorization': 'KakaoAK d613f686f5afd3c2407f5af2bc0c4cc1' }
        };
        const res = await axios.get(url, config);
        setLocals(res.data.documents);
        console.log(res.data);
        setLast(res.data.meta.is_end);
        setLoading(false);
    }

    const onClickFavorite = async (local) => {
        if(uid) {
            if(window.confirm(`즐겨찾기에 추가합니다.`)) {
                console.log(local);
                await get(ref(db, `favorite/${uid}/${local.id}`)).then(async snapshot => {
                    if(snapshot.exists()) {
                        alert('이미 즐겨찾기에 등록되었습니다.');
                    } else {
                        await set(ref(db, `favorite/${uid}/${local.id}`), local);
                        alert('등록되었습니다.')
                    }
                });
            }
        } else {
            sessionStorage.setItem('target', '/locals');
            navi('/login');
        }
    }

    useEffect(() => {
        callAPI();
    }, [page]);

    const onSubmit = (e) => {
        e.preventDefault();
        if(query === "") {
            alert("검색어를 입력하세요.");
        } else {
            callAPI();
            setPage(1);
        }
    }

    if (loading) return <h1 className='my-5'>Loading...</h1>
    return (
        <div>
            <h1 className='my-5'>지역검색</h1>
            <Row className='mb-2'>
                <Col xs={8} md={6} lg={4}>
                    <form onSubmit={onSubmit}>
                        <InputGroup>
                            <Form.Control onChange={(e) => setQuery(e.target.value)} placeholder='검색어' value={query}/>
                            <Button type='submit'>검색</Button>
                        </InputGroup>
                    </form>
                </Col>
            </Row>
            <Table striped bordered hover>
                <thead>
                    <tr className='text-center'>
                        <td>ID</td>
                        <td>장소명</td>
                        <td>주소</td>
                        <td>전화</td>
                        <td>즐겨찾기</td>
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
                                <Button variant='warning' size='sm' onClick={() => onClickFavorite(local)}>즐겨찾기</Button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
            <div className='text-center my-3'>
                <Button disabled={page === 1} onClick={() => setPage(page - 1)}>이전</Button>
                <span className='mx-2'>{page}</span>
                <Button disabled={last} onClick={() => setPage(page + 1)}>다음</Button>
            </div>
        </div>

    )
}

export default Locals
