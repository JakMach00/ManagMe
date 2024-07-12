document.addEventListener("DOMContentLoaded", () => {
  const sunIcon = document.getElementById("sun-icon") as HTMLButtonElement;
  const moonIcon = document.getElementById("moon-icon") as HTMLButtonElement;

  if (!sunIcon || !moonIcon) {
    console.error("Elementy ikonek nie zostały znalezione");
    return;
  }

  const currentTheme = localStorage.getItem("theme") || "light";

  if (currentTheme === "dark") {
    document.body.classList.add("dark-mode");
    sunIcon.style.display = "none";
    moonIcon.style.display = "inline";
  } else {
    sunIcon.style.display = "inline";
    moonIcon.style.display = "none";
  }

  sunIcon.addEventListener("click", () => {
    document.body.classList.add("dark-mode");
    localStorage.setItem("theme", "dark");
    sunIcon.style.display = "none";
    moonIcon.style.display = "inline";
  });

  moonIcon.addEventListener("click", () => {
    document.body.classList.remove("dark-mode");
    localStorage.setItem("theme", "light");
    sunIcon.style.display = "inline";
    moonIcon.style.display = "none";
  });
});
