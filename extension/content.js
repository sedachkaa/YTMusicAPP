// Функция для получения ID видео из URL
function getVideoId(url) {
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\?]+)/,
        /youtube\.com\/embed\/([^&\?]+)/,
        /youtube\.com\/v\/([^&\?]+)/
    ];
    for (let pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }
    return null;
}

// Функция для добавления кнопки
function addDownloadButton() {
    const actions = document.querySelector('#top-level-buttons-computed');
    if (!actions || actions.querySelector('.yt-music-dl-btn')) return;

    const btn = document.createElement('button');
    btn.className = 'yt-music-dl-btn yt-spec-button-shape-next yt-spec-button-shape-next--text yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m';
    btn.setAttribute('style', 'margin-left: 8px; display: inline-flex; align-items: center; gap: 4px;');
    btn.innerHTML = '⬇ Скачать музыку';

    btn.addEventListener('click', () => {
        const currentUrl = window.location.href;
        const videoId = getVideoId(currentUrl);
        if (!videoId) {
            alert('Не удалось определить ID видео');
            return;
        }
        // Формируем короткую ссылку (без параметров)
        const shortUrl = `https://youtu.be/${videoId}`;
        
        // Пытаемся отправить через локальный сервер
        fetch(`http://127.0.0.1:8765/?url=${encodeURIComponent(shortUrl)}`)
            .catch(() => {
                // Если сервер не отвечает, используем кастомный протокол
                window.location.href = `ytmusicdl://${shortUrl}`;
            });
    });

    actions.appendChild(btn);
}

// Наблюдаем за изменениями на странице (YouTube подгружает контент динамически)
const observer = new MutationObserver(addDownloadButton);
observer.observe(document.body, { childList: true, subtree: true });

// Первоначальный вызов
addDownloadButton();