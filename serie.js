export class Serie {
  constructor(id, url, name, language, genres, image) {
    this.id = id;
    this.url = url;
    this.name = name;
    this.language = language;
    this.genres = genres;
    this.image = image;
  }

  toJsonString() {
    return JSON.stringify(this);
  }

  static createFromJsonString(str) {
    const obj = JSON.parse(str);
    return new Serie(
      obj.id,
      obj.url,
      obj.name,
      obj.language,
      obj.genres,
      obj.image
    );
  }

  createHtmlElement(incluirBoton = true) {
    const div = document.createElement("div");
    div.className = "card";

    const h3 = document.createElement("h3");
    h3.textContent = this.name;

    const img = document.createElement("img");
    img.src = this.image;
    img.alt = this.name;
    img.addEventListener("click", () => {
      window.open(this.url, "_blank");
    });

    const ul = document.createElement("ul");
    this.genres.forEach(g => {
      const li = document.createElement("li");
      li.textContent = g;
      ul.appendChild(li);
    });

    const p = document.createElement("p");
    p.textContent = `Idioma: ${this.language}`;

    div.appendChild(h3);
    div.appendChild(img);
    div.appendChild(p);
    div.appendChild(ul);

    if (incluirBoton) {
      const btn = document.createElement("button");
      btn.textContent = "Guardar";
      btn.addEventListener("click", () => {
        Serie.guardarSerie(this);
      });
      div.appendChild(btn);
    }

    return div;
  }

  static guardarSerie(serie) {
    const guardadas = JSON.parse(localStorage.getItem("seriesGuardadas")) || [];
    const existe = guardadas.find(s => s.id === serie.id);
    if (!existe) {
      guardadas.push(JSON.parse(serie.toJsonString()));
      localStorage.setItem("seriesGuardadas", JSON.stringify(guardadas));
    } else {
      alert("Esta serie ya está guardada.");
    }
  }
}
