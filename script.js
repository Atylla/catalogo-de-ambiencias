const tagInput = document.querySelectorAll(".pesquisa-1 input")[0];
const nameInput = document.querySelectorAll(".pesquisa-1 input")[1];
const cardsContainer = document.querySelector(".cards");

const FILES = [
    "A colméia.md",
    "Acampamento ao anoitecer.md",
    "Acampamento ao entardecer.md",
    "Acampamento na Caverna.md",
    "Acampamento na caverna no deserto.md",
    "Acampamento na floresta.md",
    "Acampamento na nevasca.md",
    "Acampamento na tundra gelada.md",
    "Acampamento no deserto.md",
    "Acampamento no pântano.md",
    "Area vulcanica.md",
    "Arena.md",
    "Barco a vela.md",
    "Batalha.md",
    "Batalha na Cidade.md",
    "Bazaar.md",
    "Biblioteca.md",
    "Campo.md",
    "Canion do Deserto.md",
    "Carpinteiro.md",
    "Carroagem.md",
    "Casa de banho.md",
    "Castelo Amaldicioado.md",
    "Cavalo e carroça.md",
    "Cavalos.md",
    "Caverna de Aranhas.md",
    "Caverna de cristal.md",
    "Caverna de gelo.md",
    "Caverna no deserto.md",
    "Caverna sombria.md",
    "Caverna Sombria Umida.md",
    "Cemitério.md",
    "Cemitério amaldiçoado.md",
    "Chuva e Trovão.md",
    "Chuva na floresta.md",
    "Cidade Africana.md",
    "Cidade Anã Subterrânea.md",
    "Cidade Colapsando.md",
    "Cidade dos Elfos Negros.md",
    "Cidade em Ruinas.md",
    "Cidade Medieval Dia.md",
    "Cidade Medieval Noite.md",
    "Cidade Medieval Tarde.md",
    "Cidade Steampunk.md",
    "Colina ventosa.md",
    "Convés do dirigivel.md",
    "Costa.md",
    "Costa gelada.md",
    "Costa tropical.md",
    "Costa Ventando.md",
    "Covil subaquático.md",
    "De baixo d'água.md",
    "Dentro de casa.md",
    "Dentro do navio na tempestade.md",
    "Deserto amaldiçoado.md",
    "Deserto Vento.md",
    "Dirigivel a Vela.md",
    "Dirigível na tempestade.md",
    "Enseada.md",
    "Esgoto.md",
    "Ferreiro.md",
    "Festa Nobre.md",
    "Festival.md",
    "Festival Asiatico.md",
    "Floresta.md",
    "Floresta a noite.md",
    "Floresta amaldiçoada.md",
    "Floresta Crepuscular.md",
    "Floresta de cogumelos.md",
    "Floresta Elfica.md",
    "Floresta Misteriosa.md",
    "Floresta quimando.md",
    "Floresta Sombria.md",
    "Floresta Taiga.md",
    "Herborista.md",
    "Highlands tempestuoso.md",
    "Inferno.md",
    "Interior do navio.md",
    "Interior do navio amaldicioado.md",
    "Loja de itens magicos.md",
    "Mar agitado.md",
    "Masmorra vulcão.md",
    "Mecanar.md",
    "Mercado Negro.md",
    "Monastério na montanha.md",
    "Mundo Espiritual.md",
    "Naufrágio.md",
    "Navio na tempestade.md",
    "Nevasca.md",
    "Neve.md",
    "Oasis.md",
    "Oficina do Engenheiro.md",
    "Oficina do funileiro.md",
    "Pantano.md",
    "Pantano sombrio.md",
    "Pântano tropical.md",
    "Paraíso.md",
    "Pátio.md",
    "Plano da Água.md",
    "Plano do Ar.md",
    "Plano do Fogo.md",
    "Porto Medieval.md",
    "Pousada.md",
    "Pradaria seca.md",
    "Prisão.md",
    "Quarto de Pousada a noite.md",
    "Quarto de Pousada de dia.md",
    "Rio no deserto.md",
    "Ruinas do castelo.md",
    "Savana.md",
    "Selva.md",
    "Selva de dinossauros.md",
    "Submarino steampunk.md",
    "Taverna Calma.md",
    "Taverna Cheia.md",
    "Taverna de beco.md",
    "Taverna quieta.md",
    "Tempestade de Areia.md",
    "Tempestade no mar.md",
    "Templo da água.md",
    "Templo da forja.md",
    "Templo da lua.md",
    "Templo da Serpente.md",
    "Templo da Vida.md",
    "Templo de Gelo.md",
    "Templo do conhecimento.md",
    "Templo dos mortos.md",
    "Templo Inferno.md",
    "Templo Maligno.md",
    "Templo no Deserto.md",
    "Templo Sagrado.md",
    "Torre de mago.md",
    "Trem a vapor.md",
    "Trem a vapor com passageiros.md",
    "Tundra.md",
    "Tundra Gelada.md",
    "Vila Dark.md",
    "Vila na Montanha.md"
];

const tagButtons = {
    biomas: "bioma",
    cidades: "cidade",
    interiores: "estabelecimento",
    floresta: "floresta"
};

const limparBtn = document.getElementById("limpar");


let ambiencias = [];

Object.entries(tagButtons).forEach(([buttonId, tag]) => {
    const btn = document.getElementById(buttonId);
    if (!btn) return;

    btn.addEventListener("click", () => {
        tagInput.value = tag;
        nameInput.value = "";

        clearActiveButtons();
        btn.classList.add("active");

        render();
    });
});

function clearActiveButtons() {
    document.querySelectorAll("header button")
        .forEach(b => b.classList.remove("active"));
}

if (limparBtn) {
    limparBtn.addEventListener("click", () => {
        tagInput.value = "";
        nameInput.value = "";

        clearActiveButtons();
        limparBtn.classList.add("active");

        render();
    });
}


function parseFrontmatter(md) {
    const match = md.match(/---([\s\S]*?)---/);
    if (!match) return {};

    const data = {};
    let currentKey = null;

    match[1].split("\n").forEach(line => {
        const trimmed = line.trim();
        if (!trimmed) return;

        // chave: valor
        if (!trimmed.startsWith("-") && trimmed.includes(":")) {
            const [key, ...rest] = trimmed.split(":");
            currentKey = key.trim();

            const value = rest.join(":").trim();

            // se não tem valor, vira array
            data[currentKey] = value === "" ? [] : value;
        }

        // - item de lista
        else if (trimmed.startsWith("-") && currentKey) {
            if (!Array.isArray(data[currentKey])) {
                data[currentKey] = [];
            }

            data[currentKey].push(
                trimmed.replace("-", "").trim()
            );
        }
    });

    return data;
}

async function loadAmbiencias() {
    const results = await Promise.all(
        FILES.map(async file => {
            const res = await fetch(`ambiencias/${encodeURIComponent(file)}`);
            const text = await res.text();
            const data = parseFrontmatter(text);

            return {
                name: file.replace(".md", ""),
                ...data
            };
        })
    );

    ambiencias = results;
    render();
}

function render() {
    const tagFilter = tagInput.value.toLowerCase();
    const nameFilter = nameInput.value.toLowerCase();

    cardsContainer.innerHTML = "";

    ambiencias
        .filter(a => {
            const matchTag =
                !tagFilter ||
                (a.tags && a.tags.some(t => t.toLowerCase().includes(tagFilter)));

            const matchName =
                !nameFilter || a.name.toLowerCase().includes(nameFilter);

            return matchTag && matchName;
        })
        .forEach(a => {
            const card = document.createElement("div");
            card.className = "card";

            card.innerHTML = `
        <img src="${a.thumbnail ?? ""}">
        <div class="card-title">${a.name}</div>
      `;

            if (a.link) {
                card.addEventListener("click", () =>
                    window.open(a.link, "_blank")
                );
            }

            cardsContainer.appendChild(card);
        });
}

tagInput.addEventListener("input", render);
nameInput.addEventListener("input", render);

loadAmbiencias();
