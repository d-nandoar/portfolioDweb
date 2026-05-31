/**
 * DWeb Solutions - Core Engine
 * Architecture v5.4 (Solo Developer Stack)
 */

// 1. CONFIGURACIÓN DEL SISTEMA Y CONTROL DE NAVEGADOR
// Desactivamos de forma nativa la restauración automática de scroll de los navegadores modernos.
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

// 2. MATRIZ DE VISIBILIDAD DE VISTAS (SPA MAP)
const viewMap = {
  inicio: ["inicio", "soluciones", "proyectos", "footer"],
  nosotros: ["nosotros", "footer"],
  contacto: ["contacto", "footer"],
  soluciones: ["soluciones", "footer"],
  proyectos: ["proyectos", "footer"],
};

// 3. CORE LOGIC / ENRUTADOR PRINCIPAL
/**
 * Renderiza de forma exclusiva las secciones activas según el hash de la URL
 */
function router() {
  const currentHash = window.location.hash.replace("#", "") || "inicio";
  const components = document.querySelectorAll("main > section, footer");
  const activeComponents = viewMap[currentHash] || viewMap["inicio"];

  // Discriminación y control de estado ARIA nativo
  components.forEach((component) => {
    if (activeComponents.includes(component.id)) {
      component.classList.remove("uIsCollapsed");
      component.setAttribute("aria-hidden", "false");
    } else {
      component.classList.add("uIsCollapsed");
      component.setAttribute("aria-hidden", "true");
    }
  });

  // Manejo centralizado y único del posicionamiento (Scroll)
  // Si la vista activa es "inicio", dejamos que el flujo mantenga su posición o use scroll natural.
  if (currentHash === "inicio") {
    // Si vienes de otra sección al inicio, resetea arriba de forma inmediata
    window.scrollTo(0, 0);
  } else {
    // Para cualquier vista SPA interna (soluciones, proyectos, contacto, nosotros),
    // como las secciones anteriores se colapsan, la sección activa se vuelve el nuevo "techo" de la web.
    // Usamos un retraso milimétrico controlado para que el scroll ocurra suavemente tras el reajuste del DOM.
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 15);
  }
}

// 4. SUSCRIPCIÓN DE EVENTOS GLOBALES (CICLO DE VIDA)
// Reacciona de forma inmediata en cuanto el DOM está listo, ideal para F5
window.addEventListener("DOMContentLoaded", router);

// Reacciona a cada clic que cambie el Hash en el cNav
window.addEventListener("hashchange", router);
