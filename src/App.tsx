import React from 'react'
import { Router, Link } from '@reach/router'
import styled from 'styled-components'

import Home from './pages/Home'

const PageContainer = styled.main`
  display: flex;
  min-height: 1vh;
  justify-content: center;
`

const App: React.FC = () => {
  return (
    <PageContainer>
      <Router>
        <Home path="/" />
      </Router>
    </PageContainer>
  )
}

export default App
