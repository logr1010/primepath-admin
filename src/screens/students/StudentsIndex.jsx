import React from 'react';
import { Outlet } from 'react-router-dom';

export default function StudentsIndex() {
  return (
    <div className='flex flex-col flex-1'>
    <Outlet/>
   </div>
  )
}
