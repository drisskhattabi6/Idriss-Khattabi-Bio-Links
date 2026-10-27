const siteConfig = {
  name: "Idriss Khattabi",
  description: "AI, Data, and Software Engineer with a Master's degree in Artificial Intelligence and Data Science. Experienced in developing AI-powered applications, Data Pipelines, RAG systems, data-processing workflows, APIs, dashboards, and full-stack web platforms. Passionate about building scalable solutions that transform raw data into actionable insights and automate real-world business processes.",
  defaultThemeColor: "#8b5cf6",
  slideInterval: 7000,
};


const heroImages = [
  { src: "imgs/img1.jpg", alt: "Profile image 1" },
  { src: "imgs/img2.jpg", alt: "Profile image 2" },
  { src: "imgs/img3.jpg", alt: "Profile image 3" },
  { src: "imgs/img4.png", alt: "Profile image 4" },
];

const links = [
  {
    label: "GitHub",
    url: "https://github.com/drisskhattabi6",
    text: "@drisskhattabi6",
    icon: "fa-brands fa-github",
    color: "#181717",
  },
  {
    label: "LinkedIn",
    url: "https://www.linkedin.com/in/idriss-khattabi-b3a266235/",
    text: "Connect professionally",
    icon: "fa-brands fa-linkedin-in",
    color: "#0A66C2",
  },
  {
    label: "Portfolio",
    url: "https://drisskhattabi6.github.io/id-kh/",
    text: "See my work",
    icon: "fa-solid fa-globe",
    color: "#f59e0b",
  },
  {
    label: "Email",
    url: "mailto:drisskhattabi6@gmail.com",
    text: "drisskhattabi6@gmail.com",
    icon: "fa-regular fa-envelope",
    color: "#ef4444",
  },
  {
    label: "WhatsApp",
    url: "https://wa.me/21235245797",
    text: "Chat with me",
    icon: "fa-brands fa-whatsapp",
    color: "#25D366",
  },
  {
    label: "Phone",
    url: "tel:+21235245797",
    text: "+212 6 35 24 57 97",
    icon: "fa-solid fa-phone",
    color: "#10b981",
  },
  // {
  //   label: "Telegram",
  //   url: "https://t.me/azerty",
  //   text: "@azerty",
  //   icon: "fa-brands fa-telegram",
  //   color: "#229ED9",
  // },
];

const profileName = document.getElementById("profileName");
const profileDescription = document.getElementById("profileDescription");
const linksGrid = document.getElementById("linksGrid");
const scrollCue = document.getElementById("scrollCue");
const linksSection = document.getElementById("linksSection");

const heroBackdropA = document.getElementById("heroBackdropA");
const heroBackdropB = document.getElementById("heroBackdropB");
const heroImageA = document.getElementById("heroImageA");
const heroImageB = document.getElementById("heroImageB");

let currentSlideIndex = 0;
let activeLayer = 0;
let slideTimer = null;

function setMeta() {
  document.title = `${siteConfig.name} | Links`;

  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute("content", siteConfig.description);
  }

  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) {
    metaTheme.setAttribute("content", siteConfig.defaultThemeColor);
  }
}

function setProfile() {
  profileName.textContent = siteConfig.name;
  profileDescription.textContent = siteConfig.description;
}

function getImageEntry(index) {
  const entry = heroImages[index];

  if (!entry) {
    return {
      src: "imgs/main_imag.png",
      alt: "Profile image",
    };
  }

  if (typeof entry === "string") {
    return {
      src: entry,
      alt: "Profile image",
    };
  }

  return {
    src: entry.src,
    alt: entry.alt || "Profile image",
  };
}

function isExternalUrl(url) {
  return /^https?:\/\//i.test(url);
}

function hexToRgb(hex) {
  const clean = hex.replace("#", "").trim();

  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((char) => char + char)
          .join("")
      : clean;

  const bigint = parseInt(full, 16);

  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

function hexToRgba(hex, alpha = 1) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function rgbToHex(r, g, b) {
  return (
    "#" +
    [r, g, b]
      .map((value) => Math.max(0, Math.min(255, value)).toString(16).padStart(2, "0"))
      .join("")
  );
}

function enhanceColor(r, g, b) {
  const max = Math.max(r, g, b);

  if (max < 110) {
    const factor = 110 / Math.max(max, 1);
    r = Math.min(255, Math.round(r * factor));
    g = Math.min(255, Math.round(g * factor));
    b = Math.min(255, Math.round(b * factor));
  }

  const avg = (r + g + b) / 3;
  r = Math.max(0, Math.min(255, Math.round(avg + (r - avg) * 1.15)));
  g = Math.max(0, Math.min(255, Math.round(avg + (g - avg) * 1.15)));
  b = Math.max(0, Math.min(255, Math.round(avg + (b - avg) * 1.15)));

  return [r, g, b];
}

function extractAccentFromImage(image) {
  try {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    if (!ctx) return siteConfig.defaultThemeColor;

    const size = 80;
    canvas.width = size;
    canvas.height = size;

    ctx.drawImage(image, 0, 0, size, size);

    const { data } = ctx.getImageData(0, 0, size, size);

    let r = 0;
    let g = 0;
    let b = 0;
    let totalWeight = 0;

    for (let i = 0; i < data.length; i += 16) {
      const red = data[i];
      const green = data[i + 1];
      const blue = data[i + 2];
      const alpha = data[i + 3] / 255;

      if (alpha < 0.7) continue;

      const max = Math.max(red, green, blue);
      const min = Math.min(red, green, blue);
      const saturation = max === 0 ? 0 : (max - min) / max;
      const luminance = (0.299 * red + 0.587 * green + 0.114 * blue) / 255;

      const weight = (0.65 + saturation * 1.25) * (luminance < 0.12 ? 0.35 : 1);

      r += red * weight;
      g += green * weight;
      b += blue * weight;
      totalWeight += weight;
    }

    if (!totalWeight) return siteConfig.defaultThemeColor;

    r = Math.round(r / totalWeight);
    g = Math.round(g / totalWeight);
    b = Math.round(b / totalWeight);

    [r, g, b] = enhanceColor(r, g, b);

    return rgbToHex(r, g, b);
  } catch (error) {
    return siteConfig.defaultThemeColor;
  }
}

function applyAccent(hexColor) {
  const { r, g, b } = hexToRgb(hexColor);

  document.documentElement.style.setProperty("--accent", hexColor);
  document.documentElement.style.setProperty("--accent-rgb", `${r}, ${g}, ${b}`);

  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) {
    metaTheme.setAttribute("content", hexColor);
  }
}

function createCard(link, index) {
  const card = document.createElement("a");

  card.href = link.url;
  card.className =
    "link-card group block rounded-[1.75rem] p-[1px] focus:outline-none focus:ring-2 focus:ring-white/40";
  card.style.transitionDelay = `${index * 110}ms`;
  card.style.background = `linear-gradient(
    135deg,
    ${hexToRgba(link.color, 0.7)},
    rgba(255, 255, 255, 0.12),
    rgba(var(--accent-rgb), 0.48)
  )`;

  if (isExternalUrl(link.url)) {
    card.target = "_blank";
    card.rel = "noopener noreferrer";
  }

  card.innerHTML = `
    <div class="link-card-inner p-4 sm:p-5">
      <div class="flex items-start justify-between gap-4">
        <div class="flex min-w-0 items-center gap-4">
          <div
            class="link-icon shrink-0"
            style="
              background: linear-gradient(
                135deg,
                ${hexToRgba(link.color, 0.95)},
                rgba(var(--accent-rgb), 0.82)
              );
              box-shadow: 0 12px 28px ${hexToRgba(link.color, 0.26)};
            "
          >
            <i class="${link.icon}"></i>
          </div>

          <div class="min-w-0">
            <h3 class="truncate text-base font-semibold text-white sm:text-lg">${link.label}</h3>
            <p class="mt-1 truncate text-sm text-white/68">${link.text}</p>
          </div>
        </div>

        <i class="fa-solid fa-arrow-up-right-from-square mt-1 text-white/52 transition duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-white"></i>
      </div>
    </div>
  `;

  return card;
}

function renderLinks() {
  linksGrid.innerHTML = "";
  links.forEach((link, index) => {
    linksGrid.appendChild(createCard(link, index));
  });
}

function setupRevealAnimation() {
  const cards = document.querySelectorAll(".link-card");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -6% 0px",
    }
  );

  cards.forEach((card) => observer.observe(card));
}

function setupScrollCue() {
  scrollCue.addEventListener("click", () => {
    linksSection.scrollIntoView({ behavior: "smooth" });
  });
}

function preloadImages() {
  heroImages.forEach((item) => {
    const entry = typeof item === "string" ? { src: item } : item;
    const img = new Image();
    img.src = entry.src;
  });
}

function setInitialHeroImage() {
  const first = getImageEntry(0);

  const img = new Image();
  img.src = first.src;
  img.alt = first.alt;

  img.onload = () => {
    heroImageA.src = first.src;
    heroImageA.alt = first.alt;
    heroBackdropA.style.backgroundImage = `url("${first.src}")`;

    const accent = extractAccentFromImage(img);
    applyAccent(accent);
  };

  img.onerror = () => {
    heroImageA.src = first.src;
    heroImageA.alt = first.alt;
    heroBackdropA.style.backgroundImage = `url("${first.src}")`;
    applyAccent(siteConfig.defaultThemeColor);
  };
}

function swapHeroImage(nextIndex) {
  const next = getImageEntry(nextIndex);

  const backdrops = [heroBackdropA, heroBackdropB];
  const images = [heroImageA, heroImageB];

  const currentSlot = activeLayer;
  const nextSlot = activeLayer === 0 ? 1 : 0;

  const nextBackdrop = backdrops[nextSlot];
  const currentBackdrop = backdrops[currentSlot];
  const nextImage = images[nextSlot];
  const currentImage = images[currentSlot];

  const loader = new Image();
  loader.src = next.src;
  loader.alt = next.alt;

  loader.onload = () => {
    nextBackdrop.style.backgroundImage = `url("${next.src}")`;
    nextImage.src = next.src;
    nextImage.alt = next.alt;

    requestAnimationFrame(() => {
      nextBackdrop.classList.add("is-active");
      nextImage.classList.add("is-active");

      currentBackdrop.classList.remove("is-active");
      currentImage.classList.remove("is-active");
    });

    const accent = extractAccentFromImage(loader);
    applyAccent(accent);

    activeLayer = nextSlot;
    currentSlideIndex = nextIndex;
  };
}

function startSlideshow() {
  if (heroImages.length <= 1) return;

  slideTimer = setInterval(() => {
    const nextIndex = (currentSlideIndex + 1) % heroImages.length;
    swapHeroImage(nextIndex);
  }, siteConfig.slideInterval);
}

function init() {
  setMeta();
  setProfile();
  renderLinks();
  setupRevealAnimation();
  setupScrollCue();
  preloadImages();
  setInitialHeroImage();
  startSlideshow();
}

init();