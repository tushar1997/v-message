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

    // Lock the buttons container layout so nothing shifts
    const buttonsRect = buttons.getBoundingClientRect();
    buttons.style.width = buttonsRect.width + "px";
    buttons.style.justifyContent = "flex-start";
    buttons.style.position = "relative";

    // Fix the Yes button in its current visual position within the container
    const yesRect = yesBtn.getBoundingClientRect();
    yesBtn.style.marginLeft = (yesRect.left - buttonsRect.left) + "px";

    // Preserve the space the No button occupied
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

// Create "Message for you" button dynamically and append to body
const messageBtn = document.createElement("button");
messageBtn.id = "message-btn";
messageBtn.textContent = "Message for you";
messageBtn.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 16px 32px;
    font-family: 'Pixelify Sans', sans-serif;
    font-size: 24px;
    background: linear-gradient(135deg, #ff6b6b, #ee5a24);
    color: #fff;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    z-index: 10000;
    box-shadow: 0 4px 10px rgba(0,0,0,0.3);
    display: none;
`;

document.body.appendChild(messageBtn);

yesBtn.addEventListener("click", () => {
    title.textContent = "Yippeeee!";

    catImg.src = "she said yes.png";

    document.querySelector(".letter-window").classList.add("final");

    buttons.style.display = "none";

    // Hide the No button that was moved to body
    noBtn.style.display = "none";

    finalText.style.display = "block";

    // Show the "message for you" button
    messageBtn.style.display = "block";
    messageBtn.style.position = "fixed";

    // Start blink animation via JS
    let blinkOn = true;
    const blinkInterval = setInterval(() => {
        if (messageBtn.style.display === "none") {
            clearInterval(blinkInterval);
            return;
        }
        blinkOn = !blinkOn;
        messageBtn.style.opacity = blinkOn ? "1" : "0.4";
        messageBtn.style.transform = blinkOn ? "scale(1)" : "scale(1.1)";
        messageBtn.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    }, 500);
});

// "Message for you" button — removes title text and final text, replaces image with video
messageBtn.addEventListener("click", () => {
    // Hide the "Yippeeee!" title
    title.style.display = "none";

    // Hide the final text ("Wohooooooooooo...")
    finalText.style.display = "none";

    // Replace the image with a video
    const video = document.createElement("video");
    video.src = "IMG_0125.mov";
    video.controls = true;
    video.autoplay = true;
    video.style.width = "90%";
    video.style.maxWidth = "500px";
    video.style.borderRadius = "12px";
    video.style.marginTop = "10px";
    catImg.replaceWith(video);

    // Hide the button itself after clicking
    messageBtn.style.display = "none";
    messageBtn.style.visibility = "hidden";
});
