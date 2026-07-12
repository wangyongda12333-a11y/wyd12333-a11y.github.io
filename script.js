const toast = document.querySelector(".toast");
let toastTimer;

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

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!prefersReducedMotion) {
  const revealItems = document.querySelectorAll(revealTargets.join(","));

  revealItems.forEach((item, index) => {
    item.classList.add("reveal");
    item.style.setProperty("--reveal-delay", `${Math.min(index % 4, 3) * 80}ms`);
  });

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
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
}

document.querySelectorAll("[data-scroll-top]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });

    if (window.location.hash) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  });
});
