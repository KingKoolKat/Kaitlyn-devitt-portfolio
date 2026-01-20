const defaultSite = {
  name: "Kaitlyn Devitt",
  tagline: "Documentary photographer and storyteller",
  footerText: "Available for editorial, documentary, and long form features.",
  email: "hello@example.com",
  colors: {
    background: "#f3f8f5",
    surface: "#ffffff",
    ink: "#0b2b27",
    inkMuted: "#3a5b56",
    accent: "#2a7f6f",
    accent2: "#3f7da8"
  },
  socials: [
    { label: "Instagram", url: "https://instagram.com/", icon: "instagram" },
    { label: "Vimeo", url: "https://vimeo.com/", icon: "vimeo" }
  ]
};

const defaultNav = [
  { label: "Home", href: "index.html" },
  { label: "Reel", href: "reel.html" },
  { label: "TV", href: "tv.html" },
  { label: "Print", href: "print.html" },
  { label: "Radio", href: "radio.html" },
  { label: "Photography", href: "photography.html" }
];

const socialIconMap = {
  instagram: `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" stroke="currentColor" stroke-width="1.7" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="5" ry="5"></rect>
      <circle cx="12" cy="12" r="3.5"></circle>
      <circle cx="17.5" cy="6.5" r="1"></circle>
    </svg>
  `,
  linkedin: `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" stroke="currentColor" stroke-width="1.7" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"></rect>
      <line x1="8" y1="10" x2="8" y2="16"></line>
      <circle cx="8" cy="7.5" r="1"></circle>
      <path d="M12 16v-3.2a2 2 0 0 1 4 0V16"></path>
    </svg>
  `,
  vimeo: `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" stroke="currentColor" stroke-width="1.7" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 8l4 8 4-8 4 8 4-8"></path>
    </svg>
  `,
  youtube: `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="6" width="18" height="12" rx="3"></rect>
      <polygon points="10 9 15 12 10 15" fill="currentColor" stroke="none"></polygon>
    </svg>
  `,
  tiktok: `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" stroke="currentColor" stroke-width="1.7" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path d="M14 5v9a3 3 0 1 1-2-2.83V9h6a4 4 0 0 0 4 4"></path>
    </svg>
  `,
  x: `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" stroke="currentColor" stroke-width="1.7" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path d="M5 5l14 14M19 5L5 19"></path>
    </svg>
  `,
  facebook: `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v5h4v-5h3l1-4h-4V8a1 1 0 0 1 1-1z"></path>
    </svg>
  `
};

function getSocialIconMarkup(iconName) {
  if (!iconName || typeof iconName !== "string") return "";
  const key = iconName.trim().toLowerCase();
  if (!key || key === "none") return "";
  return socialIconMap[key] || "";
}

function fallbackSocialLabel(item) {
  if (item && typeof item.label === "string" && item.label.trim()) {
    return item.label.trim();
  }
  if (item && typeof item.icon === "string" && item.icon.trim()) {
    return item.icon.trim();
  }
  return "Social link";
}

let lightboxState = null;
const fontImportCache = new Set();
const typographyVarMap = {
  headingFont: "--font-heading",
  bodyFont: "--font-body",
  baseSize: "--font-size-base",
  brandSize: "--font-size-brand",
  taglineSize: "--font-size-tagline",
  navSize: "--font-size-nav",
  h1Size: "--font-size-h1",
  h2Size: "--font-size-h2",
  h3Size: "--font-size-h3",
  h4Size: "--font-size-h4",
  heroTitleSize: "--font-size-hero-title",
  heroSubtitleSize: "--font-size-hero-subtitle",
  eyebrowSize: "--font-size-eyebrow",
  leadSize: "--font-size-lead",
  metaSize: "--font-size-meta",
  captionSize: "--font-size-caption",
  photoCaptionSize: "--font-size-photo-caption",
  footerTitleSize: "--font-size-footer-title"
};

function addFontImport(url) {
  if (!url || typeof url !== "string") return;
  const trimmed = url.trim();
  if (!trimmed || fontImportCache.has(trimmed)) return;
  fontImportCache.add(trimmed);
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = trimmed;
  link.dataset.fontImport = "true";
  document.head.appendChild(link);
}

function applyTypographyVars(target, values) {
  if (!target || !values) return;
  Object.entries(typographyVarMap).forEach(([key, variable]) => {
    const value = values[key];
    if (value === undefined || value === null) return;
    const normalized = String(value).trim();
    if (!normalized) return;
    target.style.setProperty(variable, normalized);
  });
}

function applySectionTypography(sections) {
  if (!sections) return;
  const sectionMap = {
    header: ".site-header",
    hero: "#hero",
    about: "#about",
    previews: "#previews",
    pageHero: ".page-hero",
    reel: "#reel-section",
    list: "#list-section",
    photography: "#photography-section",
    footer: ".site-footer"
  };

  Object.entries(sectionMap).forEach(([key, selector]) => {
    const values = sections[key];
    if (!values) return;
    document.querySelectorAll(selector).forEach((element) => {
      applyTypographyVars(element, values);
    });
  });
}

function applyTypography(siteData) {
  const typography = siteData && siteData.site && siteData.site.typography;
  if (!typography) return;

  applyTypographyVars(document.documentElement, typography);

  if (Array.isArray(typography.fontImports)) {
    typography.fontImports.forEach((entry) => {
      if (typeof entry === "string") {
        addFontImport(entry);
      } else if (entry && typeof entry.url === "string") {
        addFontImport(entry.url);
      }
    });
  } else if (typeof typography.fontImports === "string") {
    addFontImport(typography.fontImports);
  }

  applySectionTypography(typography.sections);
}

function applyThemeColors(siteData) {
  const colors = siteData && siteData.site && siteData.site.colors;
  if (!colors) return;

  const root = document.documentElement;
  const mapping = {
    background: "--color-bg",
    surface: "--color-surface",
    ink: "--color-ink",
    inkMuted: "--color-ink-muted",
    accent: "--color-accent",
    accent2: "--color-accent-2"
  };

  Object.entries(mapping).forEach(([key, variable]) => {
    const value = colors[key];
    if (typeof value === "string" && value.trim()) {
      root.style.setProperty(variable, value.trim());
    }
  });
}

function ensureLightbox() {
  if (lightboxState) return lightboxState;
  const overlay = document.createElement("div");
  overlay.id = "lightbox";
  overlay.className = "lightbox";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-hidden", "true");

  overlay.innerHTML = `
    <div class="lightbox-content" role="document">
      <button class="lightbox-close" type="button" aria-label="Close image">&times;</button>
      <figure class="lightbox-figure">
        <img class="lightbox-image" alt="">
        <figcaption class="lightbox-caption"></figcaption>
      </figure>
    </div>
  `;

  document.body.appendChild(overlay);

  const closeButton = overlay.querySelector(".lightbox-close");
  const image = overlay.querySelector(".lightbox-image");
  const caption = overlay.querySelector(".lightbox-caption");
  let lastFocused = null;

  function closeLightbox() {
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-open");
    image.src = "";
    image.alt = "";
    caption.textContent = "";
    caption.style.display = "none";
    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus();
    }
  }

  function openLightbox(data) {
    if (!data || !data.src) return;
    lastFocused = document.activeElement;
    image.src = data.src;
    image.alt = data.alt || "";
    if (data.caption) {
      caption.textContent = data.caption;
      caption.style.display = "block";
    } else {
      caption.textContent = "";
      caption.style.display = "none";
    }
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");
    closeButton.focus();
  }

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
      closeLightbox();
    }
  });

  closeButton.addEventListener("click", closeLightbox);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && overlay.classList.contains("open")) {
      closeLightbox();
    }
  });

  lightboxState = {
    open: openLightbox,
    close: closeLightbox
  };

  return lightboxState;
}

function pageFromHref(href) {
  if (!href) return "";
  const file = href.split("/").pop();
  if (!file || file === "index.html") return "home";
  return file.replace(".html", "");
}

function isExternal(url) {
  return /^https?:\/\//i.test(url);
}

async function loadJson(path) {
  try {
    const response = await fetch(path, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Failed to load ${path}`);
    }
    return await response.json();
  } catch (error) {
    console.warn(error);
    return null;
  }
}

async function loadCollection(indexPath, entriesPath) {
  const indexData = await loadJson(indexPath);
  if (!indexData) return null;

  const basePath = entriesPath || indexPath.replace(/\/index\.json$/, "/entries");
  const itemsList = Array.isArray(indexData.items) ? indexData.items : [];

  const items = await Promise.all(itemsList.map(async (item) => {
    if (!item) return null;
    if (typeof item === "string") {
      const entry = await loadJson(`${basePath}/${item}.json`);
      return entry ? { slug: item, ...entry } : null;
    }
    if (typeof item === "object" && item.slug) {
      const entry = await loadJson(`${basePath}/${item.slug}.json`);
      return entry ? { slug: item.slug, ...entry } : null;
    }
    return item;
  }));

  return { index: indexData, items: items.filter(Boolean) };
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (!element) return;
  if (value) {
    element.textContent = value;
    element.style.display = "";
  } else {
    element.textContent = "";
    element.style.display = "none";
  }
}

function setLink(id, text, href) {
  const element = document.getElementById(id);
  if (!element) return;
  if (text && href) {
    element.textContent = text;
    element.href = href;
    element.style.display = "inline-flex";
  } else {
    element.style.display = "none";
  }
}

function setImage(id, src, alt) {
  const element = document.getElementById(id);
  if (!element) return;
  if (src) {
    element.src = src;
    element.alt = alt || "";
    element.loading = "lazy";
    element.style.display = "block";
  } else {
    element.style.display = "none";
  }
}

function injectHeaderFooter(siteData) {
  const site = (siteData && siteData.site) || defaultSite;
  const navItems = (siteData && siteData.nav && siteData.nav.length) ? siteData.nav : defaultNav;

  const header = document.getElementById("site-header");
  if (header) {
    const navMarkup = navItems.map((item) => {
      const href = item.file || item.href || "#";
      const page = typeof item.page === "string" ? item.page : pageFromHref(href);
      const classes = ["nav-link", item.isButton ? "nav-button" : ""].filter(Boolean).join(" ");
      const shouldDownload = item.download || Boolean(item.file);
      const downloadAttr = shouldDownload ? " download" : "";
      const externalAttrs = (!shouldDownload && isExternal(href))
        ? " target=\"_blank\" rel=\"noopener\""
        : "";
      return `<li><a class="${classes}" data-page="${page}" href="${href}"${downloadAttr}${externalAttrs}>${item.label}</a></li>`;
    }).join("");

    header.innerHTML = `
      <a class="skip-link" href="#main-content">Skip to content</a>
      <div class="container nav-wrap">
        <div class="brand-group">
          <a class="brand" href="index.html">${site.name}</a>
          ${site.tagline ? `<span class="brand-tagline">${site.tagline}</span>` : ""}
        </div>
        <nav aria-label="Main">
          <ul class="nav-list">${navMarkup}</ul>
        </nav>
      </div>
    `;
  }

  const footer = document.getElementById("site-footer");
  if (footer) {
    const year = new Date().getFullYear();
    const socialMarkup = (site.socials || []).map((item) => {
      const target = isExternal(item.url) ? " target=\"_blank\" rel=\"noopener\"" : "";
      const icon = getSocialIconMarkup(item.icon);
      const label = fallbackSocialLabel(item);
      const showLabel = item.showLabel !== false;
      const linkClass = `social-link${!showLabel ? " icon-only" : ""}`;
      const labelMarkup = showLabel ? `<span>${label}</span>` : `<span class="sr-only">${label}</span>`;
      const aria = !showLabel ? ` aria-label="${label}"` : "";
      return `<a class="${linkClass}" href="${item.url}"${target}${aria}>${icon ? `<span class="social-icon">${icon}</span>` : ""}${labelMarkup}</a>`;
    }).join("");

    footer.innerHTML = `
      <div class="container footer-inner">
        <div>
          <p class="footer-title">${site.name}</p>
          ${site.footerText ? `<p class="muted">${site.footerText}</p>` : ""}
        </div>
        <div class="footer-meta">
          ${site.email ? `<a href="mailto:${site.email}">${site.email}</a>` : ""}
          ${socialMarkup ? `<div class="footer-links">${socialMarkup}</div>` : ""}
          <p class="muted">&copy; ${year}</p>
        </div>
      </div>
    `;
  }

  setActiveNav();
}

function setActiveNav() {
  const current = document.body.dataset.page;
  if (!current) return;
  document.querySelectorAll(".nav-link").forEach((link) => {
    if (link.dataset.page === current) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });
}

function renderPhotoGrid(grid, items) {
  if (!grid) return;
  grid.innerHTML = "";
  if (!items || items.length === 0) return;
  const lightbox = ensureLightbox();
  items.forEach((item, index) => {
    if (!item) return;
    const src = item.image || item.src;
    if (!src) return;

    const figure = document.createElement("figure");
    figure.className = "photo-card fade-in";
    figure.style.animationDelay = `${index * 0.06}s`;
    figure.tabIndex = 0;
    figure.setAttribute("role", "button");

    const image = document.createElement("img");
    image.src = src;
    image.alt = item.alt || "";
    image.loading = "lazy";

    figure.appendChild(image);

    if (item.caption) {
      const caption = document.createElement("figcaption");
      caption.textContent = item.caption;
      figure.appendChild(caption);
    }

    const altText = item.alt || item.caption || "Photo";
    figure.setAttribute("aria-label", `View larger: ${altText}`);
    figure.addEventListener("click", () => {
      lightbox.open({
        src,
        alt: altText,
        caption: item.caption || ""
      });
    });
    figure.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        lightbox.open({
          src,
          alt: altText,
          caption: item.caption || ""
        });
      }
    });

    grid.appendChild(figure);
  });
}

function renderHome(data) {
  const hero = data.hero || {};
  const heroEl = document.getElementById("hero");
  if (heroEl && hero.backgroundImage) {
    heroEl.style.setProperty("--hero-image", `url("${hero.backgroundImage}")`);
  }
  if (heroEl) {
    if (hero.overlay === false) {
      heroEl.classList.add("no-overlay");
    } else {
      heroEl.classList.remove("no-overlay");
    }
  }

  setText("hero-eyebrow", hero.eyebrow);
  setText("hero-title", hero.title);
  setText("hero-subtitle", hero.subtitle);
  setLink("hero-cta", hero.ctaText, hero.ctaLink);
  setLink("hero-cta-secondary", hero.secondaryCtaText, hero.secondaryCtaLink);
  const heroActions = document.querySelector(".hero-actions");
  if (heroActions) {
    const hasPrimary = Boolean(hero.ctaText && hero.ctaLink);
    const hasSecondary = Boolean(hero.secondaryCtaText && hero.secondaryCtaLink);
    heroActions.style.display = (hasPrimary || hasSecondary) ? "" : "none";
  }

  setText("about-title", data.about && data.about.heading);
  setText("about-body", data.about && data.about.body);
  setImage("about-image", data.about && data.about.image, data.about && data.about.imageAlt);

  const personal = data.personalPhotos || {};
  const personalSection = document.getElementById("personal-photos");
  setText("personal-title", personal.heading);
  setText("personal-intro", personal.intro);

  const personalHeading = personalSection ? personalSection.querySelector(".section-heading") : null;
  if (personalHeading) {
    const hasHeading = Boolean(personal.heading && personal.heading.trim());
    const hasIntro = Boolean(personal.intro && personal.intro.trim());
    personalHeading.style.display = (hasHeading || hasIntro) ? "" : "none";
  }

  const personalGrid = document.getElementById("personal-grid");
  const personalEnabled = personal.enabled !== false;
  if (!personalEnabled) {
    if (personalSection) {
      personalSection.style.display = "none";
    }
  } else if (personalGrid && Array.isArray(personal.photos) && personal.photos.length > 0) {
    renderPhotoGrid(personalGrid, personal.photos);
  } else if (personalSection) {
    personalSection.style.display = "none";
  }

  setText("preview-title", data.previews && data.previews.heading);
  setText("preview-intro", data.previews && data.previews.intro);

  const previewGrid = document.getElementById("preview-grid");
  if (previewGrid && Array.isArray(data.previews && data.previews.items)) {
    previewGrid.innerHTML = "";
    data.previews.items.forEach((item, index) => {
      const card = document.createElement("article");
      card.className = "card fade-in";
      card.style.animationDelay = `${index * 0.08}s`;

      if (item.image) {
        const imageWrap = document.createElement("div");
        imageWrap.className = "card-image";
        const image = document.createElement("img");
        image.src = item.image;
        image.alt = item.alt || "";
        image.loading = "lazy";
        imageWrap.appendChild(image);
        card.appendChild(imageWrap);
      }

      const body = document.createElement("div");
      body.className = "card-body";

      const title = document.createElement("h3");
      title.textContent = item.title || "";

      const description = document.createElement("p");
      description.textContent = item.description || "";

      const link = document.createElement("a");
      link.className = "button button-secondary";
      link.href = item.link || "#";
      link.textContent = item.linkLabel || "Explore";
      if (isExternal(item.link)) {
        link.target = "_blank";
        link.rel = "noopener";
      }

      body.appendChild(title);
      body.appendChild(description);
      body.appendChild(link);
      card.appendChild(body);
      previewGrid.appendChild(card);
    });
  }
}

function renderReel(data) {
  setText("page-title", data.title);
  setText("page-intro", data.intro);

  const wrapper = document.querySelector(".video-wrapper");
  const iframe = document.getElementById("video-embed");
  const caption = data.video && data.video.caption;

  if (iframe && data.video && data.video.embedUrl) {
    iframe.src = data.video.embedUrl;
    iframe.title = data.video.title || data.title || "Video reel";
  } else if (wrapper) {
    wrapper.style.display = "none";
  }

  setText("video-caption", caption);
}

function renderListPage(indexData, items, page) {
  if (!indexData) return;
  setText("page-title", indexData.title);
  setText("page-intro", indexData.intro);

  const listGrid = document.getElementById("list-grid");
  if (!listGrid) return;

  const defaultLabels = {
    tv: "Watch segment",
    print: "Read story",
    radio: "Listen"
  };

  listGrid.innerHTML = "";

  if (!items || items.length === 0) {
    const empty = document.createElement("p");
    empty.className = "muted";
    empty.textContent = indexData.emptyMessage || "New entries coming soon.";
    listGrid.appendChild(empty);
    return;
  }

  items.forEach((item, index) => {
    const card = document.createElement("article");
    card.className = "card fade-in";
    card.style.animationDelay = `${index * 0.06}s`;

    if (item.thumbnail) {
      const imageWrap = document.createElement("div");
      imageWrap.className = "card-image";
      const image = document.createElement("img");
      image.src = item.thumbnail;
      image.alt = item.alt || "";
      image.loading = "lazy";
      imageWrap.appendChild(image);
      card.appendChild(imageWrap);
    }

    const body = document.createElement("div");
    body.className = "card-body";

    const meta = document.createElement("p");
    meta.className = "meta";
    meta.textContent = [item.outlet, item.date].filter(Boolean).join(" - ");

    const title = document.createElement("h3");
    title.textContent = item.title || item.headline || "Untitled";

    const blurb = document.createElement("p");
    blurb.textContent = item.blurb || "";

    body.appendChild(meta);
    body.appendChild(title);
    body.appendChild(blurb);

    if (item.embedUrl) {
      const embed = document.createElement("div");
      embed.className = "embed";
      const iframe = document.createElement("iframe");
      iframe.src = item.embedUrl;
      iframe.title = item.embedTitle || item.title || "Media embed";
      iframe.loading = "lazy";
      iframe.allow = "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
      embed.appendChild(iframe);
      body.appendChild(embed);
    }

    if (item.link) {
      const link = document.createElement("a");
      link.className = "button button-secondary";
      link.href = item.link;
      link.textContent = item.linkLabel || indexData.defaultLinkLabel || defaultLabels[page] || "Open";
      if (isExternal(item.link)) {
        link.target = "_blank";
        link.rel = "noopener";
      }
      body.appendChild(link);
    }

    card.appendChild(body);
    listGrid.appendChild(card);
  });
}

function renderPhotography(data) {
  setText("page-title", data.title);
  setText("page-intro", data.intro);

  const grid = document.getElementById("photo-grid");
  if (grid && Array.isArray(data.photos) && data.photos.length > 0) {
    renderPhotoGrid(grid, data.photos);
  } else if (grid) {
    grid.innerHTML = "";
  }
}

async function init() {
  const siteData = await loadJson("content/site.json");
  applyThemeColors(siteData);
  applyTypography(siteData);
  injectHeaderFooter(siteData);

  const page = document.body.dataset.page;
  if (!page) return;

  if (page === "home") {
    const pageData = await loadJson("content/home.json");
    if (pageData) {
      renderHome(pageData);
    }
    return;
  }

  if (page === "reel") {
    const pageData = await loadJson("content/reel.json");
    if (pageData) {
      renderReel(pageData);
    }
    return;
  }

  if (page === "tv" || page === "print" || page === "radio") {
    const collection = await loadCollection(`content/${page}/index.json`);
    if (collection) {
      renderListPage(collection.index, collection.items, page);
    }
    return;
  }

  if (page === "photography") {
    const pageData = await loadJson("content/photography.json");
    if (pageData) {
      renderPhotography(pageData);
    }
  }
}

document.addEventListener("DOMContentLoaded", init);
