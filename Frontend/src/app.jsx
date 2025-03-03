import React from 'react'
import Home from './components/components_lite/Home'
import { createBrowserRouter , RouterProvider} from 'react-router-dom'
import Login from './components/authentication/Login'
import Signup from './components/authentication/Signup'
import Jobs from './components/components_lite/Jobs.jsx'
import Browse from './components/components_lite/Browse.jsx'
import Profile from './components/components_lite/Profile'

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
  }
]);

function App() {
  return (
    <div>
      <RouterProvider router={appRouter}></RouterProvider>
      
    </div>
  )
}

export default App
