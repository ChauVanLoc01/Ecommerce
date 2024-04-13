/* eslint-disable react/prop-types */
import * as React from 'react'

import * as ProgressPrimitive from '@radix-ui/react-progress'

import { cn } from 'src/utils/utils.ts'

const Progress = React.forwardRef<
    React.ElementRef<typeof ProgressPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
    <ProgressPrimitive.Root
        ref={ref}
        className={cn(
            'relative h-3 w-full overflow-hidden rounded-full bg-gradient-to-tr from-[#8A2387]/30 via-[#E94057]/30 to-[#F27121]/30'
        )}
        {...props}
    >
        <ProgressPrimitive.Indicator
            className={cn(
                'h-3 w-full flex-1 bg-gray-900 transition-all bg-gradient-to-tr from-[#8A2387] via-[#E94057] to-[#F27121]',
                className
            )}
            style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
        />
    </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
