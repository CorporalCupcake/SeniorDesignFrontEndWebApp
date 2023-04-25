import React from 'react';

const Message = ({ message }) => {
    const messageId = message.messageID.S;
    const [fromEmail, toEmail, date, time] = messageId.split(';');
    const contents = message.contents.S;
    const flaggedImportantBySender = message.flaggedImportantBySender.BOOL;
    const hasBeenOpened = message.hasBeenOpened.BOOL;
    const starredByReceiver = message.starredByReceiver.BOOL;

    return (
        <div className="message">
            <div className="message-header">
                <span className="message-from">{fromEmail}</span>
                <span className="message-to">{toEmail}</span>
                <span className="message-date">{date}</span>
                <span className="message-time">{time}</span>
            </div>
            <div className="message-body">
                <span className="message-contents">{contents}</span>
            </div>
            <div className="message-footer">
                {flaggedImportantBySender && <span className="message-important">Important</span>}
                {hasBeenOpened && <span className="message-opened">Opened</span>}
                {starredByReceiver && <span className="message-starred">Starred</span>}
            </div>
        </div>
    );
};

export default Message;
