// Dynamic Typewriter Effect
const roles = ["Software Developer", "Arch Linux enthusiast", "Building custom stuff..."];
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
        // Pause at the full word
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

// Start Typewriter
document.addEventListener('DOMContentLoaded', () => {
    type();
    
    // Toggle play control mockup icon
    const playBtn = document.getElementById('play-btn');
    let playing = false;
    
    playBtn.addEventListener('click', () => {
        playing = !playing;
        playBtn.textContent = playing ? '⏸' : '▶';
        playBtn.style.color = playing ? '#3b82f6' : '#9ca3af';
    });
});
