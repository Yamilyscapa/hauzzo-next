"use client";
import { useState, useEffect } from 'react';
import style from './Modal.module.scss';

export default function Modal({ children, isVisible, onClose }: { children?: React.ReactNode, isVisible: boolean, onClose?: () => void }) {
    // Use a local state to manage the visibility of the modal
    const [visible, setVisible] = useState(isVisible);

    function handleClose() {
        if (typeof onClose === 'function') {
            onClose();
        }
    }

    useEffect(() => {
        setVisible(isVisible);
    }, [isVisible]);

    return (
        <div className={`${style.modal_container} ${!visible ? "hidden" : ''}`}>
            <div className={`${style.modal}`}>
                <div className={`${style.modal_content}`}>

                    <div className={`${style.modal_header}`}>
                        <span className={`${style.close}`} onClick={() => handleClose()}>&times;</span>
                    </div>

                    {/* // This is the body of the modal, where you can place any content you want */}
                    <div className={`${style.modal_body}`}>
                        {children}
                    </div>
                </div>
            </div>

            <div className={`${style.modal_overlay}`} onClick={() => handleClose()}></div>
        </div>
    );
}