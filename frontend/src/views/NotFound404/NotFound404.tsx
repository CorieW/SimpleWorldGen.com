import React from 'react'

type Props = {}

export default function NotFound404({}: Props) {
  return (
    <div>
        <h1>You've found yourself in the void!</h1>
        <p>There's nothing here</p>
        <p>¯\_(ツ)_/¯</p>
        <ul>
            <li><a href='/'>Time to go back home</a></li>
        </ul>
    </div>
  )
}