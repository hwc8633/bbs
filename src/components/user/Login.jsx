import React, { useState } from 'react'
import { Row, Col, Form, InputGroup, Card, Button } from 'react-bootstrap'
import { app } from '../../firebaseInit'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

const Login = () => {
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
            signInWithEmailAndPassword(auth, email, pass)
            .then(success => {
                setLoading(false);
                sessionStorage.setItem('email', email);
                sessionStorage.setItem('uid', success.user.uid);
                if(sessionStorage.getItem('target')) {
                    navi(sessionStorage.getItem('target'));
                } else {
                    navi('/');
                }
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
                        <h3 className='text-center'>로그인</h3>
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
                                <Button className='w-100' type='submit'>로그인</Button>
                            </div>
                            <div className='text-end'>
                                <a href='/join'>회원가입</a>
                            </div>
                        </form>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    )
}

export default Login
