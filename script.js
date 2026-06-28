const typingConfig = {
    roles: [
        "Idk :3",
        "Building random stuff",
        "Roblox Developer",
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
        // Show cursor while typing/deleting
        if (cursorElement) {
            cursorElement.classList.remove('hidden');
        }
        let delay = isDeleting ? typingConfig.deletingSpeed : typingConfig.typingSpeed;
        if (!isDeleting && charIndex === currentRole.length) {
            // Finished typing – hide cursor during pause
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
// Subtle 3D tilt on the card as the cursor moves over it.
// Skipped entirely for touch input and for prefers-reduced-motion.
function setupCardTilt() {
    const frame = document.querySelector('.card-frame');
    if (!frame) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const maxTiltDeg = 6;

    function handlePointerMove(event) {
        const rect = frame.getBoundingClientRect();
        const relativeX = (event.clientX - rect.left) / rect.width;
        const relativeY = (event.clientY - rect.top) / rect.height;
        const rotateY = (relativeX - 0.5) * maxTiltDeg * 2;
        const rotateX = (0.5 - relativeY) * maxTiltDeg * 2;
        frame.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }

    function resetTilt() {
        frame.style.transform = 'rotateX(0deg) rotateY(0deg)';
    }

    frame.addEventListener('pointermove', event => {
        if (event.pointerType === 'touch') return;
        handlePointerMove(event);
    });
    frame.addEventListener('pointerleave', resetTilt);
}
document.addEventListener('DOMContentLoaded', () => {
    startTypingEffect();
    setupAudioControls();
    setupCardTilt();
});
// Cleanup timeout on page unload
window.addEventListener('beforeunload', () => {
    if (typingTimeout) {
        clearTimeout(typingTimeout);
    }
});
