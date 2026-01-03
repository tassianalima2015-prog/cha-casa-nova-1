// script.js (arquivo em módulo)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getFirestore, collection, doc, setDoc, onSnapshot, runTransaction, getDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", async () => {

  // --- CONFIGURAÇÃO DO FIREBASE ---
  const firebaseConfig = {
    apiKey: "AIzaSyB9gTaojRXu7J7g7yI7Hw_9lb3yDMr1ydg",
    authDomain: "cha-de-casa-nova-9034c.firebaseapp.com",
    projectId: "cha-de-casa-nova-9034c",
    storageBucket: "cha-de-casa-nova-9034c.firebasestorage.app",
    messagingSenderId: "396610857130",
    appId: "1:396610857130:web:14590d41081486e57048d3",
    measurementId: "G-Y8GJQB19PR"
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const presentesColl = collection(db, "presentes");

  const defaultItems = [
    { id: "jogo_lencol_fronha_casal", name: "Jogo de lençol e fronha casal", buyer: "", bought: false },
    { id: "cobre_leito", name: "Cobre leito", buyer: "", bought: false },
    { id: "protetor_colchao", name: "Protetor de colchão", buyer: "", bought: false },
    { id: "travesseiros", name: "Travesseiros", buyer: "", bought: false },
    { id: "kit_vassoura_rodo_pa", name: "Kit vassoura + rodo + pá", buyer: "", bought: false },
    { id: "mop", name: "Mop", buyer: "", bought: false },
    { id: "cortina_1", name: "Cortina para quarto 1", buyer: "", bought: false },
    { id: "cortina_2", name: "Cortina para quarto 2", buyer: "", bought: false },
    { id: "cortina_sala_estar", name: "Cortina para sala de estar", buyer: "", bought: false },
    { id: "cortina_grande_sala_jantar", name: "Cortina grande para sala de jantar", buyer: "", bought: false },
    { id: "pano_chao_pratos", name: "Pano de chão + de pratos", buyer: "", bought: false },
    { id: "cesto_roupa_suja", name: "Cesto de roupa suja", buyer: "", bought: false },
    { id: "jogo_toalhas", name: "Jogo de toalhas", buyer: "", bought: false },
    { id: "conjunto_panelas", name: "Conjunto de panelas", buyer: "", bought: false },
    { id: "jogo_pratos", name: "Jogo de pratos", buyer: "", bought: false },
    { id: "jogo_copos", name: "Jogo de copos", buyer: "", bought: false },
    { id: "xicaras", name: "Xícaras", buyer: "", bought: false },
    { id: "tacas", name: "Taças", buyer: "", bought: false },
    { id: "potes_hermeticos", name: "Potes herméticos", buyer: "", bought: false },
    { id: "queijeira", name: "Queijeira", buyer: "", bought: false },
    { id: "travessas", name: "Travessas", buyer: "", bought: false },
    { id: "jogo_sobremesa", name: "Jogo de sobremesa", buyer: "", bought: false },
    { id: "jogo_assadeiras", name: "Jogo de assadeiras", buyer: "", bought: false },
    { id: "mixer", name: "Mixer", buyer: "", bought: false },
    { id: "jogo_americano", name: "Jogo americano", buyer: "", bought: false },
    { id: "jogo_talheres", name: "Jogo de talheres", buyer: "", bought: false },
    { id: "jogo_facas_corte", name: "Jogo de facas de cortes", buyer: "", bought: false },
    { id: "panela_pressao", name: "Panela de pressão", buyer: "", bought: false },
    { id: "liquidificador", name: "Liquidificador", buyer: "", bought: false },
    { id: "batedeira", name: "Batedeira", buyer: "", bought: false },
    { id: "sanduicheira", name: "Sanduicheira", buyer: "", bought: false },
    { id: "ventilador", name: "Ventilador", buyer: "", bought: false },
    { id: "ferro_passar_roupa", name: "Ferro de passar roupa", buyer: "", bought: false }
  ];

  const listaEl = document.getElementById("lista-presentes");
  const statusEl = document.getElementById("status");

  // Inicializa itens padrão se coleção vazia
  async function ensureDefaultItems() {
    const anyDoc = await getDoc(doc(db, "presentes", defaultItems[0].id));
    if(!anyDoc.exists()){
      for(const it of defaultItems){
        await setDoc(doc(presentesColl, it.id), it);
      }
    }
  }

  // Renderiza um item
  function renderItem(item){
    const li = document.createElement("li");
    li.dataset.id = item.id;
    li.style.display = "flex";
    li.style.justifyContent = "space-between";
    li.style.alignItems = "center";
    li.style.padding = "8px";
    li.style.marginBottom = "5px";
    li.style.borderRadius = "5px";
    li.style.backgroundColor = item.bought ? "#d4edda" : "#fff3cd"; // verde se comprado, amarelo se disponível

    const info = document.createElement("div");
    info.className = "present-info";

    const name = document.createElement("div");
    name.className = "present-item-name";
    name.textContent = item.name;

    const meta = document.createElement("div");
    meta.className = "present-item-meta";
    meta.textContent = item.bought ? `Comprado por: ${item.buyer}` : "Disponível";

    info.appendChild(name);
    info.appendChild(meta);

    const btn = document.createElement("button");
    btn.className = "btn";
    btn.textContent = item.bought ? "Desmarcar ✔" : "Marcar como comprado";

    btn.addEventListener("click", async () => {
      const docRef = doc(db, "presentes", item.id);
      try {
        await runTransaction(db, async (t) => {
          const d = await t.get(docRef);
          if(!d.exists()) throw "Documento não existe";
          const data = d.data();

          if(!data.bought){
            const nome = prompt("Digite seu nome para marcar este presente como compr
