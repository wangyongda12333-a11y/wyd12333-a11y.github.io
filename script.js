const toast = document.querySelector(".toast");
const siteHeader = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const menuClose = document.querySelector(".menu-close");
const moreMenu = document.querySelector(".more-menu");
const menuBackdrop = document.querySelector(".menu-backdrop");
let toastTimer;
let menuReadyTimer;

function setMoreMenu(open) {
  window.clearTimeout(menuReadyTimer);
  document.body.classList.remove("menu-ready");
  document.body.classList.toggle("menu-open", open);
  menuToggle?.setAttribute("aria-expanded", String(open));
  moreMenu?.setAttribute("aria-hidden", String(!open));
  if (menuToggle) menuToggle.querySelector("span").textContent = open ? "关闭" : "更多";
  if (open) {
    menuReadyTimer = window.setTimeout(() => document.body.classList.add("menu-ready"), 480);
  }
}

menuToggle?.addEventListener("click", () => setMoreMenu(!document.body.classList.contains("menu-open")));
menuClose?.addEventListener("click", () => setMoreMenu(false));
menuBackdrop?.addEventListener("click", () => setMoreMenu(false));
moreMenu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMoreMenu(false)));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && document.body.classList.contains("menu-open")) setMoreMenu(false);
});

document.querySelectorAll(".header-cta, .btn, .copy-btn, .contact-button, .menu-close, .more-menu-grid a").forEach((element) => {
  element.addEventListener("pointermove", (event) => {
    const rect = element.getBoundingClientRect();
    element.style.setProperty("--hover-x", `${event.clientX - rect.left}px`);
    element.style.setProperty("--hover-y", `${event.clientY - rect.top}px`);
  });
});

function updateHeaderMode() {
  if (!siteHeader) {
    return;
  }

  siteHeader.classList.toggle("is-floating", window.scrollY > 80);
}

updateHeaderMode();
window.addEventListener("scroll", updateHeaderMode, { passive: true });

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.classList.remove("show");
  }, 1800);
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    showToast(`已复制：${text}`);
  } catch {
    const input = document.createElement("textarea");
    input.value = text;
    input.setAttribute("readonly", "");
    input.style.position = "fixed";
    input.style.opacity = "0";
    document.body.appendChild(input);
    input.select();
    document.execCommand("copy");
    input.remove();
    showToast(`已复制：${text}`);
  }
}

document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", () => {
    copyText(button.dataset.copy).catch(() => {
      showToast("复制失败，请手动复制绿色内容");
    });
  });
});

const feedbackLightbox = document.querySelector(".feedback-lightbox");
const feedbackCarousel = document.querySelector(".feedback-carousel");
const feedbackCarouselTrack = document.querySelector(".feedback-carousel-track");
const feedbackFrames = document.querySelectorAll(".feedback-frame");
const feedbackDots = document.querySelectorAll("[data-feedback-dot]");
const lightboxDots = document.querySelectorAll("[data-lightbox-dot]");
const feedbackEnlarged = document.querySelector(".feedback-enlarged");
let feedbackIndex = 0;
let feedbackAutoplay;
let feedbackWheelLocked = false;

function showFeedback(index) {
  if (!feedbackFrames.length || !feedbackCarouselTrack) return;
  feedbackIndex = (index + feedbackFrames.length) % feedbackFrames.length;
  feedbackCarouselTrack.style.transform = `translateX(-${feedbackIndex * 100}%)`;
  feedbackDots.forEach((dot, dotIndex) => dot.classList.toggle("is-active", dotIndex === feedbackIndex));
  lightboxDots.forEach((dot, dotIndex) => dot.classList.toggle("is-active", dotIndex === feedbackIndex));
}

function startFeedbackAutoplay() {
  window.clearInterval(feedbackAutoplay);
  feedbackAutoplay = window.setInterval(() => showFeedback(feedbackIndex + 1), 3200);
}

function openFeedback(index) {
  if (!feedbackLightbox) return;
  if (feedbackEnlarged) feedbackEnlarged.dataset.feedbackIndex = String(index);
  feedbackLightbox.classList.add("is-open");
  feedbackLightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("lightbox-open");
  window.clearInterval(feedbackAutoplay);
}

function switchEnlargedFeedback(direction) {
  if (!feedbackEnlarged || feedbackWheelLocked) return;
  feedbackWheelLocked = true;
  feedbackEnlarged.classList.add("is-switching");
  window.setTimeout(() => {
    showFeedback(feedbackIndex + direction);
    feedbackEnlarged.dataset.feedbackIndex = String(feedbackIndex);
    feedbackEnlarged.classList.remove("is-switching");
  }, 160);
  window.setTimeout(() => { feedbackWheelLocked = false; }, 440);
}

function closeFeedback() {
  if (!feedbackLightbox) return;
  feedbackLightbox.classList.remove("is-open");
  feedbackLightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("lightbox-open");
  startFeedbackAutoplay();
}

feedbackFrames.forEach((frame) => {
  frame.addEventListener("click", () => openFeedback(Number(frame.dataset.feedbackIndex)));
});

feedbackDots.forEach((dot) => {
  dot.addEventListener("click", () => {
    showFeedback(Number(dot.dataset.feedbackDot));
    startFeedbackAutoplay();
  });
});

lightboxDots.forEach((dot) => {
  dot.addEventListener("click", () => {
    showFeedback(Number(dot.dataset.lightboxDot));
    if (feedbackEnlarged) feedbackEnlarged.dataset.feedbackIndex = String(feedbackIndex);
  });
});

feedbackCarousel?.addEventListener("mouseenter", () => window.clearInterval(feedbackAutoplay));
feedbackCarousel?.addEventListener("mouseleave", startFeedbackAutoplay);

feedbackLightbox?.addEventListener("click", (event) => {
  if (event.target === feedbackLightbox) closeFeedback();
});

feedbackLightbox?.addEventListener("wheel", (event) => {
  event.preventDefault();
  if (Math.abs(event.deltaY) + Math.abs(event.deltaX) < 8) return;
  const distance = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
  switchEnlargedFeedback(distance > 0 ? 1 : -1);
}, { passive: false });

showFeedback(0);
startFeedbackAutoplay();

document.addEventListener("keydown", (event) => {
  if (!feedbackLightbox?.classList.contains("is-open")) return;
  if (event.key === "Escape") closeFeedback();
});

function splitTextElement(element) {
  if (element.dataset.splitReady === "true") {
    return;
  }

  const text = element.textContent.trim();

  if (!text) {
    return;
  }

  element.dataset.splitReady = "true";
  element.setAttribute("aria-label", text);
  element.textContent = "";

  let splitIndex = 0;
  Array.from(text).forEach((char) => {
    if (/\s/.test(char)) {
      element.appendChild(document.createTextNode(" "));
      return;
    }

    const span = document.createElement("span");
    span.className = "split-char";
    span.setAttribute("aria-hidden", "true");
    span.textContent = char;
    span.style.setProperty("--split-index", splitIndex);
    splitIndex += 1;
    element.appendChild(span);
  });
}

function playSplitTextElement(element) {
  element.classList.remove("split-text-play");

  window.setTimeout(() => {
    element.classList.add("split-text-play");
  }, 520);
}

document.querySelectorAll("[data-split-text]").forEach((element) => {
  splitTextElement(element);
  playSplitTextElement(element);
});

const revealTargets = [
  ".intro-band .metric",
  ".section-heading",
  ".service-card",
  ".package-card",
  ".process-list li",
  ".proof-panel",
  ".rules-panel",
  ".contact-card",
];

const revealItems = document.querySelectorAll(revealTargets.join(","));

revealItems.forEach((item, index) => {
  item.classList.add("reveal");
  item.style.setProperty("--reveal-delay", `${Math.min(index % 4, 3) * 80}ms`);
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        return;
      }

      entry.target.classList.remove("is-visible");
    });
  },
  {
    threshold: 0.16,
    rootMargin: "0px 0px -8% 0px",
  }
);

revealItems.forEach((item) => {
  revealObserver.observe(item);
});

function easeInOutCubic(progress) {
  return progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;
}

function humanScrollTo(targetTop) {
  const startTop = window.scrollY;
  const distance = targetTop - startTop;
  const duration = Math.min(1050, Math.max(420, Math.abs(distance) * 0.38));
  const startTime = performance.now();

  function step(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeInOutCubic(progress);

    window.scrollTo(0, startTop + distance * eased);

    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  }

  window.requestAnimationFrame(step);
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const hash = link.getAttribute("href");

    if (!hash || hash === "#") {
      return;
    }

    const target = document.querySelector(hash);

    if (!target) {
      return;
    }

    event.preventDefault();
    const headerHeight = document.querySelector(".site-header")?.offsetHeight || 0;
    const targetTop = hash === "#top" ? 0 : target.getBoundingClientRect().top + window.scrollY - headerHeight - 12;

    humanScrollTo(Math.max(targetTop, 0));

    if (hash === "#top") {
      history.replaceState(null, "", window.location.pathname + window.location.search);
      return;
    }

    history.pushState(null, "", hash);
  });
});
