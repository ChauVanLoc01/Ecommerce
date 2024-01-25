import { useState } from 'react'

type UnderlineProps = {
  rootClassName?: string
  itemClassName?: string
  contents: string[]
}

function Underline({ contents, itemClassName, rootClassName }: UnderlineProps) {
  const [position, setPosition] = useState<{
    width: number
    left: number
  }>({
    width: 59,
    left: 0
  })
  const handlePosition = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setPosition({
      width: e.currentTarget.clientWidth,
      left: e.currentTarget.offsetLeft
    })
  }
  return (
    <div className={`${rootClassName} relative`}>
      {contents.map((e, i) => (
        <button onClick={handlePosition} key={i} className={itemClassName}>
          {e}
        </button>
      ))}
      <span
        className={`h-0.5 rounded-full duration-300 bg-primary absolute bottom-0`}
        style={{
          left: position.left,
          width: position.width
        }}
      />
    </div>
  )
}

export default Underline
