import React from 'react'
import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  onClick?: () => void
  href?: string
  className?: string
  leftIcon?: LucideIcon
  rightIcon?: LucideIcon
  disabled?: boolean
  animate?: boolean
  animationType?: 'pulse' | 'bounce' | 'scale'
}

const sizeClasses = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base sm:text-lg',
  lg: 'px-8 py-4 text-lg sm:text-xl',
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  href,
  className = '',
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  disabled = false,
  animate = true,
  animationType = 'scale',
  ...props
}) => {
  const baseClasses = `btn btn-${variant} ${sizeClasses[size]} ${className}`

  const animationProps = animate
    ? {
        whileHover: { scale: animationType === 'scale' ? 1.05 : 1 },
        whileTap: { scale: 0.95 },
        animate:
          animationType === 'pulse'
            ? { scale: [1, 1.05, 1] }
            : animationType === 'bounce'
              ? { y: [0, -2, 0] }
              : undefined,
        transition:
          animationType === 'pulse'
            ? { repeat: Infinity, duration: 2 }
            : animationType === 'bounce'
              ? { repeat: Infinity, duration: 1 }
              : { duration: 0.2 },
      }
    : {}

  const content = (
    <>
      {LeftIcon && <LeftIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />}
      {children}
      {RightIcon && <RightIcon className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />}
    </>
  )

  if (href) {
    return (
      <motion.a href={href} className={baseClasses} {...animationProps} {...props}>
        {content}
      </motion.a>
    )
  }

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      {...animationProps}
      {...props}
    >
      {content}
    </motion.button>
  )
}

export default Button
