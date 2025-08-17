import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import { Tabs } from '@mui/material';

export function Options(props) {
  const [value, setValue] = React.useState('costureira');

  const handleChange = (event, newValue) => {
      setValue(newValue);
      props.acao(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} variant='fullWidth'
          sx={{".Mui-selected": {color: 'white !important', backgroundColor: '#2D2D33'}}}>
            <Tab sx={{height:'5rem', fontSize:'1.2em'}} label={props.item1} value="costureira" />
            <Tab sx={{height:'5rem', fontSize:'1.2em'}} label={props.item2} value="fornecedor" />
          </Tabs>
        </Box>
    </Box>
  );
}