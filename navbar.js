document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector(".top-nav");
    const toggle = document.querySelector(".nav-toggle");
    const navLinks = document.querySelector(".nav-links");
    const links = document.querySelectorAll(".nav-link");

    // Menú mobile
    if (toggle) {
        toggle.addEventListener("click", () => {
            const isOpen = navLinks.classList.toggle("is-open");
            toggle.classList.toggle("is-open", isOpen);
            toggle.setAttribute("aria-expanded", String(isOpen));
        });
    }

    // Reducir header al hacer scroll
    window.addEventListener("scroll", () => {
        if (window.scrollY > 10) {
            header.classList.add("is-scrolled");
        } else {
            header.classList.remove("is-scrolled");
        }
    });

    // Marcar link activo (clic)
    links.forEach(link => {
        link.addEventListener("click", () => {
            links.forEach(l => l.classList.remove("is-active"));
            link.classList.add("is-active");
        });
    });
});
