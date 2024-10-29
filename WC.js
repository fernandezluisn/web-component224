class NuevoComponente extends HTMLElement{

    constructor(){
        super();

        let referencia = this.attachShadow({mode: 'closed'});

        this.divCreado = document.createElement("div");

        this.nuevoTitulo = document.createElement("h1");

        this.nuevoTitulo.textContent = "Soy un título";

        referencia.appendChild(this.divCreado);

        this.divCreado.appendChild(this.nuevoTitulo);

        this.nuevoTitulo.style.color = "red";


    }

    connectedCallback(){
        this.parrafo = document.createElement("p");
        this.parrafo.innerHTML = this.getAttribute("texto");

        this.divCreado.appendChild(this.parrafo);
    }
}

customElements.define("app-nc", NuevoComponente)

class ListarDesdeApi extends HTMLElement{

    constructor(){
        super();

        let referencia = this.attachShadow({mode: "open"});

        this.divDos = document.createElement("div");

        this.divTres = document.createElement("div");

        this.subtitulo = document.createElement("h2");

        referencia.appendChild(this.divDos);
        this.divDos.appendChild(this.subtitulo);

        referencia.appendChild(this.divTres);
    }

    connectedCallback(){
        this.parrafo = document.createElement("p");
        this.parrafo.innerHTML = this.getAttribute("texto");

        let campo = this.getAttribute("campo");

        this.divDos.appendChild(this.parrafo);

        let servicio = this.getAttribute("url");

        fetch(servicio).then(response=>response.json())
        .then(json => json.results.forEach(element => {
            
            this.divTres.innerText += element[campo];

            this.divTres.appendChild(document.createElement("br"));
        }));
    }

}

customElements.define("app-lista", ListarDesdeApi)

class CustomCard extends HTMLElement{

    constructor(){
        super();

        let shadow = this.attachShadow({mode:"open"});

        let template = document.getElementById("card-template");

        //Utilizamos cloneNode para clonar el template
        let templateContent = template.content.cloneNode(true);

        shadow.appendChild(templateContent);

    }

}

customElements.define("custom-card", CustomCard);

function createCard(title, imgUrl){

    let carta = document.createElement("custom-card");

    let titleSpan = document.createElement("span");

    titleSpan.setAttribute("slot", "title");

    titleSpan.textContent = title;

    let img = document.createElement("img");

    img.setAttribute("slot", "content");

    img.setAttribute("src", imgUrl);

    img.setAttribute("alt", title);

    carta.appendChild(titleSpan);
    carta.appendChild(img);

    return carta;

}

async function generarCartas() {
    
    const container = document.getElementById("muestrario");

    try{
        let response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
        let data = await response.json();
        for (let pokemon of data.results){
            
            let responsePokemon = await fetch(pokemon.url);
            let pokemonData = await responsePokemon.json();
            let card = createCard(pokemonData.name, pokemonData.sprites.front_default);
            container.appendChild(card);
        }
    }catch(error){
        console.error("Error en el acceso a la api: ", error);
    }
}

window.addEventListener("load", generarCartas);
