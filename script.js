const tagInput = document.querySelectorAll(".pesquisa-1 input")[0];
const nameInput = document.querySelectorAll(".pesquisa-1 input")[1];
const cardsContainer = document.querySelector(".cards");

const tagButtons = {
    biomas: "bioma",
    cidades: "cidade",
    interiores: "estabelecimento",
    floresta: "floresta"
};

const limparBtn = document.getElementById("limpar");

let ambiencias = [];

/* ---------------- BOTÕES DE FILTRO ---------------- */

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

/* ---------------- CARREGAR JSON ---------------- */

async function loadAmbiencias() {
    try {
        const res = await fetch("/Ambiencias/ambientes.json");
        if (!res.ok) throw new Error("Não foi possível carregar o JSON");

        const data = await res.json();

        ambiencias = data;
        render();
    } catch (err) {
        console.error("Erro ao carregar ambientes:", err);
    }
}

/* ---------------- RENDER ---------------- */

function render() {
    const tagFilter = tagInput.value.toLowerCase();
    const nameFilter = nameInput.value.toLowerCase();

    cardsContainer.innerHTML = "";

    ambiencias
        .filter(a => {
            const matchTag =
                !tagFilter ||
                (a.tags &&
                    a.tags.some(t =>
                        t.toLowerCase().includes(tagFilter)
                    ));

            const matchName =
                !nameFilter ||
                a.nome.toLowerCase().includes(nameFilter);

            return matchTag && matchName;
        })
        .forEach(a => {
            const card = document.createElement("div");
            card.className = "card";

            card.innerHTML = `
                <img src="${a.thumbnail || ""}">
                <div class="card-title">${a.nome}</div>
            `;

            if (a.link) {
                card.addEventListener("click", () =>
                    window.open(a.link, "_blank")
                );
            }

            cardsContainer.appendChild(card);
        });
}

/* ---------------- EVENTOS INPUT ---------------- */

tagInput.addEventListener("input", () => {
    clearActiveButtons();
    render();
});

nameInput.addEventListener("input", () => {
    clearActiveButtons();
    render();
});

/* ---------------- INICIAR ---------------- */

loadAmbiencias();