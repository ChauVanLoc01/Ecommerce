import classNames from 'classnames'
import { forwardRef, InputHTMLAttributes } from 'react'
import { FieldError, type UseFormTrigger } from 'react-hook-form/dist/types'
import { ProductSearch } from 'src/constants/KeySearch'
import { PriceFormSchemaType, PriceFormUnionSchemaType } from 'src/utils/rules'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  className?: string
  err: FieldError | undefined
  trigger: UseFormTrigger<PriceFormSchemaType>
  triggerName: PriceFormUnionSchemaType
}

const InputNumber = forwardRef<HTMLInputElement, Props>(
  (
    {
      className = 'p-3 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm',
      onChange,
      err,
      trigger,
      triggerName,
      placeholder,
      value,
      ...rest
    },
    ref
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target
      if (
        (/^[0-9]+$/.test(value.replaceAll(',', '').replaceAll('.', '')) ||
          value === '') &&
        onChange
      ) {
        onChange(e)
        trigger()
      }
    }
    return (
      <>
        <input
          className={classNames(
            `${className} ${err ? 'border-[1px] border-red' : ''}`
          )}
          onChange={handleChange}
          value={value}
          {...rest}
          ref={ref}
          placeholder={placeholder}
        />
      </>
    )
  }
)

export default InputNumber
