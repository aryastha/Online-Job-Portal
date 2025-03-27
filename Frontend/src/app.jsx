import React from 'react'
import Home from './components/components_lite/Home'
import { createBrowserRouter , RouterProvider} from 'react-router-dom'
import Login from './components/authentication/Login'
import Signup from './components/authentication/Signup'
import Jobs from './components/components_lite/Jobs.jsx'
import Browse from './components/components_lite/Browse.jsx'
import Description from './components/components_lite/Description.jsx'
import Profile from './components/components_lite/Profile.jsx'
import Companies from './components/admincomponents/Companies.jsx'
import CompanyCreate from './components/admincomponents/CompanyCreate.jsx'

const appRouter = createBrowserRouter([
  {
    path: '/', element: <Home />
  },
  {
    path: '/login', element: <Login />
  },
  {
    path: '/register', element: <Signup />
  },
  {
    path: '/jobs', element: <Jobs />
  },
  {
    path: '/browse', element: <Browse />
  },
  {
    path: '/profile', element: <Profile />
  },
  {
    path: '/description/:id', element: <Description />
  },
  //admin
  {
    path:"/admin/companies",element: <Companies />
  },
  {
    path:"/admin/companies/create",element: <CompanyCreate />
  },
 
]);

function App() {
  return (
    <div>
      <RouterProvider router={appRouter}></RouterProvider>
      
    </div>
  )
}

export default App
