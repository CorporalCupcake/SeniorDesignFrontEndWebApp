import React from "react";
import { putItem } from "../aws_services/dynamo_db";
import Button from 'react-bootstrap/Button';


const TempPage = () => (
    <div>
        <Button 
            onClick={ () => putItem({
                TableName: 'sandbox', 
                Item: {
                    id: {S: '2'},
                    CUSTOMER_NAME: {S:"Tom Hanks"}
                }
            })}
            variant="primary"
        >
            CLICK ME TO ADD ITEM
        </Button> {' '}
    </div>
) 

export default TempPage;