import { useEffect, useState } from 'react';
import { getMessagesUsingRecieverEmail } from '../../aws_services/dynamo_db';

import '../listMessages.styles.css'

const Messages = ({ receiverEmail }) => {
    const [messages, setMessages] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const pageSize = 2;
    const onlyStarred = false;
    const onlyFlagged = false;

    const fetchMessages = async () => {
        try {
            const data = await getMessagesUsingRecieverEmail(receiverEmail, onlyStarred, onlyFlagged, currentPage, pageSize);
            setMessages(data.results);
            setTotalPages(data.totalPages);
        } catch (err) {
            console.error(err);
        }
    };

    const handlePrevPage = () => {
        setCurrentPage((prevPage) => prevPage - 1);
    };

    const handleNextPage = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };

    useEffect(() => {
        fetchMessages();
    }, [currentPage]);

    return (
        <>
            <ul>
                {messages.map((message) => (
                    <li key={message.messageID.S}>
                        {message.starredByReciever.BOOL && <span>⭐</span>}
                        {message.flaggedImportantBySender.BOOL && <span>🚩</span>}
                        {message.contents.S}
                    </li>
                ))}
            </ul>
            <div>
                <button onClick={handlePrevPage} disabled={currentPage === 1}>
                    Prev
                </button>
                <span>
                    {currentPage} of {totalPages}
                </span>
                <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                    Next
                </button>
            </div>
        </>
    );
};

export default Messages;
