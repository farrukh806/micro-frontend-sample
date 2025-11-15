import React from 'react'
import Marketing from './components/Marketing'
import Header from './components/Header'
import { BrowserRouter } from 'react-router-dom'
import { StylesProvider, createGenerateClassName } from '@material-ui/core/styles'

const generateClassName = createGenerateClassName({
  productionPrefix: 'co',
})

const App = () => {
  return (
    <StylesProvider generateClassName={generateClassName}>
      <BrowserRouter>
        <Header />
        <Marketing />
      </BrowserRouter>
    </StylesProvider>
  )
}

export default App