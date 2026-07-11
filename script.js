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
