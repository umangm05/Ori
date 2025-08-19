import React from 'react'
import OryProvider from '../../Providers/OryProvider'

function Dashboard() {
  return (
    <div>Dashboard</div>
  )
}

export default ()=> <OryProvider><Dashboard/></OryProvider>