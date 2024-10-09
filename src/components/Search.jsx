import React from 'react'
import { IconButton, InputBase, Box } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search';
export default function Search(props) {
  const SearchQuery = (e) => {
    if (props?.name === "users") {
      props?.handleSearch(e)
    }
    if (props?.name === "subject") {
      props?.handleSearch(e)
    }
    if (props?.name === "lecture") {
      props?.handleSearch(e)
    }
    if (props?.name === "student") {
      props?.handleSearch(e)
    }
    if (props?.name === "history") {
      props?.handleSearch(e)
    }
    if (props?.name === "course") {
      props?.courseSearch(e)
    }
  }
  return (
    <Box size="small" className='h-[40px] flex border border-gray-300 rounded-md'>
      <IconButton>
        <SearchIcon/>
      </IconButton>
      <InputBase placeholder='Search' onChange={SearchQuery}  />
    </Box>
  )
}
