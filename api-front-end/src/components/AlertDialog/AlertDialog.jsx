import { useState, useEffect } from 'react';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import AlertTitle from '@mui/material/AlertTitle';

export default function AlertDialog(props) {
    const [showAlert, setShowAlert] = useState(props.state);

    useEffect(() => {
        setShowAlert(props.state)
    }, [props.state])

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setShowAlert(false);
    };

    return (
        <div>
            {showAlert && (
                <Snackbar open={showAlert} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                    <Alert onClose={handleClose} severity={props.alertType} variant='outlined' sx={{ bgcolor: 'background.paper' }}>
                        <AlertTitle>{props.alertTitle}</AlertTitle>
                        {props.alertMessage}
                    </Alert>
                </Snackbar>
            )}
        </div>
    );
}