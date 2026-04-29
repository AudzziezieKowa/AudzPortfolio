72% of storage used … If you run out, you can't create, edit, and upload files. Get 30 GB for ₱10 for 3 months ₱49.
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
    ".reveal, .edu-block, .skills li, .gallery-category, .gallery-row img, .gallery-row video"
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

      if (slider.setPointerCapture) {
        slider.setPointerCapture(event.pointerId);
      }

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
        }, 150);
      }
    });

    slider.addEventListener("pointermove", function (event) {
      if (!isDown) return;

      event.preventDefault();

      const x = event.pageX - slider.offsetLeft;
      const distance = x - startX;

      if (Math.abs(distance) > 6) {
        moved = true;
      }

      slider.scrollLeft = scrollLeft - distance * 1.8;
    });
  });


  /* ===========================
     GALLERY POP-UP / LIGHTBOX
  =========================== */

  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxVideo = document.getElementById("lightbox-video");

  function galleryWasDragged(element) {
    const row = element.closest(".gallery-row");
    return row && row.classList.contains("was-dragging");
  }

  function closeLightbox() {
    if (!lightbox || !lightboxImg || !lightboxVideo) return;

    lightbox.classList.remove("active");

    lightboxVideo.pause();
    lightboxVideo.removeAttribute("src");
    lightboxVideo.load();

    lightboxImg.removeAttribute("src");

    lightboxImg.style.display = "none";
    lightboxVideo.style.display = "none";

    document.body.style.overflow = "";
  }

  window.closeLightbox = closeLightbox;

  if (lightbox && lightboxImg && lightboxVideo) {

    lightboxImg.style.display = "none";
    lightboxVideo.style.display = "none";

    /* IMAGE POP-UP */
    document.querySelectorAll(".gallery-row img").forEach(function (img) {
      img.addEventListener("click", function () {
        if (galleryWasDragged(img)) return;

        lightbox.classList.add("active");

        lightboxVideo.pause();
        lightboxVideo.removeAttribute("src");
        lightboxVideo.load();
        lightboxVideo.style.display = "none";

        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || "Expanded gallery image";
        lightboxImg.style.display = "block";

        document.body.style.overflow = "hidden";
      });
    });


    /* VIDEO HOVER PREVIEW */
    document.querySelectorAll(".gallery-row video").forEach(function (video) {

      video.addEventListener("mouseenter", function () {
        video.muted = true;
        video.play().catch(function () {});
      });

      video.addEventListener("mouseleave", function () {
        video.pause();
        video.currentTime = 0;
      });


      /* VIDEO POP-UP WITH SOUND */
      video.addEventListener("click", function () {
        if (galleryWasDragged(video)) return;

        lightbox.classList.add("active");

        video.pause();

        lightboxImg.removeAttribute("src");
        lightboxImg.style.display = "none";

        lightboxVideo.src = video.currentSrc || video.src;
        lightboxVideo.style.display = "block";
        lightboxVideo.controls = true;
        lightboxVideo.muted = false;
        lightboxVideo.volume = 1;
        lightboxVideo.currentTime = 0;

        document.body.style.overflow = "hidden";

        lightboxVideo.play().catch(function () {
          /*
            Some browsers block autoplay with sound.
            If that happens, the video controls are visible,
            so the viewer can press play manually.
          */
        });
      });
    });


    /* CLICK OUTSIDE TO CLOSE */
    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });


    /* ESC KEY TO CLOSE */
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && lightbox.classList.contains("active")) {
        closeLightbox();
      }
    });
  }

});
