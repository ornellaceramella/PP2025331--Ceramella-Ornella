import { Serie } from './serie.js';

let paginaActual = 1;
const seriesContainer = document.getElementById("series");
const btnSiguiente = document.getElementById("siguiente");
const btnAnterior = document.getElementById("anterior");

if (seriesContainer) {
  if (btnSiguiente) btnSiguiente.addEventListener("click", paginaSiguiente);
  if (btnAnterior) btnAnterior.addEventListener("click", paginaAnterior);

  if (window.location.pathname.includes("guardados.html")) {
    mostrarGuardadas();
  } else {
    window.addEventListener("DOMContentLoaded", cargarSeries);
  }
}

function cargarSeries() {
  seriesContainer.innerHTML = "";
  const promises = [];
  const desde = (paginaActual - 1) * 6 + 1;
  for (let i = desde; i < desde + 6; i++) {
    promises.push(fetch(`https://api.tvmaze.com/shows/${i}`).then(res => res.json()));
  }

  Promise.all(promises).then(seriesData => {
    seriesData.forEach(data => {
      const serie = new Serie(
        data.id,
        data.officialSite || data.url || "#",
        data.name,
        data.language,
        data.genres,
        data.image?.medium || ""
      );
      const card = serie.createHtmlElement(true);
      seriesContainer.appendChild(card);
    });
  });
}

function paginaSiguiente() {
  paginaActual++;
  cargarSeries();
}

function paginaAnterior() {
  if (paginaActual > 1) {
    paginaActual--;
    cargarSeries();
  }
}

function mostrarGuardadas() {
  const guardadas = JSON.parse(localStorage.getItem("seriesGuardadas")) || [];
  guardadas.forEach(json => {
    const serie = Serie.createFromJsonString(JSON.stringify(json));
    const el = serie.createHtmlElement(false);
    seriesContainer.appendChild(el);
  });

  const btnOrdenar = document.getElementById("ordenarNombre");
  if (btnOrdenar) {
    btnOrdenar.addEventListener("click", () => {
      seriesContainer.innerHTML = "";
      guardadas.sort((a, b) => a.name.localeCompare(b.name));
      guardadas.forEach(json => {
        const serie = Serie.createFromJsonString(JSON.stringify(json));
        const el = serie.createHtmlElement(false);
        seriesContainer.appendChild(el);
      });
    });
  }
}
