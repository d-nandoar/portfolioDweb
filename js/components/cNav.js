/**
 * DWeb Solutions - Componente Core: cNav.js (v5.4)
 * Orquestador de interacción de la Barra de Navegación Flotante
 */
(function () {
  "use strict";

  // Guardamos los elementos visuales de la barra para poder cambiarlos o moverlos
  const headerPrincipal = document.getElementById("headerPrincipal");
  const btnServicios = document.getElementById("btnServicios");
  const submenuServicios = document.getElementById("submenuServicios");
  const btnTriggerMovil = document.getElementById("btnTriggerMovil");
  const navNavegacion = document.getElementById("navNavegacion");

  // Elemento de fondo oscuro para el menú móvil
  const overlayNav = document.getElementById("overlayNav");

  // La distancia en pixeles de scroll para activar el cambio visual de la barra
  const scrollThreshold = 50;

  // Mapa de teclas de navegación que producen scroll en la página trasera
  const keysToBlock = {
    Space: true,
    32: true,
    ArrowUp: true,
    38: true,
    ArrowDown: true,
    40: true,
    PageUp: true,
    33: true,
    PageDown: true,
    34: true,
    End: true,
    35: true,
    Home: true,
    36: true,
  };

  // Arranca el componente y empieza a escuchar lo que hace el usuario
  function navInit() {
    window.addEventListener("scroll", navHandleScroll, { passive: true });
    btnServicios.addEventListener("click", navToggleSubMenu);
    btnTriggerMovil.addEventListener("click", navToggleMenuMovil);
    document.addEventListener("click", navHandleOutsideAndLinks);
    navNavegacion.addEventListener("click", navHandleActiveStates);

    // Cerramos el menú completo si el usuario toca directamente el overlay oscuro
    if (overlayNav) {
      overlayNav.addEventListener("click", navCloseAllMenus);
    }

    navCheckSubmenuActiveState();
  }

  // Intercepta y neutraliza el evento físico de scroll por rueda de mouse o gestos táctiles
  function navPreventDefaultScroll(e) {
    e.preventDefault();
  }

  // Intercepta y neutraliza las pulsaciones de teclado que desplazan la página por detrás
  function navPreventKeyScroll(e) {
    if (keysToBlock[e.key] || keysToBlock[e.keyCode]) {
      e.preventDefault();
      return false;
    }
  }

  // Activa el bloqueo de eventos de scroll sin alterar clases en body o html
  function navLockScroll() {
    window.addEventListener("wheel", navPreventDefaultScroll, {
      passive: false,
    });
    window.addEventListener("touchmove", navPreventDefaultScroll, {
      passive: false,
    });
    window.addEventListener("keydown", navPreventKeyScroll, { passive: false });
  }

  // Remueve la neutralización de eventos para restaurar el comportamiento nativo
  function navUnlockScroll() {
    window.removeEventListener("wheel", navPreventDefaultScroll);
    window.removeEventListener("touchmove", navPreventDefaultScroll);
    window.removeEventListener("keydown", navPreventKeyScroll);
  }

  // Cambia el diseño del fondo de la barra cuando bajamos con el scroll
  function navHandleScroll() {
    if (window.scrollY > scrollThreshold) {
      headerPrincipal.classList.add("cNav__wrapper--scrolling");
    } else {
      headerPrincipal.classList.remove("cNav__wrapper--scrolling");
    }
  }

  // Decide si abre o cierra el submenú de servicios al hacer click
  function navToggleSubMenu(e) {
    e.stopPropagation();
    const isHidden = submenuServicios.classList.contains("uIsHidden");
    if (isHidden) {
      navOpenSubMenu();
    } else {
      navCloseSubMenu();
    }
  }

  // Muestra físicamente el submenú de servicios
  function navOpenSubMenu() {
    submenuServicios.classList.remove("uIsHidden");
    submenuServicios.classList.add("uIsVisible");
    btnServicios.setAttribute("aria-expanded", "true");
    submenuServicios.setAttribute("aria-hidden", "false");
  }

  // Oculta físicamente el submenú de servicios
  function navCloseSubMenu() {
    submenuServicios.classList.remove("uIsVisible");
    submenuServicios.classList.add("uIsHidden");
    btnServicios.setAttribute("aria-expanded", "false");
    submenuServicios.setAttribute("aria-hidden", "true");
  }

  // Abre o cierra el menú completo cuando estamos en pantallas de celular
  function navToggleMenuMovil(e) {
    e.stopPropagation();
    const isNavOpen = navNavegacion.classList.contains("cNav__menu--open");
    if (!isNavOpen) {
      navNavegacion.classList.add("cNav__menu--open");
      btnTriggerMovil.classList.add("cNav__trigger--active");

      // Activación del overlay visual y bloqueo de interacción trasera por eventos
      if (overlayNav) overlayNav.classList.add("cNav__overlay--visible");
      navLockScroll();
    } else {
      navCloseAllMenus();
    }
  }

  // Cierra el menú de celular y el submenú al mismo tiempo
  function navCloseAllMenus() {
    navNavegacion.classList.remove("cNav__menu--open");
    btnTriggerMovil.classList.remove("cNav__trigger--active");

    // Desactivación del overlay visual y liberación de los eventos de scroll
    if (overlayNav) overlayNav.classList.remove("cNav__overlay--visible");
    navUnlockScroll();

    navCloseSubMenu();
  }

  // Se encarga de marcar o "encender" visualmente el link que acabamos de cliquear
  function navHandleActiveStates(e) {
    const target = e.target;

    // Si cliqueamos una opción interna del submenú de servicios
    if (target.classList.contains("cNav__submenuLink")) {
      navNavegacion.querySelectorAll(".cNav__submenuLink").forEach((link) => {
        link.classList.remove("cNav__submenuLink--active");
      });
      navNavegacion.querySelectorAll(".cNav__menuLink").forEach((link) => {
        link.classList.remove("cNav__menuLink--active");
      });
      target.classList.add("cNav__submenuLink--active");
      navCheckSubmenuActiveState();
      return;
    }

    // Si cliqueamos un botón principal del menú (como Inicio, Proyectos, etc.)
    if (
      target.classList.contains("cNav__menuLink") &&
      target !== btnServicios
    ) {
      navNavegacion.querySelectorAll(".cNav__menuLink").forEach((link) => {
        link.classList.remove("cNav__menuLink--active");
      });
      navNavegacion.querySelectorAll(".cNav__submenuLink").forEach((link) => {
        link.classList.remove("cNav__submenuLink--active");
      });
      target.classList.add("cNav__menuLink--active");
      navCheckSubmenuActiveState();
    }
  }

  // Deja encendido el botón principal de "Servicios" si hay algo seleccionado adentro
  function navCheckSubmenuActiveState() {
    const activeSublink = submenuServicios.querySelector(
      ".cNav__submenuLink--active",
    );
    if (activeSublink) {
      btnServicios.classList.add("cNav__menuLink--activeParent");
    } else {
      btnServicios.classList.remove("cNav__menuLink--activeParent");
    }
  }

  // Cierra los menús abiertos si hacemos click afuera de la barra o en los enlaces
  function navHandleOutsideAndLinks(e) {
    const target = e.target;

    // Si hacemos click en cualquier enlace o link de la página
    if (target.tagName === "A" || target.closest("a")) {
      // Si el link es una opción de los servicios, cierra todo
      if (target.classList.contains("cNav__submenuLink")) {
        navCloseAllMenus();
      }

      // Si el link es del menú principal y no es el botón desplegable, cierra todo
      if (
        !target.classList.contains("cNav__submenuLink") &&
        !target.closest("#btnServicios")
      ) {
        navCloseAllMenus();
      }
      return;
    }

    // Si hacemos click fuera del botón de servicios y de su contenido, esconde el submenú
    if (
      !target.closest("#btnServicios") &&
      !target.closest("#submenuServicios")
    ) {
      navCloseSubMenu();
    }

    // Si hacemos click completamente afuera de toda la barra de navegación, cierra todo
    if (!target.closest("#headerPrincipal")) {
      navCloseAllMenus();
    }
  }

  // Ejecuta la inicialización cuando el navegador termina de procesar el HTML
  document.addEventListener("DOMContentLoaded", navInit);
})();
