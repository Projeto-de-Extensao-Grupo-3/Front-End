import * as React from 'react';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

export function JanelaDeletar(props) {
    const [open, setOpen] = React.useState(false);
    const [confirmButtonDisabled, setConfirmButtonDisabled] = React.useState(true);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const handleInputChange = (event) => {
        const inputValue = event.target.value;
        if (inputValue === "excluir permanentemente") {
            setConfirmButtonDisabled(false);
        } else {
            setConfirmButtonDisabled(true);
        }
    }

    return (
        <React.Fragment>
            <div onClick={handleClickOpen}>
                {props.children}
            </div>
            <BootstrapDialog maxWidth={false}
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <DialogTitle sx={{ m: 3, p: 2, fontSize: '1.5rem', textAlign: 'center' }} id="customized-dialog-title">
                    Deseja apagar permanentemente os dados de {props.dadoTitle}?
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={(theme) => ({
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: theme.palette.grey[500],
                    })}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent dividers>
                    <div id="form-cadastro" style={{ height: `25vh`, width: '90%', display: 'flex', flexDirection: 'column', padding: '1rem' }}>
                        <p>Para apagar, digite <b>excluir permanentemente</b> no campo abaixo:</p>
                        <br />
                        <TextField required={true} variant="outlined" placeholder={"excluir permanentemente"}
                            onChange={handleInputChange} />
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-evenly', marginTop: '2rem' }}>
                            <Button onClick={handleClose} sx={{ color: 'white', fontSize: '1.2rem', border: '2px solid black', backgroundColor: 'rgba(180, 62, 62, 1)' }}>
                                Cancelar
                            </Button>
                            <Button disabled={confirmButtonDisabled} onClick={() => { props.deleteFunc(); handleClose() }} sx={{"&.Mui-disabled": {background: "#537d9dff", color: "#aba7a7ff", border: '1px solid black' }, color: 'white', fontSize: '1.2rem', border: '2px solid black', backgroundColor: 'rgba(68, 132, 199, 1)' }}>
                            Confirmar
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </BootstrapDialog>
        </React.Fragment >
    );
}