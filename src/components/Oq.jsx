import React from 'react'

const Oq = () => {
  return (
    <div className='absolute bottom-2.5 right-6 z-[60] text-right pointer-events-none flex flex-row gap-3 items-end'>
      <p style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '2px', fontWeight: 500,}}>Powered by</p>
      <img style={{ width: '75px', height: 'auto' }} src="./logo.png" alt="Powered by OQULIX" />
    </div>
  )
}

export default Oq
