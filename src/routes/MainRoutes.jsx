import React from 'react'
import { Routes, Route } from 'react-router-dom';
import Login from '../screens/Login';
import Users from '../screens/users/Users';
import Index from '../screens/AdminHome/Index';
import UsersIndex from '../screens/users/UsersIndex';
import Students from '../screens/students/Students';
import Studentsdetail from '../screens/students/Studentsdetail';
import SettingsIndex from '../screens/settings/SettingsIndex';
import Settings from '../screens/settings/Settings';
import StudentsIndex from '../screens/students/StudentsIndex';
import Subject from '../screens/users/Subject';
import Lecture from '../screens/users/Lecture';
import DynamicTable from '../components/DynamicTable';
import PickupAgentsIndex from '../screens/pickupagents/PickupAgentsIndex';
import PickupAgents from '../screens/pickupagents/PickupAgents';
export default function MainRoutes() {
  return (
    <Routes>
      <Route path="table" element={<DynamicTable />} />
      <Route path="" element={<Login />} />
      <Route path="login" element={<Login />} />
      <Route path='/admin' element={<Index />} >
        <Route path='' element={<Users />} />
        <Route path='users' element={<UsersIndex />}>
          <Route path='' element={<Users />} />
          <Route path='subjects' element={<Subject />} />
          <Route path='subjects/lecture' element={<Lecture />} />
        </Route>
        <Route path='pickup-agents' element={<PickupAgentsIndex />}>
          <Route path='' element={<PickupAgents />} />
        </Route>
        <Route path='students' element={<StudentsIndex />}>
          <Route path='' element={<Students />} />
          <Route path='profile' element={<Studentsdetail />} />
        </Route>
        <Route path='settings' element={<SettingsIndex />}>
          <Route path='' element={<Settings />} />
        </Route>
      </Route>
    </Routes>
  )
}


// ROUTES
/**
 * LOGIN
 * USERS - DETAILS - BASIC AND ADDRESSES AND PICKUPS
 * PICKUP AGENTS - VERIFICATION AND DETAILS SCREEN
 * PICKUPS - DOMESTIC AND LOCAL - DETAILS
 * SETTINGS
 * PAYOUT
 */