// ---------- Dynamic Typewriter Effect ----------
const roles = ["Idk what to put here :3", "Building custom stuff...", "Femboy"];
let currentRoleIdx = 0;
let currentCharIdx = 0;
let isDeleting = false;
const typingSpeed = 100;
const deletingSpeed = 50;
const pauseDelay = 2000;

function type() {
    const currentRole = roles[currentRoleIdx];
    const typingElement = document.getElementById('typing');

    if (isDeleting) {
        typingElement.textContent = currentRole.substring(0, currentCharIdx - 1);
        currentCharIdx--;
    } else {
        typingElement.textContent = currentRole.substring(0, currentCharIdx + 1);
        currentCharIdx++;
    }

    if (!isDeleting && currentCharIdx === currentRole.length) {
        isDeleting = true;
        setTimeout(type, pauseDelay);
    } else if (isDeleting && currentCharIdx === 0) {
        isDeleting = false;
        currentRoleIdx = (currentRoleIdx + 1) % roles.length;
        setTimeout(type, 500);
    } else {
        setTimeout(type, isDeleting ? deletingSpeed : typingSpeed);
    }
}

// ---------- Background music, backed by the real YouTube track ----------
// Plays "Bubblegum Bitch" by MARINA via YouTube's own embedded player
// (no audio file is downloaded or rehosted, this is YouTube's official IFrame API).
const YT_VIDEO_ID = 'VOn6i2spFIY';

let ytPlayer = null;
let ytReady = false;
let userWantsPlay = false; // true if the user has clicked play and we're waiting on the API

function loadYouTubeAPI() {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);
}

// Called automatically by the YouTube IFrame API once it has loaded
window.onYouTubeIframeAPIReady = function () {
    ytPlayer = new YT.Player('yt-player', {
        height: '1',
        width: '1',
        videoId: YT_VIDEO_ID,
        playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
            loop: 1,
            playlist: YT_VIDEO_ID // required by the API for single-video looping
        },
        events: {
            onReady: onYTReady,
            onStateChange: onYTStateChange
        }
    });
};

function onYTReady() {
    ytReady = true;
    ytPlayer.setVolume(70);
    if (userWantsPlay) {
        ytPlayer.playVideo();
    }
}

function onYTStateChange(event) {
    const playing = event.data === YT.PlayerState.PLAYING;
    setPlayingUI(playing);
}

function setPlayingUI(playing) {
    const playBtn = document.getElementById('play-btn');
    const iconPlay = document.getElementById('icon-play');
    const iconPause = document.getElementById('icon-pause');
    const player = document.getElementById('audio-player');

    playBtn.setAttribute('aria-pressed', String(playing));
    playBtn.setAttribute('aria-label', playing ? 'Musik pausieren' : 'Musik abspielen');
    iconPlay.hidden = playing;
    iconPause.hidden = !playing;
    player.classList.toggle('is-playing', playing);
}

document.addEventListener('DOMContentLoaded', () => {
    type();
    loadYouTubeAPI();

    const playBtn = document.getElementById('play-btn');

    playBtn.addEventListener('click', () => {
        if (!ytReady) {
            // API/player still loading: remember the intent, onYTReady() will start it
            userWantsPlay = true;
            setPlayingUI(true); // optimistic UI, corrects itself via onStateChange
            return;
        }

        const state = ytPlayer.getPlayerState();
        if (state === YT.PlayerState.PLAYING) {
            ytPlayer.pauseVideo();
        } else {
            ytPlayer.playVideo();
        }
    });
});
