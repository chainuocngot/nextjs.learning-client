"use client"
import React, { useState } from "react"
import "./style.scss"
import clsx from "clsx"

const Card = () => {
  const [expanding, setExpanding] = useState(false)
  return (
    <div
      className={clsx("card", {
        "text-mini": expanding,
      })}
      onClick={() => setExpanding((prev) => !prev)}
    >
      Card
    </div>
  )
}

export default Card
