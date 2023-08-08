import { FC } from "react"
import { twJoin } from "tailwind-merge"

interface LineBreakProps {
  className?: string
}
const LineBreak: FC<LineBreakProps> = ({ className }) => {
  return (
    <hr className={twJoin(
      'my-2 w-full absolute left-0 border-t-1',
      'dark:border-border-darkGray',
      className
    )} />
  )
}

export default LineBreak
