import React from 'react'
import routes from '@/router'
import { ConfigProvider } from 'zarm'
import { useLocation, useRoutes } from 'react-router-dom'
import NavBar from '@/components/Nav'
import { useState } from 'react'
import { useEffect } from 'react'
import './index.css'
// import 'zarm/dist/zarm.css'
function App() {
  const location = useLocation()
  const { pathname } = location
  const needNav = ['/user','/data','/']
  const [ showNav, setShowNav ] = useState(false)

  useEffect(()=>{
    setShowNav(needNav.includes(pathname))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[pathname])

  return (
    <>
      <ConfigProvider primaryColor={'#007fff'} >
        <div>
          {useRoutes(routes)}
        </div>
      </ConfigProvider>
      <NavBar showNav={showNav} />
    </>
  )
}

export default App
