import React from 'react'
import './Footer.scss'

type Props = {}

export default function Footer({}: Props) {
  return (
    <div id='footer'>
      <p>Open source project, check it out on <a href='https://github.com/CorieW/SimpleWorldGen.com' target='_blank'>GitHub</a></p>
    </div>
  )
}