import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import { Check } from 'lucide-react'
import * as React from 'react'

import { cn } from 'src/utils/utils.ts'

const RadioGroup = React.forwardRef<
    React.ElementRef<typeof RadioGroupPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
    return <RadioGroupPrimitive.Root className={cn('grid gap-2', className)} {...props} ref={ref} />
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

const RadioGroupItem = React.forwardRef<
    React.ElementRef<typeof RadioGroupPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
    return (
        <RadioGroupPrimitive.Item
            ref={ref}
            className={cn(
                'aspect-square size-3.5 rounded-6 border border-border/30 text-blue-500 ring-offset-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 overflow-hidden',
                className
            )}
            {...props}
        >
            <RadioGroupPrimitive.Indicator className='flex items-center justify-center bg-blue-50'>
                <Check className='size-full stroke-[4px] text-current' />
            </RadioGroupPrimitive.Indicator>
        </RadioGroupPrimitive.Item>
    )
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }
