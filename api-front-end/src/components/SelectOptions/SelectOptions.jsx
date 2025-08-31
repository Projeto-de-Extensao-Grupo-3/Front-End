import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';

export function SelectOptions(props) {
  const [listaName, setListaName] = React.useState(props.lista === undefined ? [] : props.lista);
  let dados = props.dados
  console.log(dados)
  console.log(listaName)

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;

    let duplicateRemoved = [];

    value.forEach((item) => {
      if (duplicateRemoved.findIndex((o) => o.descricao == item.descricao) >= 0) {
        duplicateRemoved = duplicateRemoved.filter((x) => x.descricao == item.descricao);
      } else {
        duplicateRemoved.push(item);
      }
    });

    dados = duplicateRemoved;
  };

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-checkbox-label">Lista</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={dados}
          onChange={handleChange}
          renderValue={(selected) => selected.map((x) => x.name).join(', ')}
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