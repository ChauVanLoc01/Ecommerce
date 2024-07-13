import { TrashIcon } from '@radix-ui/react-icons'
import { AlertDialog, Button, Checkbox, Flex, IconButton, Text, Tooltip } from '@radix-ui/themes'
import { motion } from 'framer-motion'
import { debounce } from 'lodash'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import InputNumber from 'src/components/InputNumber'
import Countdown from 'src/pages/ProductList/FlashSale/Countdown'
import { ProductContextExtends } from 'src/types/context.type'
import { convertCurrentcy, removeSpecialCharacter } from 'src/utils/utils.ts'

type ProductInCartType = {
    product: ProductContextExtends
    handleChecked: (productId: string, checked: boolean) => () => void
    handleChangeQuantity: (productId: string, buy: number) => void
    handleDelete: (productId: string) => () => void
}

const ProductIncart = ({ product, handleChecked, handleChangeQuantity, handleDelete }: ProductInCartType) => {
    const [quantity, setQuantity] = useState<number>(product.buy)

    useEffect(() => {
        let changeQuantityDebounce = debounce(() => handleChangeQuantity(product.productId, quantity), 2000)
        changeQuantityDebounce()

        return () => {
            changeQuantityDebounce.cancel()
        }
    }, [quantity])

    return (
        <motion.div
            data-exist={product.isExist}
            className='data-[exist=false]:bg-gray-100 px-24 pt-24 [&:last-child]:pb-24 space-x-5 flex items-center max-h-[130px]'
        >
            <Checkbox
                checked={product.checked}
                onCheckedChange={handleChecked(product.productId, !product.checked)}
                id={product.productId}
                disabled={!product.isExist}
            />
            <Link
                to={`/${removeSpecialCharacter(product.name)}-0-${product.productId}`}
                className='max-w-16 max-h-16 w-16 h-16 border border-border/30 flex-shrink-0 rounded-12 overflow-hidden'
            >
                <img src={product?.image} alt='cart-item' className='object-cover w-16 h-16' />
            </Link>
            <div className='flex-grow flex flex-col'>
                {product?.sale && (
                    <Flex className='space-x-3 pr-24'>
                        <h3 className='font-semibold font-mono text-xl bg-gradient-to-tr to-[#fcb045] via-[#fd1d1d] from-[#833ab4] bg-clip-text text-transparent'>
                            Sản phẩm giảm giá
                        </h3>
                        <div className='scale-90 flex justify-center items-center'>
                            <Countdown />
                        </div>
                    </Flex>
                )}
                <Link
                    to={`/${removeSpecialCharacter(product.name)}-0-${product.productId}`}
                    className='font-semibold line-clamp-2'
                >
                    <Text>{product?.name}</Text>
                </Link>
            </div>
            <div className='flex items-center space-x-4'>
                {product?.sale ? (
                    <h3 className='font-semibold font-mono bg-gradient-to-tr to-[#fcb045] via-[#fd1d1d] from-[#833ab4] bg-clip-text text-transparent'>
                        {convertCurrentcy(product.priceAfter)}
                    </h3>
                ) : (
                    <h3 className='font-semibold'>{convertCurrentcy(product.priceAfter)}</h3>
                )}
                <InputNumber
                    quantity={product?.sale ? product?.sale.quantity - product.sale.bought : quantity}
                    setQuantity={setQuantity}
                    currentQuantity={
                        product?.sale
                            ? Math.min(product.sale.quantity - product.sale.bought, product.currentQuantity)
                            : product.currentQuantity || 0
                    }
                />
                <AlertDialog.Root>
                    <AlertDialog.Trigger>
                        <IconButton color='red'>
                            <Tooltip content='Xóa'>
                                <TrashIcon />
                            </Tooltip>
                        </IconButton>
                    </AlertDialog.Trigger>
                    <AlertDialog.Content maxWidth='450px' className='!rounded-8'>
                        <AlertDialog.Title>Xác nhận xóa sản phẩm</AlertDialog.Title>
                        <AlertDialog.Description size='2'>
                            Bạn có chắc rằng muốn xóa sản phẩm ra khỏi giỏ hàng?
                        </AlertDialog.Description>
                        <Flex justify={'end'} gapX={'3'} className='mt-5'>
                            <AlertDialog.Cancel>
                                <Button variant='outline' color='red'>
                                    Hủy
                                </Button>
                            </AlertDialog.Cancel>
                            <AlertDialog.Action>
                                <Button onClick={handleDelete(product.productId)}>Xác nhận</Button>
                            </AlertDialog.Action>
                        </Flex>
                    </AlertDialog.Content>
                </AlertDialog.Root>
            </div>
        </motion.div>
    )
}

export default ProductIncart
