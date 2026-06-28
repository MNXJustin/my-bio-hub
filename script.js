const typingConfig = {
    roles: [
        "Full-stack developer",
        "Building random stuff",
        "Learning web dev one project at a time",
        "Femboy BTW ✨"
    ],
    typingSpeed: 80,
    deletingSpeed: 40,
    pauseDelay: 2500,
    nextRoleDelay: 400
};

let typingTimeout = null;

function startTypingEffect() {
    const typingElement = document.getElementById('typing');
    const cursorElement = document.getElementById('cursor');
    if (!typingElement) return;

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function tick() {
        const currentRole = typingConfig.roles[roleIndex];
        
        if (!isDeleting) {
            charIndex++;
            typingElement.textContent = currentRole.substring(0, charIndex);
        } else {
            charIndex--;
            typingElement.textContent = currentRole.substring(0, charIndex);
        }

        // Show cursor during typing/deleting, hide during pauses
        if (cursorElement) {
            cursorElement.classList.remove('hidden');
        }

        let delay = isDeleting ? typingConfig.deletingSpeed : typingConfig.typingSpeed;

        if (!isDeleting && charIndex === currentRole.length) {
            // Finished typing - hide cursor during pause
            if (cursorElement) {
                cursorElement.classList.add('hidden');
            }
            isDeleting = true;
            delay = typingConfig.pauseDelay;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % typingConfig.roles.length;
            delay = typingConfig.nextRoleDelay;
        }

        typingTimeout = setTimeout(tick, delay);
    }

    tick();
}

const trackVideoId = 'VOn6i2spFIY';
let ytPlayer = null;
let soundUnlocked = false;

function announceToScreenReader(message) {
    const announcer = document.getElementById('announcer');
    if (announcer) {
        announcer.textContent = message;
    }
}

function updatePlayerUI(isAudible) {
    const playBtn = document.getElementById('play-btn');
    const playerUI = document.getElementById('audio-player');
    if (!playBtn || !playerUI) return;
    
    playBtn.setAttribute('aria-pressed', String(isAudible));
    playBtn.setAttribute('aria-label', isAudible ? 'Musik pausieren' : 'Musik abspielen');
    playerUI.classList.toggle('is-playing', isAudible);
    
    announceToScreenReader(isAudible ? 'Musik wird abgespielt' : 'Musik pausiert');
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

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (typingTimeout) {
        clearTimeout(typingTimeout);
    }
});
