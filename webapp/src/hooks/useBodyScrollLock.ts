import React from 'react'

export const useBodyScrollLock = (): [boolean, React.Dispatch<boolean>] => {
  const bodyStyle = document.body.style
  const [bodyScrollLock, setBodyScrollLock] = React.useState(bodyStyle.overflowY === 'hidden')

  React.useEffect(() => {
    document.body.style.overflow = bodyScrollLock ? 'hidden' : 'auto'
  }, [bodyScrollLock, bodyStyle])

  return [bodyScrollLock, setBodyScrollLock]
}
