import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

export function BarraPesquisa(props) {
  return (
    <Paper
      component="form"
      sx={{ p: '0.5rem 1rem', display: 'flex', alignItems: 'center', width: '60vw', border: "1px solid black" }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder={props.busca}
        onChange={(e) => props.func(e.target.value)}
      />
      <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}