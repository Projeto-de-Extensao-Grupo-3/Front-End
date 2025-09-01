import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';

export function SelectOptions(props) {
  const [listaName, setListaName] = React.useState(props.lista === undefined ? [] : props.lista);
  const [dados, setDados] = React.useState(props.dados)
  
  console.log(dados)

  const handleChange = (event) => {
    const { value } = event.target;
    console.log(value);

    let duplicateRemoved = [...listaName];

    if (value.length > 0) {
        value.forEach((item) => {
          if (duplicateRemoved.findIndex((o) => o.descricao == item.descricao) >= 0) {
            duplicateRemoved = duplicateRemoved.filter((x) => x.descricao == item.descricao);
          } else {
            duplicateRemoved.push(item);
          }
        });
    } else {
        duplicateRemoved = [];
    }

    setDados(duplicateRemoved);
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
          renderValue={(selected) => selected.map((x) => x.descricao).join(', ')}
        >
          {listaName.map((dado) => (
            <MenuItem key={dado.descricao} value={dado}>
              <Checkbox
                checked={
                  dados.findIndex((item) => item.descricao == dado.descricao) >= 0
                }
              />
              <ListItemText primary={dado.descricao} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}