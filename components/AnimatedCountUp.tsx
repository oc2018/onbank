"use client"

import React from 'react'
import CountUp from 'react-countup'

const AnimatedCountUp = ({ amount }: {amount: number }) => {
  return (
    <div>
        <CountUp 
            decimals={2}
            decimal='.' 
            prefix='KSH' 
            end={amount} 
        />
    </div>
  )
}

export default AnimatedCountUp