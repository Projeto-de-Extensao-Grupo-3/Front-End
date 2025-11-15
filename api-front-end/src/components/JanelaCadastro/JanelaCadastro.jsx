import * as React from 'react';
import { useEffect } from "react";
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

// REFATORAR -> REMOVER A LÓGICA DE GERAÇÃO DE INPUTS DINÂMICA
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export function JanelaCadastro(props) {
  const [open, setOpen] = React.useState(false);
  const [dados, setDados] = React.useState(props.dados === undefined ? props.vazio : props.dados);

  useEffect(() => {
    setDados(props.dados === undefined ? props.vazio : props.dados)
  }, [props.dados])

  const handleClickOpen = () => {
    console.log("DADOS")
    console.log(dados);
    setOpen(true);
  };
  const handleClose = () => {
    console.log("close")
    if (props.limparCampos !== undefined) props.limparCampos();
    setOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  }

  return (
    <React.Fragment>
      <div onClick={handleClickOpen}>
        {props.children}
      </div>
      <BootstrapDialog fullWidth maxWidth='lg'
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2, fontSize: '1.5rem' }} id="customized-dialog-title">
          {props.action}
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
          <form onSubmit={(e) => {
            handleSubmit(e);
            handleClose();
            console.log(dados)
            props.func(dados);
          }} id="form-cadastro" style={{ display: 'flex', justifyContent: 'space-evenly' }}>
            {props.form}
          </form>
        </DialogContent>
        <DialogActions sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button disabled={props.cadastroDisabled} type='submit' form='form-cadastro' autoFocus sx={{
            "&.Mui-disabled": {background: "#537d9dff", color: "#aba7a7ff", border: '1px solid black' },
            color: 'white', fontSize: '1.2rem', border: '2px solid black', backgroundColor: 'rgba(68, 132, 199, 1)'
          }}>
            {props.message}
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
}