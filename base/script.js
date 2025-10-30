const baseChamps = [
  { name: "Ahri", img: "Ahri.png" },
  { name: "Braum", img: "Braum.png" },
  { name: "Darius", img: "Darius.png" },
  { name: "Ekko", img: "Ekko.png" },
  { name: "Illaoi", img: "Illaoi.png" },
  { name: "Yasuo", img: "Yasuo.png" }
];

const optionalChamps = [
  { id: "jinxChk", name: "Jinx", img: "Jinx.png" },
  { id: "viChk", name: "Vi", img: "Vi.png" },
  { id: "teemoChk", name: "Teemo", img: "Teemo.png" },
  { id: "warwickChk", name: "Warwick", img: "Warwick.png" },
  { id: "blitzChk", name: "Blitzcrank", img: "Blitzcrank.png" }
];

let champs = JSON.parse(localStorage.getItem("ironmanChamps")) ||
  baseChamps.map(c => ({...c, completed:false, unlocked:true}));

optionalChamps.forEach(opt => {
  const existing = champs.find(c => c.name === opt.name);
  if (!existing) champs.push({...opt, completed:false, unlocked:false});
});

function saveData() {
  localStorage.setItem("ironmanChamps", JSON.stringify(champs));
}

function renderChamps() {
  const container = document.getElementById("champ-container");
  container.innerHTML = "";
  champs.filter(c => c.unlocked).forEach(c => {
    const div = document.createElement("div");
    div.className = "champ" + (c.completed ? " completed" : "");
    div.innerHTML = `<img src="${c.img}" alt="${c.name}"><p>${c.name}</p>`;
    div.onclick = () => {
      c.completed = !c.completed;
      saveData();
      renderChamps();
    };
    container.appendChild(div);
  });
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

document.getElementById("randomizeBtn")?.addEventListener("click", () => {
  const unlocked = champs.filter(c => c.unlocked);
  shuffle(unlocked);
  champs = unlocked.concat(champs.filter(c => !c.unlocked));
  saveData();
  renderChamps();
});

document.getElementById("resetBtn")?.addEventListener("click", () => {
  champs.forEach(c => c.completed = false);
  saveData();
  renderChamps();
});

optionalChamps.forEach(opt => {
  const box = document.getElementById(opt.id);
  if (box) {
    const champ = champs.find(c => c.name === opt.name);
    box.checked = champ.unlocked;
    box.addEventListener("change", () => {
      champ.unlocked = box.checked;
      saveData();
      renderChamps();
    });
  }
});

renderChamps();

// === Layout Detection ===
const layout = document.body.dataset.layout;
if (layout === "vertical") {
  document.body.classList.add("obs-mode", "obs-vertical");
} else if (layout === "horizontal") {
  document.body.classList.add("obs-mode", "obs-horizontal");
}
