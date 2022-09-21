import React from 'react';
import { CircularProgress } from '@mui/material';
import { CheckCircle, Pending, Error } from '@mui/icons-material';

function StatusIcon(data:any) {
    switch(data.status) {
        case 'RUNNING':
            return (<CircularProgress/>);
        case 'PENDING':
            return (<Pending/>);
        case 'FAILED':
            return (<Error/>);
        case 'SUCCESS':
            return (<CheckCircle/>);
        default:
            return (<></>);
      }
}

export default StatusIcon
