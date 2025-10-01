(function () {
  "use strict";

  /** Aplicar la clase .scrolled al cuerpo a medida que la página se desplaza hacia abajo */
  function toggleScrolled() {
    const selectBody = document.querySelector("body");
    const selectHeader = document.querySelector("#header");
    if (
      !selectHeader.classList.contains("scroll-up-sticky") &&
      !selectHeader.classList.contains("sticky-top") &&
      !selectHeader.classList.contains("fixed-top")
    )
      return;

    if (window.scrollY > 100) {
      selectBody.classList.add("scrolled");
      if (logo) logo.src = "../recursos/img/logo/Logo_white_nv.png"; // ←logo blanco
    } else {
      selectBody.classList.remove("scrolled");
      if (logo) logo.src = "../recursos/img/logo/Logo_AHRVP.png"; // ← logo original
    }

    /*  window.scrollY > 100
      ? selectBody.classList.add("scrolled")
      : selectBody.classList.remove("scrolled"); */
  }
  document.addEventListener("scroll", toggleScrolled);
  window.addEventListener("load", toggleScrolled);

  /*** Alternar navegación móvil*/
  const mobileNavToggleBtn = document.querySelector(".mobile-nav-toggle");
  function mobileNavToogle() {
    document.querySelector("body").classList.toggle("mobile-nav-active");
    mobileNavToggleBtn.classList.toggle("bi-list");
    mobileNavToggleBtn.classList.toggle("bi-x");
  }
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener("click", mobileNavToogle);
  }

  /*** Ocultar la navegación móvil en enlaces de la misma página/hash*/
  document.querySelectorAll("#navmenu a").forEach((navmenu) => {
    navmenu.addEventListener("click", () => {
      if (document.querySelector(".mobile-nav-active")) {
        mobileNavToogle();
      }
    });
  });

  /*** Activar y desactivar los menús desplegables de navegación móvil */
  document.querySelectorAll(".navmenu .toggle-dropdown").forEach((navmenu) => {
    navmenu.addEventListener("click", function (e) {
      e.preventDefault();
      this.parentNode.classList.toggle("active");
      this.parentNode.nextElementSibling.classList.toggle("dropdown-active");
      e.stopImmediatePropagation();
    });
  });

  /*** Cargando */
  const preloader = document.querySelector("#preloader");
  if (preloader) {
    window.addEventListener("load", () => {
      preloader.remove();
    });
  }

  /*** Botón de desplazamiento hacia arriba*/
  let scrollTop = document.querySelector(".scroll-top");

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100
        ? scrollTop.classList.add("active")
        : scrollTop.classList.remove("active");
    }
  }
  scrollTop.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  window.addEventListener("load", toggleScrollTop);
  document.addEventListener("scroll", toggleScrollTop);

  /*** Instancia de Animación con librería AOS  */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: "ease-in-out",
      once: false,
      mirror: false,
    });
  }
  window.addEventListener("load", aosInit);

  /*** Instancia de glightbox (para videos) */
  const glightbox = GLightbox({
    selector: ".glightbox",
    touchNavigation: false,
    loop: false,
    autoplayVideos: true,
  });

  /*** Preguntas frecuentes (Acordeón) */
  const preguntas_all = document.querySelectorAll(
    ".faq-item h3, .faq-item .faq-toggle"
  );

  if (preguntas_all) {
    preguntas_all.forEach((preguntas) => {
      preguntas.addEventListener("click", (e) => togglePreguntas(e));
    });
  }
  const togglePreguntas = (e) => {
    let elem_selecto = e.currentTarget;
    var cont_selecto = elem_selecto.parentNode.parentNode;
    if (!cont_selecto.classList.contains("dinamica")) {
      elem_selecto.parentNode.classList.toggle("faq-active");
    } else {
      const items = cont_selecto.querySelectorAll(".faq-item");
      items.forEach((item) => {
        if (
          item.classList.contains("faq-active") &&
          item.classList != elem_selecto.parentNode.classList
        ) {
          item.classList.remove("faq-active");
        }
      });
      elem_selecto.parentNode.classList.toggle("faq-active");
    }
  };

  /*** Pestañas */
  document.querySelectorAll(".item_vertical a").forEach((faqItem) => {
    faqItem.addEventListener("click", () => {
      const elementoInicial = document.getElementById("miembros");
      const posicionGuardada = elementoInicial.scrollTop;
      elementoInicial.scrollTop = posicionGuardada;
      elementoInicial.scrollIntoView({ behavior: "instant" });

      // Si contiene la clase swiperInTab se debe inicializar al aparecer el tab
      if (faqItem.classList.contains("swiperInTab")) {
        new Swiper(document.querySelector("#testim_2"), conf_swiper);
      }
      AOS.refresh();
    });
  });

  /*** Instancia para carruseles */
  let conf_swiper = {
    loop: "true",
    speed: "600",
    observer: true,
    observeParents: true,
    autoplay: {
      delay: "500000",
    },
    slidesPerView: "auto",
    pagination: {
      el: ".swiper-pagination",
      type: "bullets",
      clickable: "true",
    },
    breakpoints: {
      320: {
        slidesPerView: "1",
        spaceBetween: "40",
      },
      1200: {
        slidesPerView: "3",
        spaceBetween: "10",
      },
    },
  };
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function (swiperElement) {
      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, conf_swiper);
      } else if (!swiperElement.classList.contains("swiperInTab")) {
        new Swiper(swiperElement, conf_swiper);
      }
      // Si contiene la clase swiperInTab se debe inicializar al aparecer el tab
    });
  }
  window.addEventListener("load", initSwiper);

  /*** Posición de desplazamiento correcta al cargar la página para URL que contienen enlaces hash. */
  window.addEventListener("load", function (e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: "smooth",
          });
        }, 100);
      }
    }
  });

  /*** Menú de navegación Scrollspy*/
  let navmenulinks = document.querySelectorAll(".navmenu a");
  function navmenuScrollspy() {
    navmenulinks.forEach((navmenulink) => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (
        position >= section.offsetTop &&
        position <= section.offsetTop + section.offsetHeight
      ) {
        document
          .querySelectorAll(".navmenu a.active")
          .forEach((link) => link.classList.remove("active"));
        navmenulink.classList.add("active");
      } else {
        navmenulink.classList.remove("active");
      }
    });
  }
  window.addEventListener("load", navmenuScrollspy);
  document.addEventListener("scroll", navmenuScrollspy);

  /*** Buscador*/
  let busqueda = document.querySelector("#btnBuscar");
  busqueda.addEventListener("click", (e) => {
    document.querySelector("#resultados_busqueda").classList.toggle("d-none");
  });

  /*** Modal para integrantes*/
  fetch("/recursos/json/integrantes.json")
    .then((response) => response.json())
    .then((data) => {
      window.integrantesInfo = data;
    });

  window.mostrarModalPorId = function (id) {
    const persona = window.integrantesInfo.find((p) => p.id === id);
    if (!persona) return;

    document.getElementById("modalNombre").textContent = persona.nombre;
    document.getElementById("modalCargo").textContent = persona.cargo;
    document.getElementById("modalFoto").src = persona.foto;
    document.getElementById("modalDescripcion").innerHTML = persona.descripcion;

    const modal = new bootstrap.Modal(document.getElementById("infoModal"));
    modal.show();
  };

  /*** Audio*/

  /*** Muestra el tamaño del navegador */
  // // Obtener el elemento label para la resolución de pantalla
  // const screenSizeLabel = document.getElementById("screen-size");
  // // Obtener el elemento label para el tamaño de la ventana
  // const windowSizeLabel = document.getElementById("window-size");

  // // Mostrar la resolución de pantalla
  // screenSizeLabel.textContent = `Ancho: ${window.screen.width}px, Alto: ${window.screen.height}px`;

  // // Mostrar el tamaño de la ventana del navegador
  // windowSizeLabel.textContent = `Ancho: ${window.innerWidth}px, Alto: ${window.innerHeight}px`;

  // // También puedes escuchar el evento de redimensionamiento de la ventana
  // window.addEventListener("resize", () => {
  //   screenSizeLabel.textContent = `Ancho: ${window.screen.width}px, Alto: ${window.screen.height}px`;
  //   windowSizeLabel.textContent = `Ancho: ${window.innerWidth}px, Alto: ${window.innerHeight}px`;
  // });
})();
