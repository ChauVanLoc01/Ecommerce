import { IconContext } from 'react-icons'

type IconProps = {
  icon: React.ReactNode
  size?: string
  color?: string
  className?: string
  children?: React.ReactNode
}

function Icon({ icon, color, className, size, children }: IconProps) {
  return (
    <IconContext.Provider
      value={{
        size: size ? size : '26px',
        color,
        className
      }}
    >
      {icon}
      {children}
    </IconContext.Provider>
  )
}

export default Icon
