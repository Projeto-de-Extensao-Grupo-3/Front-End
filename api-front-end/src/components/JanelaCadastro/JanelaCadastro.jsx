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
import TextField from '@mui/material/TextField';
import { SelectOptions } from '../SelectOptions/SelectOptions';

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
    setOpen(false);
  };

  const updateDados = (index, novoValor) => {
    let dadosCopia = JSON.parse(JSON.stringify(dados));
    dadosCopia[index][1] = novoValor;
    setDados(dadosCopia);
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
        <DialogTitle sx={{ m: 0, p: 2, fontSize:'2rem' }} id="customized-dialog-title">
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
              props.func(dados); 
              handleClose();
            }} id="form-cadastro" style={{display:'flex', justifyContent:'space-evenly'}}>
              {dados.length > 0 ? (
                <div>
                    { dados.map((item, index) => index >= props.start_index && index < props.break_index ? (
                      <>
                        <h2>{props.campos[index]}</h2>
                        <TextField key={index} required={true} defaultValue={item[1]} onChange={(e) => updateDados(index, e.target.value)} sx={{width:'35vw', marginBottom:'3rem'}} id="outlined-basic" variant="outlined" />
                      </>
                    ) : <></> )}
                </div>
                ) : (<p>ERRO</p>)}
              {dados.length > 0 ? (
                <div>
                    { dados.map((item, index) => index >= props.break_index ? (
                      <>
                        <h2>{props.campos[index]}</h2>
                        { Array.isArray(item[1]) ?
                          <SelectOptions dados={item[1].map((dado) => dado.descricao)} lista={props.lista}></SelectOptions>
                          :
                          <TextField key={index} required={true} defaultValue={item[1]} onChange={(e) => updateDados(index, e.target.value)} 
                          sx={{width:'35vw', marginBottom:'3rem'}} id="outlined-basic" variant="outlined" />
                        }
                      </>
                    ) : <></> )}
                </div>
                ) : (<p>ERRO</p>)}
          </form>
        </DialogContent>
        <DialogActions sx={{display:'flex', justifyContent:'center'}}>
          <Button type='submit' form='form-cadastro' autoFocus sx={{
            color:'white', fontSize:'1.5rem', border:'2px solid black', backgroundColor:'blue'
            }}>
            {props.message}
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
}