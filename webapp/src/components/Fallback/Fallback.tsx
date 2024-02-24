import React from 'react'

interface Props { }

const Fallback: React.FC<Props> = () => {
  return (
    <>
      <p>Performing initial data load</p>
    </>
  )
}

Fallback.defaultProps = {}

export default Fallback
