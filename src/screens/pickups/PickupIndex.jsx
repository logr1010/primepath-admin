import React from 'react';
import { Outlet } from 'react-router-dom'
export default function PickupsIndex() {
    return (
        <div className='flex flex-col flex-1 overflow-hidden'>
            <Outlet />
        </div>
    )
}
