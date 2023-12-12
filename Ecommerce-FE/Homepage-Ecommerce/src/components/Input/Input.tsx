import { UseFormRegister, RegisterOptions } from 'react-hook-form'
import { LoginSchemaType, RegisterSchemaType } from 'src/utils/rules'

type InputProps = {
  type: React.HTMLInputTypeAttribute
  className: string
  placeHolder?: string
  register: UseFormRegister<any>
  name: keyof RegisterSchemaType
  rule?: RegisterOptions
  errorMessage?: string
  autoComplete?: string
}

function Input({ type, className, placeHolder, register, name, rule, errorMessage, autoComplete }: InputProps) {
  return (
    <div className={className}>
      <input
        type={type}
        className='w-full rounded-sm border border-gray-300 p-3 outline-none focus:border-gray-500 focus:shadow-sm'
        placeholder={placeHolder}
        {...register(name, rule)}
        autoComplete={autoComplete}
      />
      <div className='text-red-600 mt-1 min-h-[1.25rem] text-sm text-red'>{errorMessage}</div>
    </div>
  )
}

export default Input
