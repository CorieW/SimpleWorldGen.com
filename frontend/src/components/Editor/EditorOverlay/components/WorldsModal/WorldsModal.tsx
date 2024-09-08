import { forwardRef, useImperativeHandle, useState, useEffect } from 'react'
import './WorldsModal.scss'
import useStore from '../../../../../ts/appStore'
import WorldCard from './WorldCard/WorldCard'
import Input from '../../../../Basic/Input/Input'

const WorldsModal = forwardRef((_, ref) => {
  const { openModal } = useStore()

  const [worlds, setWorlds] = useState<any[]>([
    {
      id: 1,
      title: 'World 1',
      img: 'https://via.placeholder.com/150',
      posterDisplayName: 'John Doe',
      posterUsername: 'john_doe',
      posterProfileImg: 'https://via.placeholder.com/150',
    },
    {
      id: 2,
      title: 'World 2',
      img: 'https://via.placeholder.com/150',
      posterDisplayName: 'John Doe',
      posterUsername: 'john_doe',
      posterProfileImg: 'https://via.placeholder.com/150',
    },
    {
      id: 3,
      title: 'World 3',
      img: 'https://via.placeholder.com/150',
      posterDisplayName: 'John Doe',
      posterUsername: 'john_doe',
      posterProfileImg: 'https://via.placeholder.com/150',
    },
    {
      id: 4,
      title: 'World 4',
      img: 'https://via.placeholder.com/150',
      posterDisplayName: 'John Doe',
      posterUsername: 'john_doe',
      posterProfileImg: 'https://via.placeholder.com/150',
    },
    {
      id: 5,
      title: 'World 5',
      img: 'https://via.placeholder.com/150',
      posterDisplayName: 'John Doe',
      posterUsername: 'john_doe',
      posterProfileImg: 'https://via.placeholder.com/150',
    },
    {
      id: 1,
      title: 'World 1',
      img: 'https://via.placeholder.com/150',
      posterDisplayName: 'John Doe',
      posterUsername: 'john_doe',
      posterProfileImg: 'https://via.placeholder.com/150',
    },
    {
      id: 2,
      title: 'World 2',
      img: 'https://via.placeholder.com/150',
      posterDisplayName: 'John Doe',
      posterUsername: 'john_doe',
      posterProfileImg: 'https://via.placeholder.com/150',
    },
    {
      id: 3,
      title: 'World 3',
      img: 'https://via.placeholder.com/150',
      posterDisplayName: 'John Doe',
      posterUsername: 'john_doe',
      posterProfileImg: 'https://via.placeholder.com/150',
    },
    {
      id: 4,
      title: 'World 4',
      img: 'https://via.placeholder.com/150',
      posterDisplayName: 'John Doe',
      posterUsername: 'john_doe',
      posterProfileImg: 'https://via.placeholder.com/150',
    },
    {
      id: 5,
      title: 'World 5',
      img: 'https://via.placeholder.com/150',
      posterDisplayName: 'John Doe',
      posterUsername: 'john_doe',
      posterProfileImg: 'https://via.placeholder.com/150',
    },
    {
      id: 5,
      title: 'World 5',
      img: 'https://via.placeholder.com/150',
      posterDisplayName: 'John Doe',
      posterUsername: 'john_doe',
      posterProfileImg: 'https://via.placeholder.com/150',
    },
  ])
  const [search, setSearch] = useState<string>('')
  const [sort, setSort] = useState<string>('')

  useImperativeHandle(ref, () => ({
    openModal(): void {
      openModal({
        contentJSX: contentJSX,
        width: 'xl',
        height: 'xl',
        useExactHeight: true,
      })
    },
  }));

  useEffect(() => {
    // Fetch worlds from the server
  }, [])

  useEffect(() => {
    // When scrolling to the bottom of the list, fetch more worlds
  }, [worlds])

  useEffect(() => {
    // When the search input changes, search for worlds
  }, [])

  useEffect(() => {
    // When the sort input changes, retrieve sorted worlds
  }, [])

  const contentJSX = (
    <div id='worlds-modal-content-container'>
      <h2>Worlds</h2>
      <div className='search-container'>
        <Input
          label=''
          type='text'
          placeholder='Search worlds...'
          id='worlds-search'
          onChange={(value: string) => setSearch(value)}
          value={search}
        />
        <Input
          type='select'
          label=''
          options={[
            { value: '', label: 'Sort by', isDisabled: true },
            { value: 'recent', label: 'Most Recent' },
            { value: 'newest', label: 'Newest' },
            { value: 'oldest', label: 'Oldest' },
          ]}
          id='worlds-sort'
          onChange={(value: string) => setSort(value)}
          value={sort}
        />
      </div>
      <ul>
        { worlds.length === 0 && <p className='no-listings'>{`There's nothing to explore ☹️`}</p> }
        {worlds.map((world, index) => (
          <li key={index}>
            <WorldCard
              id={world.id}
              title={world.title}
              img={world.img}
              posterDisplayName={world.posterDisplayName}
              posterUsername={world.posterUsername}
              posterProfileImg={world.posterProfileImg}
              bookmarked={false}
            />
          </li>
        ))}
      </ul>
    </div>
  );

  return <></>
})

export default WorldsModal;