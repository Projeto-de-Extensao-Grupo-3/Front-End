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
    var listaPermissoes = typeof value === 'string' ? value.split(',') : value;
    var lastElement = opcoes.find(permissao => permissao.descricao === value[value.length-1])
    listaPermissoes[listaPermissoes.length-1] = lastElement;
    console.log(listaPermissoes)
    setDados(
      listaPermissoes
    );
  };

  return (
    <div>
      <FormControl sx={{width:'35vw', marginBottom:'3rem'}}>
        <InputLabel id="demo-multiple-checkbox-label">Lista</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={dados}
          onChange={handleChange}
          renderValue={(selected) => selected.map((item) => item.descricao).join(', ')}
        >
          {opcoes.map((opcao) => (
            <MenuItem key={opcao.idPermissao} value={opcao.descricao}>
              <Checkbox
                checked={
                  dados.map(item => item.idPermissao).includes(opcao.idPermissao)
                }
              />
              <ListItemText primary={opcao.descricao} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}