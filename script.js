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

function setupAudioPlayer() {
    const audio = document.getElementById('bg-audio');
    const playBtn = document.getElementById('play-btn');
    const playerUI = document.getElementById('audio-player');
    if (!audio || !playBtn || !playerUI) return;

    function setPlayingState(isPlaying) {
        playBtn.setAttribute('aria-pressed', String(isPlaying));
        playBtn.setAttribute('aria-label', isPlaying ? 'Musik pausieren' : 'Musik abspielen');
        playerUI.classList.toggle('is-playing', isPlaying);
    }

    function attemptPlay() {
        return audio.play().then(() => {
            setPlayingState(true);
            return true;
        }).catch(() => {
            setPlayingState(false);
            return false;
        });
    }

    function unlockOnFirstInteraction() {
        const events = ['pointerdown', 'keydown', 'touchstart'];
        const unlock = () => {
            attemptPlay();
            events.forEach(event => document.removeEventListener(event, unlock));
        };
        events.forEach(event => document.addEventListener(event, unlock, { once: true }));
    }

    playBtn.addEventListener('click', () => {
        if (audio.paused) {
            attemptPlay();
        } else {
            audio.pause();
            setPlayingState(false);
        }
    });

    audio.addEventListener('ended', () => setPlayingState(false));

    attemptPlay().then(started => {
        if (!started) unlockOnFirstInteraction();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    startTypingEffect();
    setupAudioPlayer();
});
