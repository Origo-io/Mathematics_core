import { renderAlgebra } from "./modules/algebra.js";

const content = document.querySelector("#content");
const pageTitle = document.querySelector("#page-title");
const navigation = document.querySelector("#navigation");

const modules = {
  home: { title: "Beranda", render: renderHome },
  algebra: { title: "Aljabar", render: renderAlgebra },
  geometry: { title: "Geometri & Ruang", render: () => renderComingSoon("Geometri & Ruang", "Luas, keliling, volume, dan luas permukaan bangun datar maupun ruang.") },
  calculus: { title: "Kalkulus", render: () => renderComingSoon("Kalkulus", "Turunan, integral tentu/tak tentu, dan limit fungsi.") },
  trigonometry: { title: "Trigonometri", render: () => renderComingSoon("Trigonometri", "Sin, cos, tan, cosec, sec, cotan, serta konversi sudut.") },
  statistics: { title: "Statistika & Probabilitas", render: () => renderComingSoon("Statistika & Probabilitas", "Mean, median, modus, varians, standar deviasi, permutasi, dan kombinasi.") },
  discrete: { title: "Matematika Diskrit", render: () => renderComingSoon("Matematika Diskrit", "Konversi basis bilangan, FPB (GCD), dan KPK (LCM).") }
};

navigation.addEventListener("click", (event) => {
  const button = event.target.closest("[data-module]");
  if (!button) return;
  const key = button.dataset.module;
  if (!modules[key]) return;
  document.querySelectorAll(".nav-item").forEach(item => item.classList.toggle("active", item === button));
  pageTitle.textContent = modules[key].title;
  modules[key].render(content);
});

function renderHome(root) {
  root.innerHTML = `
    <section class="hero">
      <p class="eyebrow">SATU WORKSPACE · ENAM CABANG MATEMATIKA</p>
      <h2>Matematika, lebih terstruktur.</h2>
      <p>MathCore adalah fondasi kalkulator matematika modular. Pilih cabang yang ingin kamu gunakan. Modul Aljabar sudah aktif pada versi pertama; cabang lainnya disiapkan untuk pengembangan bertahap.</p>
    </section>
    <div class="module-grid">
      ${card("𝑥","Aljabar","Operasi hitung, persamaan, matriks, dan polinomial.","algebra")}
      ${card("◇","Geometri & Ruang","Luas, keliling, volume, dan luas permukaan.","geometry")}
      ${card("∫","Kalkulus","Turunan, integral, dan limit fungsi.","calculus")}
      ${card("θ","Trigonometri","Fungsi trigonometri dan konversi sudut.","trigonometry")}
      ${card("σ","Statistika & Probabilitas","Ukuran pemusatan, penyebaran, dan pencacahan.","statistics")}
      ${card("01","Matematika Diskrit","Basis bilangan, FPB, dan KPK.","discrete")}
    </div>`;
  root.querySelectorAll("[data-card]").forEach(button => button.addEventListener("click", () => {
    const target = navigation.querySelector(`[data-module="${button.dataset.card}"]`);
    target?.click();
  }));
}
function card(symbol, title, description, key) {
  return `<button class="module-card" data-card="${key}"><span class="module-symbol">${symbol}</span><h3>${title}</h3><p>${description}</p></button>`;
}
function renderComingSoon(title, description) {
  content.innerHTML = `<section class="section-head"><h2>${title}</h2><p>${description}</p></section>
  <section class="panel"><div class="panel-body"><h3>Modul disiapkan untuk tahap berikutnya</h3><p class="muted">Navigasi dan arsitektur sudah tersedia. Modul ini akan ditambahkan sebagai file terpisah sehingga tidak mengganggu fitur yang sudah berjalan.</p><button class="primary-btn" id="back-home" style="max-width:220px">Kembali ke beranda</button></div></section>`;
  content.querySelector("#back-home").addEventListener("click", () => navigation.querySelector('[data-module="home"]').click());
}
renderHome(content);
