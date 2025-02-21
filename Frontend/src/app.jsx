import React from 'react'
import Home from './components/components_lite/Home'
import { createBrowserRouter , RouterProvider} from 'react-router-dom'
import Login from './components/authentication/Login'
import Signup from './components/authentication/Signup'


const appRouter = createBrowserRouter([
  {
    path: '/', element: <Home />
  },
  {
    path: '/login', element: <Login />
  },
  {
    path: '/signup', element: <Signup />
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
