import React from 'react'

interface Props { }

const Fallback: React.FC<Props> = () => {
  return (
    <React.Fragment>
      <p>Performing initial data load</p>
    </React.Fragment>
  )
}

Fallback.defaultProps = {}

export default Fallback
