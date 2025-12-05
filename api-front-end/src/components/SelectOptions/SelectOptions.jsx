import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';

export function SelectOptions(props) {
  const [opcoes, setOpcoes] = React.useState(props.lista === undefined ? [] : props.lista);
  const [dados, setDados] = React.useState(props.dados)
  

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    console.log(value)
    var listaOpcoes = typeof value === 'string' ? value.split(',') : value;
    setDados(
      listaOpcoes
    );

    var listaJson = opcoes.filter(opcao => listaOpcoes.includes(opcao[props.chave]))
    console.log(listaJson)
    props.func(listaJson);
  };

  return (
    <div>
      <FormControl sx={{width:'95%', marginBottom:'2rem'}}>
        <InputLabel id="demo-multiple-checkbox-label"></InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={dados}
          onChange={handleChange}
          size='small'
          renderValue={(selected) => selected.join(', ')}
        >
          {opcoes.map((opcao) => (
            <MenuItem key={opcao[props.id]} value={opcao[props.chave]}>
              <Checkbox
                checked={
                  dados.includes(opcao[props.chave])
                }
              />
              <ListItemText primary={opcao[props.chave]} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}