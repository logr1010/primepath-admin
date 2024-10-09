import * as React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Stack from '@mui/material/Stack';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
export default function Breadcrumb(props) {
  return (
    <Stack spacing={2}>
      
      <Breadcrumbs
        separator={'/'}
        aria-label="breadcrumb"
      >
        {props?.breadcrumbs}
      </Breadcrumbs>
    </Stack>
  );
}