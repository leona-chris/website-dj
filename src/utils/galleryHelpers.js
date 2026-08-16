export const photos = [
    '/img/leona_chris_1.webp',
    '/img/leona_chris_2.webp',
    '/img/leona_chris_3.webp',
    '/img/leona_chris_4.webp'
];

export const videos = [
    '/vid/leona_chris_1.mp4',
    '/vid/leona_chris_2.mp4',
    '/vid/leona_chris_3.mp4',
    '/vid/leona_chris_4.mp4',
    '/vid/leona_chris_5.mp4',
    '/vid/leona_chris_6.mp4'
];

// Wiederverwendbare Swipe-Logik für Touchscreens in Modals
export function enableSwipe(modalId, nextFn, prevFn) {
    const modalBox = document.querySelector(`#${modalId} .modal-box`);
    if (!modalBox) return;

    let startX = 0;
    modalBox.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    }, { passive: true });

    modalBox.addEventListener('touchend', (e) => {
        const diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextFn();
            } else {
                prevFn();
            }
        }
    }, { passive: true });
}