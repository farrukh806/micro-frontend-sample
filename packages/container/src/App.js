import React from 'react'
import Marketing from './components/Marketing'
import Header from './components/Header'
import { BrowserRouter } from 'react-router-dom'

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Header />
        <Marketing />
      </BrowserRouter>
    </div>
  )
}

export default App