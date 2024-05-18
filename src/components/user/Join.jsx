import React, { useState } from 'react'
import { Row, Col, Form, InputGroup, Card, Button } from 'react-bootstrap'
import { app } from '../../firebaseInit'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

const Join = () => {
    const navi = useNavigate();
    const [loading, setLoading] = useState(false);
    const auth = getAuth(app);
    const [form, setForm] = useState({
        email: 'blue@test.com',
        pass: '12341234'
    });
    const {email, pass} = form;
    const onChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }
    const onSubmit = (e) => {
        e.preventDefault();
        if(email === '' || pass === '') {
            alert('이메일과 비밀번호를 입력하세요.');
        } else {
            setLoading(true)
            createUserWithEmailAndPassword(auth, email, pass)
            .then(success => {
                alert('가입 완료.');
                setLoading(false);
                navi('/login');
            })
            .catch(error => {
                alert('Error: ' + error.message);
                setLoading(false);
            })
        }
    }
    if(loading) return <h1 className='my-5'>Loading...</h1>
    return (
        <Row className='my-5 justify-content-center'>
            <Col md={6}>
                <Card>
                    <Card.Header>
                        <h3 className='text-center'>회원가입</h3>
                    </Card.Header>
                    <Card.Body>
                        <form onSubmit={onSubmit}>
                            <InputGroup className='mb-2'>
                                <InputGroup.Text style={{width:100}} className='justify-content-center'>
                                    Email
                                </InputGroup.Text>
                                <Form.Control name='email' value={email} onChange={onChange}/>
                            </InputGroup>
                            <InputGroup className='mb-2'>
                                <InputGroup.Text style={{width:100}} className='justify-content-center'>
                                    PW
                                </InputGroup.Text>
                                <Form.Control name='pass' type='password' value={pass} onChange={onChange}/>
                            </InputGroup>
                            <div>
                                <Button className='w-100' type='submit'>회원가입</Button>
                            </div>
                        </form>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    )
}

export default Join
