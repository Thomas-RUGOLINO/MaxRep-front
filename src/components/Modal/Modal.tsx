import './Modal.scss';

interface ModalProps { 
    title: string,
    isOpen: boolean, //Boolean to open modal
    onClose: () => void, //Function to close modal
    children: React.ReactNode //Modal content
}

const Modal = ({title, isOpen, onClose, children}: ModalProps) => { 

    if (!isOpen) return null; //If modal is not open, return null

    return (
        <>
            <div className="modal">
                <div className="modal__container">
                    <div className="modal__header">
                        <h3 className="modal__title">{title}</h3>
                        <button className="modal__close" onClick={onClose}> 
                            <i className="fa-solid fa-circle-xmark"></i> 
                        </button>
                    </div>
                    <div className="modal__content">
                        {children}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Modal;