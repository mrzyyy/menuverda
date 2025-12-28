// script.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const backToTopBtn = document.getElementById("backToTop");

// نمایش دکمه وقتی صفحه پایین اسکرول شود
window.onscroll = function() {
  if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
    backToTopBtn.style.display = "flex";
  } else {
    backToTopBtn.style.display = "none";
  }
};

// اسکرول به بالا وقتی روی دکمه کلیک شد
backToTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

const firebaseConfig = {
  apiKey: "AIzaSyC6qb8-8H6buRMjt4rlkBZ_HoxAoyuckEY",
  authDomain: "cafe-verda.firebaseapp.com",
  projectId: "cafe-verda"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const container = document.getElementById("menu-container");
let allItems = [];

async function loadMenu() {
  const snap = await getDocs(collection(db, "menus"));
  allItems = [];
  snap.forEach(d => allItems.push(d.data()));
  renderMenu(allItems);
}

function renderMenu(items) {
  container.innerHTML = "";
  items.forEach(item => {
    container.innerHTML +=` 
      <div class="card">
        <img src="${item.imageUrl}">
        <h3>${item.title}</h3>
        <p>${item.desc || ""}</p>
        <strong>${item.price} تومان</strong>
      </div>
    `;
  });
}

window.filterMenu = function (cat) {
  if (cat === "all") renderMenu(allItems);
  else renderMenu(allItems.filter(i => i.category === cat));
};

loadMenu();




