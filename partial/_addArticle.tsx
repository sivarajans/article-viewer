import React, { useState } from 'react';
import Modal from 'react-modal';
import { saveArticle } from '../common';
import styles from '../styles/Article.module.css'

export default function AddArticle({ emitRefresh }: any) {
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    const [desc, setDesc] = useState('');
    const [file, setFile] = useState(undefined);
    const [isError, setError] = useState(false);
    const [modalIsOpen, setIsOpen] = useState(false);

    function openModal() {
        setIsOpen(true);
    }
    function closeModal() {
        setIsOpen(false);
    }
    function submit(e: any) {
        e.preventDefault();

        if (title && desc && desc && file) {
            saveArticle(title, desc, url, file, callback);
        }
        else {
            setError(true)
        }
    }

    function callback(lastAdded: any) {
        closeModal();
        emitRefresh(lastAdded);
    }

    function getFile(el: any) {
        if (el.target.files && el.target.files[0]) {
            setFile(el.target.files[0]);
        }
    }

    return (
        <div>
            <button className='themeButton addArticle' onClick={openModal}>Add Article</button>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                ariaHideApp={false}
                style={{ content: { top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%', transform: 'translate(-50%, -50%)', } }}
                contentLabel="Add Modal"
            >
                <button onClick={closeModal}>X</button>

                <form className={styles.addForm}>
                    <div>
                        <span>Title</span>
                        <input type='text' onInput={el => setTitle((el.target as HTMLInputElement).value)}></input>
                    </div>
                    <div>
                        <span>URL</span>
                        <input type='text' onInput={el => setUrl((el.target as HTMLInputElement).value)}></input>
                    </div>
                    <div>
                        <span>Description</span>
                        <textarea onInput={el => setDesc((el.target as HTMLInputElement).value)}></textarea>
                    </div>
                    <div>
                        <span>Image</span>
                        <input type='file' onInput={el => getFile(el)}></input>
                    </div>
                    {isError && <div className='error'>Please fill the details</div>}
                    <button onClick={e => submit(e)}>Submit</button>
                </form>
            </Modal>
        </div >
    );
}