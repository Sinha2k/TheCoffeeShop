import React from 'react';

const Dialog = ({content,description,show,confirm,cancel}) => {
    if(!show){
        return <></>
    }
    return (
        <div>
            <div className="overlay">
                <div className="dialog">
                <div className="dialog__content">
                    <h2 className="dialog__title">{content}</h2>
                    <p className="dialog__description">{description}</p>
                </div>
                <hr />
                <div className="dialog__footer">
                    <button onClick={cancel} className="dialog__cancel">Thoát</button>
                    <button onClick={confirm} className="dialog__confirm">Tiếp tục</button>
                </div>
                </div>
            </div>
        </div>
    );
}

export default Dialog;
