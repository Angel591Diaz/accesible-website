document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  // Botones
  const btnAumentar = document.getElementById("btn-aumentar");
  const btnDisminuir = document.getElementById("btn-disminuir");
  const btnModoOscuro = document.getElementById("btn-modo-oscuro");
  const btnAltoContraste = document.getElementById("btn-alto-contraste");
  const btnSinImagenes = document.getElementById("btn-sin-imagenes");
  const btnSinLinks = document.getElementById("btn-sin-links");
  const btnLectura = document.getElementById("btn-lectura");
  const selectDaltonismo = document.getElementById("select-daltonismo");
  const btnReiniciar = document.getElementById("btn-reiniciar");

  // Valores para fuente
  let scaleFactor = 1;
  const maxScale = 3;
  const minScale = 0.3;

  // Textos alternativos para botones toggle
  const textosToggle = {
    modoOscuro: ["🌙 Modo oscuro", "🌞 Modo claro"],
    altoContraste: ["🌓 Alto contraste", "🌓 Contraste normal"],
    sinImagenes: ["🚫 Quitar imágenes", "🖼️ Mostrar imágenes"],
    sinLinks: ["🚫 Quitar links", "🔗 Mostrar links"],
  };

  // Función para actualizar texto de botón toggle
  function actualizarTextoToggle(boton, estadoActivo, textos) {
    boton.textContent = estadoActivo ? textos[1] : textos[0];
  }

  // Aplicar la escala de fuente
  function aplicarEscala(factor) {
    body.style.fontSize = factor + "em";
  }

  // Guardar estado en localStorage
  function guardarEstado() {
    const estado = {
      scaleFactor,
      modoOscuro: body.classList.contains("dark-mode"),
      altoContraste: body.classList.contains("high-contrast"),
      sinImagenes: body.classList.contains("no-images"),
      sinLinks: body.classList.contains("no-links"),
      daltonismo: selectDaltonismo.value,
      lecturaActivo: btnLectura.classList.contains("activo"),
    };
    localStorage.setItem("accesibilidad", JSON.stringify(estado));
  }

  // Cargar estado desde localStorage
  function cargarEstado() {
    const estado = JSON.parse(localStorage.getItem("accesibilidad"));
    if (!estado) {
      // Por defecto, btnLectura activo (background color activado)
      btnLectura.classList.add("activo");
      // Texto por defecto de toggles
      actualizarTextoToggle(btnModoOscuro, false, textosToggle.modoOscuro);
      actualizarTextoToggle(btnAltoContraste, false, textosToggle.altoContraste);
      actualizarTextoToggle(btnSinImagenes, false, textosToggle.sinImagenes);
      actualizarTextoToggle(btnSinLinks, false, textosToggle.sinLinks);
      return;
    }

    if (estado.scaleFactor && estado.scaleFactor >= minScale && estado.scaleFactor <= maxScale) {
      scaleFactor = estado.scaleFactor;
      aplicarEscala(scaleFactor);
    }

    if (estado.modoOscuro) body.classList.add("dark-mode");
    if (estado.altoContraste) body.classList.add("high-contrast");
    if (estado.sinImagenes) body.classList.add("no-images");
    if (estado.sinLinks) body.classList.add("no-links");

    if (estado.daltonismo && estado.daltonismo !== "ninguno") {
      selectDaltonismo.value = estado.daltonismo;
      aplicarFiltroDaltonismo(estado.daltonismo);
    } else {
      selectDaltonismo.value = "ninguno";
      aplicarFiltroDaltonismo("ninguno");
    }

    // Estado lectura
    if (estado.lecturaActivo) {
      btnLectura.classList.add("activo");
    } else {
      btnLectura.classList.remove("activo");
    }

    // Actualizar textos toggle según estado
    actualizarTextoToggle(btnModoOscuro, estado.modoOscuro, textosToggle.modoOscuro);
    actualizarTextoToggle(btnAltoContraste, estado.altoContraste, textosToggle.altoContraste);
    actualizarTextoToggle(btnSinImagenes, estado.sinImagenes, textosToggle.sinImagenes);
    actualizarTextoToggle(btnSinLinks, estado.sinLinks, textosToggle.sinLinks);
  }

  // Aplica clase filtro daltonismo según opción
  function aplicarFiltroDaltonismo(tipo) {
    body.classList.remove("daltonismo-protanopia", "daltonismo-deuteranopia", "daltonismo-tritanopia");
    if (tipo !== "ninguno") {
      body.classList.add("daltonismo-" + tipo);
    }
  }

  // Listeners para botones normales
  btnAumentar.addEventListener("click", () => {
    if (scaleFactor < maxScale) {
      scaleFactor += 0.3;
      aplicarEscala(scaleFactor);
      guardarEstado();
    }
  });

  btnDisminuir.addEventListener("click", () => {
    if (scaleFactor > minScale) {
      scaleFactor -= 0.3;
      aplicarEscala(scaleFactor);
      guardarEstado();
    }
  });

  btnModoOscuro.addEventListener("click", () => {
    const activo = body.classList.toggle("dark-mode");
    actualizarTextoToggle(btnModoOscuro, activo, textosToggle.modoOscuro);
    guardarEstado();
  });

  btnAltoContraste.addEventListener("click", () => {
    const activo = body.classList.toggle("high-contrast");
    actualizarTextoToggle(btnAltoContraste, activo, textosToggle.altoContraste);
    guardarEstado();
  });

  btnSinImagenes.addEventListener("click", () => {
    const activo = body.classList.toggle("no-images");
    actualizarTextoToggle(btnSinImagenes, activo, textosToggle.sinImagenes);
    guardarEstado();
  });

  btnSinLinks.addEventListener("click", () => {
    const activo = body.classList.toggle("no-links");
    actualizarTextoToggle(btnSinLinks, activo, textosToggle.sinLinks);
    guardarEstado();
  });

  selectDaltonismo.addEventListener("change", (e) => {
    aplicarFiltroDaltonismo(e.target.value);
    guardarEstado();
  });

  btnReiniciar.addEventListener("click", () => {
    scaleFactor = 1;
    aplicarEscala(scaleFactor);

    body.classList.remove("dark-mode", "high-contrast", "no-images", "no-links",
      "daltonismo-protanopia", "daltonismo-deuteranopia", "daltonismo-tritanopia");

    selectDaltonismo.value = "ninguno";

    btnLectura.classList.add("activo"); // Por defecto activo al reiniciar
    actualizarTextoToggle(btnModoOscuro, false, textosToggle.modoOscuro);
    actualizarTextoToggle(btnAltoContraste, false, textosToggle.altoContraste);
    actualizarTextoToggle(btnSinImagenes, false, textosToggle.sinImagenes);
    actualizarTextoToggle(btnSinLinks, false, textosToggle.sinLinks);

    guardarEstado();
  });

  // Listener para botón lectura con toggle color de fondo y texto
  btnLectura.addEventListener("click", () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      btnLectura.classList.add("activo");  // audio detenido, fondo activo
      btnLectura.textContent = "🔊 Leer";
    } else {
      leerPagina();
      btnLectura.classList.remove("activo"); // audio activo, fondo desactivado
      btnLectura.textContent = "⏹️ Detener";
    }
    guardarEstado();
  });

  // Cargar estado guardado o default
  cargarEstado();
});

// Función para leer el contenido principal
function leerPagina() {
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
    return;
  }

  const main = document.querySelector("main");
  const header = document.querySelector("header");
  if (!main || !header) return;

  const titulo = header.querySelector("h1")?.innerText || "";
  const textoMain = main.innerText || "";
  const imgs = main.querySelectorAll("img[alt]");
  let textoImgs = "";
  imgs.forEach((img, i) => {
    if (img.alt.trim() !== "") {
      textoImgs += ` Imagen ${i + 1}: ${img.alt}. `;
    }
  });

  const textoCompleto = `${titulo}. ${textoMain}. ${textoImgs}`;
  if (!textoCompleto.trim()) return;

  const utterance = new SpeechSynthesisUtterance(textoCompleto);
  utterance.lang = "es-ES";
  utterance.rate = 1;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}
