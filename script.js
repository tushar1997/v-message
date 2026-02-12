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

let noBtnReady = false;
let noBtnX = 0;
let noBtnY = 0;
const FLEE_RADIUS = 130; // px – how close cursor can get before button flees
const PAD = 15;

function initNoBtn() {
    if (noBtnReady) return;
    // Capture current on-screen position, then switch to fixed positioning
    const rect = noBtn.getBoundingClientRect();
    noBtnX = rect.left;
    noBtnY = rect.top;
    noBtn.style.position = "fixed";
    noBtn.style.left = noBtnX + "px";
    noBtn.style.top = noBtnY + "px";
    noBtn.style.transform = "none";
    noBtn.style.margin = "0";
    noBtnReady = true;
}

document.addEventListener("mousemove", (e) => {
    // Only activate after the letter is visible
    if (letter.style.display !== "flex") return;
    initNoBtn();

    const w = noBtn.offsetWidth;
    const h = noBtn.offsetHeight;
    const btnCenterX = noBtnX + w / 2;
    const btnCenterY = noBtnY + h / 2;

    const dx = e.clientX - btnCenterX;
    const dy = e.clientY - btnCenterY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < FLEE_RADIUS) {
        // Flee in the opposite direction of the cursor (with slight randomness)
        const jumpDist = 160 + Math.random() * 100;
        const fleeAngle = Math.atan2(-dy, -dx) + (Math.random() - 0.5) * 1.0;

        let newX = noBtnX + Math.cos(fleeAngle) * jumpDist;
        let newY = noBtnY + Math.sin(fleeAngle) * jumpDist;

        // Clamp to keep button fully inside viewport
        newX = Math.max(PAD, Math.min(window.innerWidth - w - PAD, newX));
        newY = Math.max(PAD, Math.min(window.innerHeight - h - PAD, newY));

        noBtnX = newX;
        noBtnY = newY;

        noBtn.style.transition = "left 0.25s ease-out, top 0.25s ease-out";
        noBtn.style.left = noBtnX + "px";
        noBtn.style.top = noBtnY + "px";
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
