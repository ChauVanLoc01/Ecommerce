import { AlertDialog, Button, Flex, Spinner } from "@radix-ui/themes"
import { useState } from "react"
import { OrderDetailResponse, ProductOrderWithProduct } from "src/types/order.type"


type OrderRatingProps = {
    isOpen: boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    productData: ProductOrderWithProduct[]
    orderData?: OrderDetailResponse
}

type RatingData = {
    productId: string
    storeId: string
    orderId: string
    ratingValue: number
    title: string
    detail: string
    userId: string
}


function OrderRating({isOpen, setIsOpen, productData}: OrderRatingProps) {

    const [ratingValue, setRatingValue] = useState(0)

    const handleRating = (rateNum: number) => {
        setRatingValue(rateNum)
        console.log(rateNum);
        
    }    

    if(!productData) {
        return (
            <AlertDialog.Root>
                <AlertDialog.Content>
                    <AlertDialog.Title>Đánh giá đơn hàng</AlertDialog.Title>
                    <Spinner />
                </AlertDialog.Content>
            </AlertDialog.Root>
        )
    }

  return (
    <AlertDialog.Root open={isOpen} onOpenChange={setIsOpen}>
    <AlertDialog.Content maxWidth='900px' className='!rounded-8'>
        <div className='space-y-5'>
            <AlertDialog.Title>Đánh giá đơn hàng</AlertDialog.Title>
            <Flex justify='center' direction="row">
                {/* set initial value */}
                {/* <StarRating /> */}
            </Flex>
            
            <Flex gap='3' mt='4' justify='end'>
                <AlertDialog.Cancel>
                    <Button>Trở về</Button>
                </AlertDialog.Cancel>
            </Flex>
        </div>
    </AlertDialog.Content>
</AlertDialog.Root>
  )
}

export default OrderRating