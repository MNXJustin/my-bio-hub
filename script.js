const typingConfig = {
    roles: ["Idk what to put here :3", "Building custom stuff..."],
    typingSpeed: 100,
    deletingSpeed: 50,
    pauseDelay: 2000,
    nextRoleDelay: 500
};

function startTypingEffect() {
    const typingElement = document.getElementById('typing');
    if (!typingElement) return;

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function tick() {
        const currentRole = typingConfig.roles[roleIndex];
        charIndex += isDeleting ? -1 : 1;
        typingElement.textContent = currentRole.substring(0, charIndex);

        let delay = isDeleting ? typingConfig.deletingSpeed : typingConfig.typingSpeed;

        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            delay = typingConfig.pauseDelay;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % typingConfig.roles.length;
            delay = typingConfig.nextRoleDelay;
        }

        setTimeout(tick, delay);
    }

    tick();
}

const trackVideoId = 'VOn6i2spFIY';
let ytPlayer = null;
let soundUnlocked = false;

function updatePlayerUI(isAudible) {
    const playBtn = document.getElementById('play-btn');
    const playerUI = document.getElementById('audio-player');
    if (!playBtn || !playerUI) return;
    playBtn.setAttribute('aria-pressed', String(isAudible));
    playBtn.setAttribute('aria-label', isAudible ? 'Musik pausieren' : 'Musik abspielen');
    playerUI.classList.toggle('is-playing', isAudible);
}

window.onYouTubeIframeAPIReady = function () {
    ytPlayer = new YT.Player('yt-player', {
        videoId: trackVideoId,
        playerVars: {
            autoplay: 1,
            mute: 1,
            controls: 0,
            loop: 1,
            playlist: trackVideoId
        },
        events: {
            onReady: event => event.target.playVideo(),
            onStateChange: event => {
                const audible = soundUnlocked && event.data === YT.PlayerState.PLAYING;
                updatePlayerUI(audible);
            }
        }
    });
};

function setupAudioControls() {
    const playBtn = document.getElementById('play-btn');
    if (!playBtn) return;

    playBtn.addEventListener('click', () => {
        if (!ytPlayer) return;

        if (!soundUnlocked) {
            soundUnlocked = true;
            ytPlayer.unMute();
            ytPlayer.playVideo();
            updatePlayerUI(true);
            return;
        }

        if (ytPlayer.getPlayerState() === YT.PlayerState.PLAYING) {
            ytPlayer.pauseVideo();
        } else {
            ytPlayer.playVideo();
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    startTypingEffect();
    setupAudioControls();
});
