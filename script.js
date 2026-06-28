const roles = ["Idk what to put here :3", "Building custom stuff..."];
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

document.addEventListener('DOMContentLoaded', () => {
    type();

    const audio = document.getElementById('bg-audio');
    const playBtn = document.getElementById('play-btn');
    const playerUI = document.getElementById('audio-player');

    if(audio && playBtn) {
        playBtn.addEventListener('click', () => {
            if (audio.paused) {
                audio.play();
                playBtn.setAttribute('aria-pressed', 'true');
                playBtn.setAttribute('aria-label', 'Musik pausieren');
                playerUI.classList.add('is-playing');
            } else {
                audio.pause();
                playBtn.setAttribute('aria-pressed', 'false');
                playBtn.setAttribute('aria-label', 'Musik abspielen');
                playerUI.classList.remove('is-playing');
            }
        });
        
        audio.addEventListener('ended', () => {
            playBtn.setAttribute('aria-pressed', 'false');
            playerUI.classList.remove('is-playing');
        });
    }
});
