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

    // Wait a frame so the letter-window .open transition has started
    // and we can read a reasonable initial position
    const rect = noBtn.getBoundingClientRect();
    noBtnX = rect.left;
    noBtnY = rect.top;

    // Preserve the space the No button occupied so the Yes button doesn't shift
    const wrapper = noBtn.parentElement;
    wrapper.style.width = rect.width + "px";
    wrapper.style.height = rect.height + "px";

    // Move the button out of the transformed parent into <body>
    // so that position:fixed works relative to the viewport
    document.body.appendChild(noBtn);

    noBtn.style.position = "fixed";
    noBtn.style.left = noBtnX + "px";
    noBtn.style.top = noBtnY + "px";
    noBtn.style.transform = "none";
    noBtn.style.margin = "0";
    noBtn.style.zIndex = "9999";
    noBtn.style.pointerEvents = "none";
    noBtnReady = true;
}

document.addEventListener("mousemove", (e) => {
    // Only activate after the letter is visible
    if (letter.style.display !== "flex") return;

    // Delay init slightly so the letter window is open and positioned
    if (!noBtnReady) {
        setTimeout(() => {
            initNoBtn();
        }, 400);
        return;
    }

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
        const fleeAngle = Math.atan2(-dy, -dx) + (Math.random() - 0.5) * 0.8;

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
noBtn.addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); });
noBtn.addEventListener("touchstart", (e) => { e.preventDefault(); e.stopPropagation(); }, { passive: false });

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

    catImg.src = "she said yes.png";

    document.querySelector(".letter-window").classList.add("final");

    buttons.style.display = "none";

    // Hide the No button that was moved to body
    noBtn.style.display = "none";

    finalText.style.display = "block";
});
