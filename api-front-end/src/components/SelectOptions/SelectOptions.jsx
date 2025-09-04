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
  
  console.log(dados)

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setDados(
      typeof value === 'string' ? value.split(',') : value,
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
          renderValue={(selected) => selected.map((item) => item).join(', ')}
        >
          {opcoes.map((opcao) => (
            <MenuItem key={opcao} value={opcao}>
              <Checkbox
                checked={
                  dados.includes(opcao)
                }
              />
              <ListItemText primary={opcao} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}