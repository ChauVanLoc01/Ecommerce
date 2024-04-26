import { useEffect, useRef, useState } from 'react'
import { RiDeleteBin5Line } from 'react-icons/ri'

import { CheckedState } from '@radix-ui/react-checkbox'
import { Text } from '@radix-ui/themes'
import { motion } from 'framer-motion'
import { debounce } from 'lodash'
import { Link } from 'react-router-dom'
import Button from 'src/components/Button'
import InputNumber from 'src/components/InputNumber'
import { Checkbox } from 'src/components/Shadcn/checkbox'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from 'src/components/Shadcn/dialog'
import { ProductContext } from 'src/types/context.type'
import { convertCurrentcy, removeSpecialCharacter } from 'src/utils/utils.ts'

type CartItemProps = {
    product: ProductContext
    handleDeleteProduct: (id: string) => () => void
    handleChangeQuantity: (id: string, quantity: number) => void
    handleChecked: (id: string, checked: boolean) => void
}

const CartItem = ({ product, handleChangeQuantity, handleDeleteProduct, handleChecked }: CartItemProps) => {
    const [quantity, setQuantity] = useState<number>(product.buy)
    const [checked, setChecked] = useState<boolean>(product.checked)
    const debounceRef = useRef<any>()

    const handleCheckBox = (checked: CheckedState) => {
        setChecked(checked as boolean)
        handleChecked(product.id, checked as boolean)
    }

    useEffect(() => {
        debounceRef.current = debounce(() => {
            handleChangeQuantity(product.id, quantity)
        }, 1000)
        debounceRef.current()

        return () => {
            debounceRef.current.cancel()
        }
    }, [quantity])

    return (
        <motion.div>
            <motion.div className='flex items-center'>
                <Checkbox />
                <Text></Text>
            </motion.div>
            <motion.div className='p-24 space-x-5 flex items-center bg-[#FFFFFF] rounded-8 border border-border/30 max-h-[130px]'>
                <Checkbox checked={checked} onCheckedChange={handleCheckBox} id={product.id} />
                <Link
                    to={`/${removeSpecialCharacter(product.name)}-0-${product.id}`}
                    className='max-w-16 max-h-16 w-16 h-16 border border-border/30 flex-shrink-0 rounded-12 overflow-hidden'
                >
                    <img src={product?.image} alt='cart-item' className='object-cover w-16 h-16' />
                </Link>
                <div className='space-y-2 flex-grow '>
                    <Link
                        to={`/${removeSpecialCharacter(product.name)}-0-${product.id}`}
                        className='font-semibold line-clamp-2'
                    >
                        <Text>{product?.name}</Text>
                    </Link>
                    <h3 className='text-gray-400'>Red</h3>
                </div>
                <div className='flex items-center space-x-4'>
                    <h3 className='font-semibold'> {convertCurrentcy(product.priceAfter || 0, 0)}đ</h3>
                    <InputNumber quantity={quantity} setQuantity={setQuantity} />
                    <Dialog>
                        <DialogTrigger asChild>
                            <button className='p-12 rounded-6 hover:bg-gray-100 flex-shrink-0'>
                                <RiDeleteBin5Line className='text-red-600' />
                            </button>
                        </DialogTrigger>
                        <DialogContent className='sm:max-w-[425px]'>
                            <DialogHeader>
                                <DialogTitle>Xác nhận xóa sản phẩm</DialogTitle>
                                <DialogDescription>
                                    Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <Button text='Xác nhận' className='px-5' onClick={handleDeleteProduct(product.id)} />
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </motion.div>
        </motion.div>
    )
}

export default CartItem
