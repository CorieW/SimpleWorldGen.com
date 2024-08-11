import React from 'react'
import './Home.scss'
import WorldCard from './WorldCard/WorldCard'

type Props = {}

export default function Home({}: Props) {
    return (
        <div id='home'>
            <div className='header'>
                <h2>Worlds</h2>
            </div>
            <div className='worlds-container'>
                <WorldCard worldInfo={{ id: 1, name: 'World 1', imgUri: 'https://via.placeholder.com/150' }} />
                <WorldCard worldInfo={{ id: 2, name: 'World 2', imgUri: 'https://via.placeholder.com/150' }} />
                <WorldCard worldInfo={{ id: 3, name: 'World 3', imgUri: 'https://via.placeholder.com/150' }} />
                <WorldCard worldInfo={{ id: 4, name: 'World 4', imgUri: 'https://via.placeholder.com/150' }} />
                <WorldCard worldInfo={{ id: 5, name: 'World 5', imgUri: 'https://via.placeholder.com/150' }} />
                <WorldCard worldInfo={{ id: 6, name: 'World 6', imgUri: 'https://via.placeholder.com/150' }} />
                <WorldCard worldInfo={{ id: 7, name: 'World 7', imgUri: 'https://via.placeholder.com/150' }} />
                <WorldCard worldInfo={{ id: 8, name: 'World 8', imgUri: 'https://via.placeholder.com/150' }} />
                <WorldCard worldInfo={{ id: 9, name: 'World 9', imgUri: 'https://via.placeholder.com/150' }} />
                <WorldCard worldInfo={{ id: 10, name: 'World 10', imgUri: 'https://via.placeholder.com/150' }} />
            </div>
        </div>
    )
}