import { Outlet } from 'react-router-dom'
import Header from 'src/Components/Header'
import Sidebar from 'src/Components/Sidebar'
import SimpleBar from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css'
import { useEffect, useRef, useState } from 'react'

function MainLayout() {
  const [maxHeight, setMaxHeight] = useState<number>(0)
  const crollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (crollRef?.current) {
      setMaxHeight(window.innerHeight - crollRef.current.offsetHeight - 16)
    }
  }, [crollRef])

  return (
    <>
      <Header ref={crollRef} />
      <div className='flex'>
        <div className='basis-1/5'>
          <Sidebar />
        </div>
        <SimpleBar style={{ maxHeight: `${maxHeight}px`, height: `${maxHeight}px`, flexGrow: 1, padding: '16px' }}>
          <Outlet context={maxHeight} />
        </SimpleBar>
      </div>
    </>
  )
}

export default MainLayout
