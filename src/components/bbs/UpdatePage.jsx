import React, { useEffect, useState } from 'react'
import { Row, Col, Form, Button } from 'react-bootstrap'
import { app } from '../../firebaseInit'
import { getFirestore, collection, addDoc, getDoc, doc, updateDoc } from 'firebase/firestore'
import { useParams } from 'react-router-dom'

const UpdatePage = () => {
    const [form, setForm] = useState(
        {
            contents: '',
            title: '',
            email: '',
            date: ''
        }
    );
    const db = getFirestore(app);
    const {id} = useParams();
    const callAPI = async() => {
        const res = await getDoc(doc(db, `/posts/${id}`));
        setForm(res.data());
        console.log(res.data());
    }
    const {contents, title, email, date} = form;

    useEffect(() => {
        callAPI();
    }, []);

    const onChangeForm = (e) => {
        setForm({...form, [e.target.name]:e.target.value});
    }

    const onClickUpdate = async() => {
        if(!window.confirm(`${id}번 게시글을 수정합니다.`)) return;
        await updateDoc(doc(db, `posts/${id}`), form);
        window.location.href=`/bbs/read/${id}`;
    }

    return (
        <Row className='my-5 justify-content-center'>
            <Col xs={12} md={10} lg={8}>
                <h1>글수정</h1>
                <div className='mt-5'>
                    <Form.Control name='title' value={title} placeholder='제목을 입력하세요.' className='mb-2' onChange={onChangeForm}/>
                    <Form.Control name='contents' value={contents} as='textarea' rows={10} placeholder='내용을 입력하세요.' onChange={onChangeForm}/>
                    <div className='text-center mt-3'>
                        <Button onClick={onClickUpdate} className='px-5 me-2'>수정</Button>
                        <Button className='px-5' variant='secondary'>취소</Button>
                    </div>
                </div>
            </Col>
        </Row>
    )
}

export default UpdatePage
