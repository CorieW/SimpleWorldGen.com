import { useRef, useEffect } from 'react'
import './ScrollContainer.scss'

interface Props {
    mode?: 'horizontal' | 'vertical'
    children: React.ReactNode
}

export default function ScrollContainer(props: Props) {
    const { mode, children } = props

    const scrollRef = useRef<HTMLDivElement>(null)
    const scrollBarRef = useRef<HTMLButtonElement>(null)
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const contentContainerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!scrollBarRef.current || !scrollContainerRef.current || !contentContainerRef.current) return

        const scrollBar = scrollBarRef.current
        const scrollContainer = scrollContainerRef.current
        const contentContainer = contentContainerRef.current

        // Set up scroll bar initial position and width
        updateScrollBar()

        // Set up scroll bar position
        scrollBar.style.left = '0'
        scrollBar.style.top = '0'

        let isDown = false
        let startX: number
        let startY: number

        // Enable dragging of scroll bar when mouse is down on it
        function onClickDown(e: MouseEvent | TouchEvent) {
            const pageX = e instanceof MouseEvent ? e.pageX : e.touches[0].pageX
            const pageY = e instanceof MouseEvent ? e.pageY : e.touches[0].pageY

            isDown = true
            startX = pageX - scrollBar.offsetLeft
            startY = pageY - scrollBar.offsetTop
        }

        // Disable dragging of scroll bar when mouse is up anywhere on the window
        function onClickUp() {
            isDown = false
        }

        // Handle dragging of scroll bar and scrolling of content container
        function onMove(e: MouseEvent | TouchEvent) {
            if (!isDown) return
            e.preventDefault()

            if (mode === 'horizontal') {
                handleHorizontalScroll(e)
            } else {
                handleVerticalScroll(e)
            }
        }

        function handleHorizontalScroll(e: MouseEvent | TouchEvent) {
            const pageX = e instanceof MouseEvent ? e.pageX : e.touches[0].pageX

            const x = pageX - scrollContainer.offsetLeft
            const scrollBarLeft = x - startX
            const scrollBarWidth = scrollBar.offsetWidth
            const scrollContainerWidth = scrollContainer.offsetWidth
            const scrollContainerScrollWidth = contentContainer.scrollWidth

            const minScrollBarLeft = 0
            const maxScrollBarLeft = scrollContainerWidth - scrollBarWidth

            const newScrollBarLeft = Math.max(minScrollBarLeft, Math.min(maxScrollBarLeft, scrollBarLeft))
            const newScrollLeft = newScrollBarLeft / scrollContainerWidth * scrollContainerScrollWidth

            scrollBar.style.left = `${newScrollBarLeft}px`
            contentContainer.scrollLeft = newScrollLeft
        }

        function handleVerticalScroll(e: MouseEvent | TouchEvent) {
            const pageY = e instanceof MouseEvent ? e.pageY : e.touches[0].pageY

            const y = pageY - scrollContainer.offsetTop
            const scrollBarTop = y - startY
            const scrollBarHeight = scrollBar.offsetHeight
            const scrollContainerHeight = scrollContainer.offsetHeight
            const scrollContainerScrollHeight = contentContainer.scrollHeight

            const minScrollBarTop = 0
            const maxScrollBarTop = scrollContainerHeight - scrollBarHeight

            const newScrollBarTop = Math.max(minScrollBarTop, Math.min(maxScrollBarTop, scrollBarTop))
            const newScrollTop = newScrollBarTop / scrollContainerHeight * scrollContainerScrollHeight

            scrollBar.style.top = `${newScrollBarTop}px`
            contentContainer.scrollTop = newScrollTop
        }

        // Update scroll bar width and position on change of content container
        new MutationObserver(() => {
            updateScrollBar()
        }).observe(contentContainer, { attributes: true, childList: true, subtree: true })

        // Update scroll bar width and position on resize of content container
        new ResizeObserver(() => {
            updateScrollBar()
        }).observe(contentContainer)

        // Support mouse events
        scrollBar.addEventListener('mousedown', onClickDown)
        window.addEventListener('mouseup', onClickUp)
        window.addEventListener('mousemove', onMove)

        // Support phone touch events
        scrollBar.addEventListener('touchstart', onClickDown)
        window.addEventListener('touchend', onClickUp)
        window.addEventListener('touchmove', onMove)

        return () => {
            scrollBar.removeEventListener('mousedown', onClickDown)
            window.removeEventListener('mouseup', onClickUp)
            window.removeEventListener('mousemove', onMove)

            scrollBar.removeEventListener('touchstart', onClickDown)
            window.removeEventListener('touchend', onClickUp)
            window.removeEventListener('touchmove', onMove)
        }
    }, [])

    // Update scroll bar width and position on change of content
    useEffect(() => {
        updateScrollBar()
    }, [children])

    function updateScrollBar() {
        if (mode === 'horizontal') {
            handleHorizontalUpdate()
        } else {
            handleVerticalUpdate()
        }
    }

    function handleHorizontalUpdate() {
        if (!scrollRef.current || !scrollBarRef.current || !contentContainerRef.current) return

        const scroll = scrollRef.current
        const scrollBar = scrollBarRef.current
        const contentContainer = contentContainerRef.current

        const scrollContainerWidth = contentContainer.offsetWidth
        const scrollContainerScrollWidth = contentContainer.scrollWidth
        const scrollBarWidthPercentage = (scrollContainerWidth / scrollContainerScrollWidth) * 100
        scrollBar.style.width = `${scrollBarWidthPercentage}%`

        if (scrollContainerWidth === scrollContainerScrollWidth) {
            scroll.style.display = 'none'
        } else {
            scroll.style.display = 'block'
        }
    }

    function handleVerticalUpdate() {
        if (!scrollRef.current || !scrollBarRef.current || !contentContainerRef.current) return

        const scroll = scrollRef.current
        const scrollBar = scrollBarRef.current
        const contentContainer = contentContainerRef.current

        const scrollContainerHeight = contentContainer.offsetHeight
        const scrollContainerScrollHeight = contentContainer.scrollHeight
        const scrollBarHeightPercentage = (scrollContainerHeight / scrollContainerScrollHeight) * 100
        scrollBar.style.height = `${scrollBarHeightPercentage}%`

        if (scrollContainerHeight === scrollContainerScrollHeight) {
            scroll.style.display = 'none'
        } else {
            scroll.style.display = 'block'
        }
    }

    return (
        <div className={`${mode}-scroll-container`} ref={scrollContainerRef}>
            <div className='content-container' ref={contentContainerRef}>{children}</div>
            <div className={`${mode}-scroll`} ref={scrollRef}>
                <button className='scroll-bar' ref={scrollBarRef}></button>
            </div>
        </div>
    )
}
