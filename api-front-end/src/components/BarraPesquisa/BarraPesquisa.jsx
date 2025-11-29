import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

export function BarraPesquisa(props) {
  var width = '60vw'
  if (props.width != null) {
    width = props.width
  }
  return (
    <Paper
      component="form"
      sx={{ p: '0.5rem 1rem', display: 'flex', alignItems: 'center', width: width, border: "1px solid black",
        '&:focus-within': { border: '2px solid blue'}
       }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder={props.busca}
        onChange={(e) => props.func(e.target.value)}
        onKeyDown={(e) => {if (e.key === 'Enter') e.preventDefault()}}
      />
      <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}