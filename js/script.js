document.addEventListener("DOMContentLoaded", function () {

  /* ===========================
     PAGE TRANSITION
  =========================== */

  const transitionScreen = document.createElement("div");
  transitionScreen.className = "transition-screen";
  document.body.appendChild(transitionScreen);

  document.querySelectorAll("a[href]").forEach(function (link) {
    const href = link.getAttribute("href");

    if (!href) return;

    const isExternal = link.target === "_blank";
    const isAnchor = href.startsWith("#");
    const isMail = href.startsWith("mailto:");
    const isPhone = href.startsWith("tel:");
    const isHtmlPage = href.endsWith(".html");

    if (isExternal || isAnchor || isMail || isPhone || !isHtmlPage) return;

    link.addEventListener("click", function (event) {
      event.preventDefault();

      const target = link.href;

      transitionScreen.classList.add("active");

      setTimeout(function () {
        window.location.href = target;
      }, 550);
    });
  });


  /* ===========================
     ACTIVE NAV LINK
  =========================== */

  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  document.querySelectorAll(".nav-links a").forEach(function (link) {
    const linkPage = link.getAttribute("href");

    if (linkPage === currentPage) {
      link.classList.add("active");
    }
  });


  /* ===========================
     MOBILE NAVIGATION
  =========================== */

  const menuToggle = document.querySelector(".menu-toggle");
  const navBar = document.querySelector(".nav-bar");

  if (menuToggle && navBar) {
    menuToggle.addEventListener("click", function () {
      navBar.classList.toggle("open");

      const icon = menuToggle.querySelector("i");

      if (!icon) return;

      if (navBar.classList.contains("open")) {
        icon.classList.remove("fa-bars");
        icon.classList.add("fa-xmark");
      } else {
        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");
      }
    });
  }


  /* ===========================
     SCROLL PROGRESS BAR
  =========================== */

  const progressBar = document.createElement("div");
  progressBar.className = "scroll-progress";
  document.body.appendChild(progressBar);

  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = documentHeight > 0 ? (scrollTop / documentHeight) * 100 : 0;

    progressBar.style.width = progress + "%";
  }

  window.addEventListener("scroll", updateScrollProgress);
  updateScrollProgress();


  /* ===========================
     CURSOR GLOW
  =========================== */

  const canHover = window.matchMedia("(hover: hover)").matches;

  if (canHover) {
    const cursorGlow = document.createElement("div");
    cursorGlow.className = "cursor-glow";
    document.body.appendChild(cursorGlow);

    window.addEventListener("pointermove", function (event) {
      cursorGlow.style.opacity = "1";
      cursorGlow.style.left = event.clientX + "px";
      cursorGlow.style.top = event.clientY + "px";
    });

    window.addEventListener("pointerleave", function () {
      cursorGlow.style.opacity = "0";
    });
  }


  /* ===========================
     SCROLL REVEAL ANIMATION
  =========================== */

  const revealElements = document.querySelectorAll(
    ".reveal, .edu-block, .skills li, .gallery-category, .gallery-row img, .youtube-card"
  );

  revealElements.forEach(function (element, index) {
    element.classList.add("reveal-item");

    const delay = Math.min((index % 8) * 70, 420);
    element.style.setProperty("--delay", delay + "ms");
  });

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.14
    });

    revealElements.forEach(function (element) {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach(function (element) {
      element.classList.add("show");
    });
  }


  /* ===========================
     DRAG TO SCROLL GALLERY
  =========================== */

  const sliders = document.querySelectorAll(".gallery-row");

  sliders.forEach(function (slider) {
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;
    let moved = false;

    slider.addEventListener("pointerdown", function (event) {
      isDown = true;
      moved = false;

      slider.classList.add("drag-active");

      startX = event.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener("pointerleave", function () {
      isDown = false;
      slider.classList.remove("drag-active");
    });

    slider.addEventListener("pointerup", function () {
      isDown = false;
      slider.classList.remove("drag-active");

      if (moved) {
        slider.classList.add("was-dragging");

        setTimeout(function () {
          slider.classList.remove("was-dragging");
        }, 180);
      }
    });

    slider.addEventListener("pointermove", function (event) {
      if (!isDown) return;

      const x = event.pageX - slider.offsetLeft;
      const distance = x - startX;

      if (Math.abs(distance) > 8) {
        moved = true;
        event.preventDefault();
        slider.scrollLeft = scrollLeft - distance * 1.8;
      }
    });
  });


  /* ===========================
     SCREEN-FIXED IMAGE LIGHTBOX
  =========================== */

  const screenLightbox = document.createElement("div");
  screenLightbox.className = "screen-lightbox";
  screenLightbox.innerHTML = `
    <div class="screen-lightbox-box">
      <button class="screen-lightbox-close" type="button" aria-label="Close image">
        <i class="fa-solid fa-xmark"></i>
      </button>
      <img class="screen-lightbox-img" src="" alt="Expanded gallery image">
    </div>
  `;

  document.body.appendChild(screenLightbox);

  const screenLightboxImg = screenLightbox.querySelector(".screen-lightbox-img");
  const screenLightboxClose = screenLightbox.querySelector(".screen-lightbox-close");

  function galleryWasDragged(element) {
    const row = element.closest(".gallery-row");
    return row && row.classList.contains("was-dragging");
  }

  function openScreenLightbox(imageSource, imageAlt) {
    if (!imageSource) return;

    screenLightboxImg.setAttribute("src", imageSource);
    screenLightboxImg.setAttribute("alt", imageAlt || "Expanded gallery image");

    screenLightbox.classList.add("active");

    document.documentElement.classList.add("no-scroll");
    document.body.classList.add("no-scroll");
  }

  function closeScreenLightbox() {
    screenLightbox.classList.remove("active");
    screenLightboxImg.setAttribute("src", "");

    document.documentElement.classList.remove("no-scroll");
    document.body.classList.remove("no-scroll");
  }

  window.closeLightbox = closeScreenLightbox;

  document.querySelectorAll(".gallery-row img").forEach(function (img) {
    if (img.closest(".youtube-card")) return;

    img.addEventListener("click", function () {
      if (galleryWasDragged(img)) return;

      openScreenLightbox(
        img.getAttribute("src"),
        img.getAttribute("alt")
      );
    });
  });

  screenLightboxClose.addEventListener("click", closeScreenLightbox);

  screenLightbox.addEventListener("click", function (event) {
    if (event.target === screenLightbox) {
      closeScreenLightbox();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && screenLightbox.classList.contains("active")) {
      closeScreenLightbox();
    }
  });


  /* ===========================
     YOUTUBE ANIMATION LINKS
  =========================== */

  document.querySelectorAll(".youtube-card").forEach(function (card) {
    card.addEventListener("click", function (event) {
      const row = card.closest(".gallery-row");

      if (row && row.classList.contains("was-dragging")) {
        event.preventDefault();
        return;
      }

      event.stopPropagation();

      const youtubeLink = card.getAttribute("href");

      if (youtubeLink) {
        window.open(youtubeLink, "_blank");
      }
    });
  });

});
