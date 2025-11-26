document.addEventListener("DOMContentLoaded", () => {

    // ============================================================
    // NAVBAR, MENÚ MOBILE, SCROLL, HIGHLIGHT
    // ============================================================

    const header = document.querySelector(".top-nav");
    const toggle = document.querySelector(".nav-toggle");
    const navLinks = document.querySelector(".nav-links");
    const links = document.querySelectorAll(".nav-link");

    // ----- Menú mobile -----
    if (toggle) {
        toggle.addEventListener("click", () => {
            const isOpen = navLinks.classList.toggle("is-open");
            toggle.classList.toggle("is-open", isOpen);
            toggle.setAttribute("aria-expanded", String(isOpen));
        });
    }

    // ----- Reducir nav al hacer scroll -----
    window.addEventListener("scroll", () => {
        if (window.scrollY > 10) {
            header.classList.add("is-scrolled");
        } else {
            header.classList.remove("is-scrolled");
        }
    });

    // ----- Navegación con scroll suave + animación de sección -----
    links.forEach(link => {
        link.addEventListener("click", (event) => {
            const href = link.getAttribute("href");

            if (href && href.startsWith("#")) {
                event.preventDefault();
                const target = document.querySelector(href);

                if (target) {
                    // activar link
                    links.forEach(l => l.classList.remove("is-active"));
                    link.classList.add("is-active");

                    // cerrar menú mobile
                    navLinks.classList.remove("is-open");
                    toggle?.classList.remove("is-open");
                    toggle?.setAttribute("aria-expanded", "false");

                    // scroll suave
                    target.scrollIntoView({ behavior: "smooth", block: "start" });

                    // animación de highlight
                    target.classList.remove("section-hit");
                    void target.offsetWidth;
                    target.classList.add("section-hit");
                }
            }
        });
    });

    // ============================================================
    //      SPOTIFY OEMBED → cargar portadas automáticamente
    // ============================================================

    function loadSpotifyCovers() {
        const items = document.querySelectorAll(".mc-item");

        items.forEach(item => {
            const url = item.dataset.spotify;
            const img = item.querySelector("img");

            if (!url || !img) return;

            fetch("https://open.spotify.com/oembed?url=" + encodeURIComponent(url))
                .then(res => res.json())
                .then(data => {
                    img.src = data.thumbnail_url;
                    img.alt = data.title || "Portada Spotify";
                    item.dataset.title = data.title || "";
                    item.dataset.artist = data.author_name || "";
                })
                .catch(err => {
                    console.error("Error cargando portada de Spotify:", err);
                });
        });
    }

    // ============================================================
    //      CARRUSEL DDR-STYLE INFINITO
    // ============================================================

    const musicItems = document.querySelectorAll(".mc-item");
    const leftBtn = document.querySelector(".mc-arrow.left");
    const rightBtn = document.querySelector(".mc-arrow.right");

    if (musicItems.length > 0 && leftBtn && rightBtn) {

        loadSpotifyCovers();  // <-- carga de portadas desde Spotify

        let currentIndex = 0; // elemento central

        function updateCarousel() {
            const len = musicItems.length;

            musicItems.forEach((item, idx) => {
                item.classList.remove("pos-left", "pos-center", "pos-right", "pos-off");

                // centro
                if (idx === currentIndex) {
                    item.classList.add("pos-center");

                    // click abre Spotify
                    item.onclick = () => {
                        const url = item.dataset.spotify;
                        if (url) window.open(url, "_blank");
                    };

                // izquierda
                } else if (idx === (currentIndex - 1 + len) % len) {
                    item.classList.add("pos-left");
                    item.onclick = null;

                // derecha
                } else if (idx === (currentIndex + 1) % len) {
                    item.classList.add("pos-right");
                    item.onclick = null;

                // off
                } else {
                    item.classList.add("pos-off");
                    item.onclick = null;
                }
            });
        }

        // inicial
        updateCarousel();

        // flecha izquierda
        leftBtn.addEventListener("click", () => {
            const len = musicItems.length;
            currentIndex = (currentIndex - 1 + len) % len;
            updateCarousel();
        });

        // flecha derecha
        rightBtn.addEventListener("click", () => {
            const len = musicItems.length;
            currentIndex = (currentIndex + 1) % len;
            updateCarousel();
        });
    }

});
