const hero = document.querySelector(".hero");
let targetSplit = 55;
let displayedSplit = 55;

function setTarget(pointerX) {
  const width = hero.getBoundingClientRect().width;
  const position = Math.max(0, Math.min(100, (pointerX / width) * 100));

  // The developer expands leftward by 85%; the designer expands rightward by 15%.
  if (position > 55) targetSplit = 55 - ((position - 55) / 20) * 55;
  else targetSplit = 55 + ((55 - position) / 30) * 45;
  targetSplit = Math.max(0, Math.min(100, targetSplit));
}

function animate() {
  // A low interpolation value makes the panels glide rather than snap.
  displayedSplit += (targetSplit - displayedSplit) * 0.035;
  hero.style.setProperty("--split", `${displayedSplit}%`);
  const designerVisibility = Math.min(1, displayedSplit / 55);
  const developerVisibility = Math.min(1, (100 - displayedSplit) / 45);
  hero.style.setProperty("--designer-visibility", designerVisibility);
  hero.style.setProperty("--developer-visibility", developerVisibility);
  hero.style.setProperty("--designer-color", `${designerVisibility * 100}%`);
  hero.style.setProperty(
    "--developer-color",
    `${(1 - developerVisibility) * 100}%`,
  );
  // Expansion progress must be calculated from the split itself. The visibility
  // values describe the fading side, so they remain at 1 for the active panel.
  const designerTakeover = Math.max(0, (displayedSplit - 55) / 45);
  const developerTakeover = Math.max(0, (55 - displayedSplit) / 55);
  hero.style.setProperty(
    "--developer-title-top",
    `${26 - developerTakeover * 20}%`,
  );
  hero.style.setProperty(
    "--designer-title-size",
    `${12 + designerTakeover * 3}dvh`,
  );
  hero.style.setProperty(
    "--developer-title-size",
    `${12 + developerTakeover * 3}dvh`,
  );
  hero.style.setProperty(
    "--signature-bottom",
    `${13 + designerTakeover * 15}%`,
  );
  const portraitPosition =
    displayedSplit < 55
      ? 20 + displayedSplit * (35 / 55)
      : 55 + (displayedSplit - 55) * (25 / 45);
  hero.style.setProperty("--portrait-position", `${portraitPosition}%`);
  // Preserve each illustration's initial offset while the matching role expands.
  const flowerOffset = Math.max(0, portraitPosition - 55);
  const laptopOffset = Math.min(0, portraitPosition - 55);
  hero.style.setProperty("--flower-offset", `${flowerOffset}%`);
  hero.style.setProperty("--laptop-offset", `${laptopOffset}%`);
  hero.classList.toggle("designer-active", displayedSplit > 96);
  hero.classList.toggle("developer-active", displayedSplit < 4);
  requestAnimationFrame(animate);
}

hero.addEventListener("pointermove", (event) => setTarget(event.clientX));
hero.addEventListener("pointerleave", () => {
  targetSplit = 55;
});
hero.addEventListener(
  "touchmove",
  (event) => setTarget(event.touches[0].clientX),
  { passive: true },
);
// The entry animations hold their final frame; release that frame so the
// pointer-controlled clipping takes over as soon as the intro has finished.
document.querySelectorAll(".panel").forEach((panel) => {
  panel.addEventListener(
    "animationend",
    () => {
      panel.style.animation = "none";
    },
    { once: true },
  );
});
animate();

document.getElementById("backToTop").addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

const button = document.getElementById("backToTop");

button.style.opacity = "0";
button.style.pointerEvents = "none";

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    button.style.opacity = "1";
    button.style.pointerEvents = "auto";
  } else {
    button.style.opacity = "0";
    button.style.pointerEvents = "none";
  }
});

button.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});
