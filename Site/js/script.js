document.addEventListener('DOMContentLoaded', function() {
    // ----- МОБИЛЬНОЕ МЕНЮ -----
    const toggleBtn = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (toggleBtn) {
        toggleBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // ----- ПЛЕЙЛИСТ (если находимся на странице с плейлистом) -----
    const trackListContainer = document.getElementById('track-list');
    if (trackListContainer) {
        initPlaylist();
    }

    function initPlaylist() {
        // Данные треков (учебные)
        const tracks = [
            { id: 1, title: 'Dragonborn', game: 'The Elder Scrolls V: Skyrim', file: 'audio/skyrim-dragonborn.mp3' },
            { id: 2, title: 'One-Winged Angel', game: 'Final Fantasy VII', file: 'audio/ff7-one-winged-angel.mp3' },
            { id: 3, title: 'Still Alive', game: 'Portal', file: 'audio/portal-still-alive.mp3' },
            { id: 4, title: 'Gerudo Valley', game: 'The Legend of Zelda: Ocarina of Time', file: 'audio/zelda-gerudo.mp3' },
            { id: 5, title: 'Main Theme', game: 'The Witcher 3: Wild Hunt', file: 'audio/witcher3-main.mp3' },
            { id: 6, title: 'Ground Theme', game: 'Super Mario Bros.', file: 'audio/mario_ground_theme.mp3' },
            { id: 7, title: 'Disturbed - Decadence', game: 'Need For Speed: Most Wanted 2005', file: 'audio/nfsmw_decadence.flac' },
            { id: 8, title: 'Guns N Roses - Paradise City', game: 'Burnout Paradise 2008', file: 'audio/paradise_city.flac' },
            { id: 9, title: 'Unshaken', game: 'Red Dead Redemption 2', file: 'audio/unshaken.mp3' },
            { id: 10, title: 'Techno Syndrome', game: 'Mortal Kombat 1993', file: 'audio/techno_syndrome.mp3'}
        ];

        const audio = document.getElementById('audio-player');
        const nowPlaying = document.getElementById('current-track-label');
        const clearFavBtn = document.getElementById('clear-favorites');

        let favorites = JSON.parse(localStorage.getItem('vgmFavorites')) || [];

        function renderTracks() {
            trackListContainer.innerHTML = '';
            tracks.forEach((track, index) => {
                const isFav = favorites.includes(track.id);
                const trackEl = document.createElement('div');
                trackEl.className = 'track-item';
                trackEl.innerHTML = `
                    <div class="track-info" data-id="${track.id}">
                        <span class="track-number">${index + 1}</span>
                        <div class="track-details">
                            <span class="track-title">${track.title}</span>
                            <span class="track-game">${track.game}</span>
                        </div>
                    </div>
                    <div class="track-actions">
                        <button class="play-btn" data-id="${track.id}">▶ Играть</button>
                        <button class="fav-btn ${isFav ? 'active' : ''}" data-id="${track.id}">
                            ${isFav ? '★' : '☆'}
                        </button>
                    </div>
                `;
                trackListContainer.appendChild(trackEl);
            });
        }

        function playTrack(id) {
            const track = tracks.find(t => t.id === id);
            if (!track) return;
            audio.src = track.file;
            audio.play().catch(e => console.log('Автовоспроизведение заблокировано'));
            nowPlaying.textContent = `Сейчас играет: ${track.title} — ${track.game}`;
        }

        function toggleFavorite(id) {
            const index = favorites.indexOf(id);
            if (index === -1) {
                favorites.push(id);
            } else {
                favorites.splice(index, 1);
            }
            localStorage.setItem('vgmFavorites', JSON.stringify(favorites));
            renderTracks();
        }

        function clearFavorites() {
            favorites = [];
            localStorage.removeItem('vgmFavorites');
            renderTracks();
        }

        // Делегирование событий
        trackListContainer.addEventListener('click', function(e) {
            const playBtn = e.target.closest('.play-btn');
            if (playBtn) {
                playTrack(Number(playBtn.dataset.id));
                return;
            }

            const favBtn = e.target.closest('.fav-btn');
            if (favBtn) {
                toggleFavorite(Number(favBtn.dataset.id));
                return;
            }

            const trackInfo = e.target.closest('.track-info');
            if (trackInfo) {
                playTrack(Number(trackInfo.dataset.id));
            }
        });

        if (clearFavBtn) {
            clearFavBtn.addEventListener('click', clearFavorites);
        }

        audio.addEventListener('ended', () => {
            nowPlaying.textContent = 'Выберите трек';
        });

        renderTracks();
    }
});
