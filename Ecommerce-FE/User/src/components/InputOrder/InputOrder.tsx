import classNames from 'classnames'
import React, { InputHTMLAttributes } from 'react'
import { UseFormRegister } from 'react-hook-form'
import { StringSchema } from 'yup'
import { AssertsShape } from 'yup/lib/object'
import { AnyObject } from 'yup/lib/types'

type InputOrderType = {
  setCount: React.Dispatch<React.SetStateAction<number>>
  count: number
  amount: number
  ReduceClassName?: string
  InscreaseClassName?: string
  InputClassName?: string
  IconClassName?: string
  rootClassName?: string
}

const InputOrder = ({
  InputClassName,
  InscreaseClassName,
  ReduceClassName,
  IconClassName,
  rootClassName,
  setCount,
  count,
  amount
}: InputOrderType) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    if (/^\d+$/.test(value) && Number(value) > 0 && Number(value) <= amount) {
      setCount(Number(value.trim()))
    }
  }
  const handleAmount =
    (syntax: 'add' | 'substract') =>
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      if (syntax === 'add' && count < amount) {
        setCount((pre) => pre + 1)
      } else if (syntax === 'substract' && count > 1) {
        setCount((pre) => pre - 1)
      }
    }
  return (
    <div className={`grid grid-cols-5 ${rootClassName}`}>
      <button
        onClick={handleAmount('substract')}
        className={`col-start-1 rounded-sm border-[1px] border-gray-300 hover:bg-gray-100 xl:p-2 ${ReduceClassName} ${classNames(
          {
            'cursor-not-allowed': count === 1
          }
        )}`}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className={`mx-auto xl:h-4 xl:w-4 ${IconClassName}`}
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 12h-15' />
        </svg>
      </button>
      <input
        className={`col-span-3 col-start-2 border-y-[1px] border-gray-300 text-center outline-none ${InputClassName}`}
        type='text'
        onChange={handleChange}
        value={count}
      />
      <button
        onClick={handleAmount('add')}
        className={`col-start-5 rounded-sm border-[1px] border-gray-300 hover:bg-gray-100 xl:p-2 ${InscreaseClassName}`}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className={`mx-auto xl:h-4 xl:w-4 ${IconClassName}`}
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M12 4.5v15m7.5-7.5h-15'
          />
        </svg>
      </button>
    </div>
  )
}

export default InputOrder
