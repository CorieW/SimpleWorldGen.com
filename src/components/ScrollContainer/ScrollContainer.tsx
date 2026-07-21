import { useCallback, useEffect, useRef, type ReactNode } from 'react';
import './ScrollContainer.scss';

type ScrollMode = 'horizontal' | 'vertical';

type Props = {
    mode?: ScrollMode;
    children: ReactNode;
};

export default function ScrollContainer({ mode = 'vertical', children }: Props) {
    const trackRef = useRef<HTMLDivElement>(null);
    const thumbRef = useRef<HTMLButtonElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const updateScrollBar = useCallback(() => {
        const track = trackRef.current;
        const thumb = thumbRef.current;
        const content = contentRef.current;
        if (!track || !thumb || !content) return;

        const visibleSize = mode === 'horizontal' ? content.clientWidth : content.clientHeight;
        const scrollSize = mode === 'horizontal' ? content.scrollWidth : content.scrollHeight;
        const thumbPercentage = scrollSize === 0 ? 100 : Math.min((visibleSize / scrollSize) * 100, 100);

        track.style.display = visibleSize >= scrollSize ? 'none' : 'block';
        if (mode === 'horizontal') {
            thumb.style.width = `${thumbPercentage}%`;
        } else {
            thumb.style.height = `${thumbPercentage}%`;
        }
    }, [mode]);

    useEffect(() => {
        const track = trackRef.current;
        const thumb = thumbRef.current;
        const content = contentRef.current;
        if (!track || !thumb || !content) return;

        let dragging = false;
        let grabOffset = 0;

        function startDragging(event: PointerEvent) {
            dragging = true;
            grabOffset = mode === 'horizontal'
                ? event.clientX - thumb!.getBoundingClientRect().left
                : event.clientY - thumb!.getBoundingClientRect().top;
            thumb!.setPointerCapture(event.pointerId);
        }

        function stopDragging(event: PointerEvent) {
            dragging = false;
            if (thumb!.hasPointerCapture(event.pointerId)) thumb!.releasePointerCapture(event.pointerId);
        }

        function drag(event: PointerEvent) {
            if (!dragging) return;
            event.preventDefault();

            const trackBounds = track!.getBoundingClientRect();
            const pointerPosition = mode === 'horizontal'
                ? event.clientX - trackBounds.left
                : event.clientY - trackBounds.top;
            const trackSize = mode === 'horizontal' ? track!.clientWidth : track!.clientHeight;
            const thumbSize = mode === 'horizontal' ? thumb!.offsetWidth : thumb!.offsetHeight;
            const maxThumbPosition = Math.max(trackSize - thumbSize, 0);
            const thumbPosition = Math.max(0, Math.min(pointerPosition - grabOffset, maxThumbPosition));
            const scrollRatio = maxThumbPosition === 0 ? 0 : thumbPosition / maxThumbPosition;

            if (mode === 'horizontal') {
                thumb!.style.left = `${thumbPosition}px`;
                content!.scrollLeft = scrollRatio * (content!.scrollWidth - content!.clientWidth);
            } else {
                thumb!.style.top = `${thumbPosition}px`;
                content!.scrollTop = scrollRatio * (content!.scrollHeight - content!.clientHeight);
            }
        }

        thumb.style.left = '0';
        thumb.style.top = '0';
        updateScrollBar();

        const mutationObserver = new MutationObserver(updateScrollBar);
        const resizeObserver = new ResizeObserver(updateScrollBar);
        mutationObserver.observe(content, { attributes: true, childList: true, subtree: true });
        resizeObserver.observe(content);

        thumb.addEventListener('pointerdown', startDragging);
        thumb.addEventListener('pointermove', drag);
        thumb.addEventListener('pointerup', stopDragging);
        thumb.addEventListener('pointercancel', stopDragging);

        return () => {
            mutationObserver.disconnect();
            resizeObserver.disconnect();
            thumb.removeEventListener('pointerdown', startDragging);
            thumb.removeEventListener('pointermove', drag);
            thumb.removeEventListener('pointerup', stopDragging);
            thumb.removeEventListener('pointercancel', stopDragging);
        };
    }, [mode, updateScrollBar]);

    useEffect(() => {
        updateScrollBar();
    }, [children, updateScrollBar]);

    return (
        <div className={`${mode}-scroll-container`}>
            <div className='content-container' ref={contentRef}>{children}</div>
            <div className={`${mode}-scroll`} ref={trackRef}>
                <button
                    type='button'
                    className='scroll-bar'
                    ref={thumbRef}
                    aria-label={`Scroll ${mode} content`}
                />
            </div>
        </div>
    );
}
