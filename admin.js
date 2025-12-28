// admin.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* 🔴 Firebase Config */
const firebaseConfig = {
  apiKey: "AIzaSyC6qb8-8H6buRMjt4rlkBZ_HoxAoyuckEY",
 authDomain: "cafe-verda.firebaseapp.com",
  projectId: "cafe-verda"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const adminList = document.getElementById("admin-list");

let editId = null;

/* 🔵 ImageBB upload */
async function uploadImage(file) {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(
    "https://api.imgbb.com/1/upload?key=167974eccaf9dd6477f8f1a44c5dab81",
    { method: "POST", body: formData }
  );

  const data = await res.json();
  return data.data.url;
}

/* 🔵 Add or Update */
window.addOrUpdate = async function () {
  const title = document.getElementById("item-title").value;
  const price = document.getElementById("item-price").value;
  const desc = document.getElementById("item-desc").value;
  const category = document.getElementById("item-category").value;
  const file = document.getElementById("item-img").files[0];

  if (!title || !price || !category) {
    alert("همه فیلدها را پر کن");
    return;
  }

  let imageUrl = null;
  if (file) imageUrl = await uploadImage(file);

  if (editId) {
    await updateDoc(doc(db, "menus", editId), {
      title,
      price,
      desc,
      category,
      ...(imageUrl && { imageUrl })
    });
    editId = null;
  } else {
    await addDoc(collection(db, "menus"), {
      title,
      price,
      desc,
      category,
      imageUrl
    });
  }

  clearForm();
  loadAdminItems();
};

/* 🔵 Load items */
async function loadAdminItems() {
  adminList.innerHTML = "";
  const snap = await getDocs(collection(db, "menus"));

  snap.forEach(d => {
    const item = d.data();
    adminList.innerHTML +=` 
      <div class="card">
        <img src="${item.imageUrl}">
        <h4>${item.title}</h4>
        <p>${item.price} تومان</p>
        <button onclick="editItem('${d.id}')">ویرایش</button>
        <button onclick="deleteItem('${d.id}')">حذف</button>
      </div>
    `;
  });
}

/* 🔵 Delete */
window.deleteItem = async function (id) {
  if (confirm("حذف شود؟")) {
    await deleteDoc(doc(db, "menus", id));
    loadAdminItems();
  }
};

/* 🔵 Edit */
window.editItem = async function (id) {
  const snap = await getDocs(collection(db, "menus"));
  snap.forEach(d => {
    if (d.id === id) {
      const item = d.data();
      document.getElementById("item-title").value = item.title;
      document.getElementById("item-price").value = item.price;
      document.getElementById("item-desc").value = item.desc;
      document.getElementById("item-category").value = item.category;
      editId = id;
    }
  });
};

/* 🔵 Clear */
function clearForm() {
  document.getElementById("item-title").value = "";
  document.getElementById("item-price").value = "";
  document.getElementById("item-desc").value = "";
  document.getElementById("item-img").value = "";
  document.getElementById("item-category").value = "all";
}

/* Init */
loadAdminItems();






