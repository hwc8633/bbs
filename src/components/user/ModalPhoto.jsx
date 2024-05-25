import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { app } from '../../firebaseInit'
import { getStorage, uploadBytes, ref, getDownloadURL } from 'firebase/storage'
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const ModalPhoto = ({setLoading, form, setForm}) => {
    const storage = getStorage(app);
    const db = getFirestore(app);
    const uid = sessionStorage.getItem('uid');
    const [fileName, setFilename] = useState();
    const [file, setFile] = useState(null);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const style = {
        cursor: 'pointer',
        borderRadius: '50%',
        width: '80px',
        marginBottom: '10px'
    }
    const style1 = {
        cursor: 'pointer',
        borderRadius: '50%',
        width: '200px',
        marginBottom: '10px'
    }
    const onChangeFile = (e) => {
        setFilename(URL.createObjectURL(e.target.files[0]));
        setFile(e.target.files[0]);
    }

    const onClickSave = async () => {
        if(!file) {
            alert('이미지를 선택하세요.');
            return;
        }
        if(!window.confirm('이미지를 변경합니다.')) return;
        // Change Image
        setLoading(true);
        const res = await uploadBytes(ref(storage, `photo/${Date.now()}.jpg`), file);
        const url = await getDownloadURL(res.ref);
        await setDoc(doc(db, `users/${uid}`), {...form, photo:url});
        setForm({...form, photo:url});
        setLoading(false);
    }

    return (
        <>
            <img src={form.photo || "http://via.placeholder.com/80x80"} style={style} onClick={handleShow}/>

            <Modal
                style={{ top: '30%' }}
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>사진 변경</Modal.Title>
                </Modal.Header>
                <Modal.Body className='text-center'>
                    <img src={fileName || 'http://via.placeholder.com/200x200'} style={style1}/>
                    <Form.Control type="file" onChange={onChangeFile}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button onClick={onClickSave}>Save</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ModalPhoto
