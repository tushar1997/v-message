// Elements
const envelope = document.getElementById("envelope-container");
const letter = document.getElementById("letter-container");
const noBtn = document.querySelector(".no-btn");
const yesBtn = document.querySelector(".btn[alt='Yes']");

const title = document.getElementById("letter-title");
const catImg = document.getElementById("letter-cat");
const buttons = document.getElementById("letter-buttons");
const finalText = document.getElementById("final-text");

// Click Envelope

envelope.addEventListener("click", () => {
    envelope.style.display = "none";
    letter.style.display = "flex";

    setTimeout( () => {
        document.querySelector(".letter-window").classList.add("open");
    },50);
});

// Logic to move the NO btn — cursor can never reach it

// Track current offset so the button moves in absolute terms
let noBtnOffsetX = 0;
let noBtnOffsetY = 0;
const FLEE_RADIUS = 120; // px – how close cursor can get before button runs

document.addEventListener("mousemove", (e) => {
    const rect = noBtn.getBoundingClientRect();
    const btnCenterX = rect.left + rect.width / 2;
    const btnCenterY = rect.top + rect.height / 2;

    const dx = e.clientX - btnCenterX;
    const dy = e.clientY - btnCenterY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < FLEE_RADIUS) {
        // Jump away from the cursor
        const jumpDist = 180 + Math.random() * 120; // 180-300px
        // Flee in the opposite direction of the cursor (with some randomness)
        const fleeAngle = Math.atan2(-dy, -dx) + (Math.random() - 0.5) * 1.2;

        let newX = noBtnOffsetX + Math.cos(fleeAngle) * jumpDist;
        let newY = noBtnOffsetY + Math.sin(fleeAngle) * jumpDist;

        // Clamp to keep button fully inside viewport
        const pad = 10;
        const origRect = noBtn.getBoundingClientRect();
        const origLeft = origRect.left - noBtnOffsetX;
        const origTop = origRect.top - noBtnOffsetY;

        const minX = pad - origLeft;
        const minY = pad - origTop;
        const maxX = window.innerWidth - pad - origRect.width - origLeft;
        const maxY = window.innerHeight - pad - origRect.height - origTop;

        newX = Math.max(minX, Math.min(maxX, newX));
        newY = Math.max(minY, Math.min(maxY, newY));

        noBtnOffsetX = newX;
        noBtnOffsetY = newY;

        noBtn.style.transition = "transform 0.25s ease-out";
        noBtn.style.transform = `translate(${noBtnOffsetX}px, ${noBtnOffsetY}px)`;
    }
});

// Block any click/touch on the No button just in case
noBtn.addEventListener("click", (e) => e.preventDefault());
noBtn.addEventListener("touchstart", (e) => e.preventDefault(), { passive: false });

// Logic to make YES btn to grow

// let yesScale = 1;

// yesBtn.style.position = "relative"
// yesBtn.style.transformOrigin = "center center";
// yesBtn.style.transition = "transform 0.3s ease";

// noBtn.addEventListener("click", () => {
//     yesScale += 2;

//     if (yesBtn.style.position !== "fixed") {
//         yesBtn.style.position = "fixed";
//         yesBtn.style.top = "50%";
//         yesBtn.style.left = "50%";
//         yesBtn.style.transform = `translate(-50%, -50%) scale(${yesScale})`;
//     }else{
//         yesBtn.style.transform = `translate(-50%, -50%) scale(${yesScale})`;
//     }
// });

// YES is clicked

yesBtn.addEventListener("click", () => {
    title.textContent = "Yippeeee!";

    catImg.src = "cat_dance.gif";

    document.querySelector(".letter-window").classList.add("final");

    buttons.style.display = "none";

    finalText.style.display = "block";
});
