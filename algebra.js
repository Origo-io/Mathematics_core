const fmt = value => {
  if (typeof value !== "number" || !Number.isFinite(value)) return String(value);
  if (Math.abs(value) < 1e-10) value = 0;
  return Number(value.toPrecision(10)).toString();
};
const num = (root, id) => {
  const value = Number(root.querySelector(`#${id}`).value);
  if (!Number.isFinite(value)) throw new Error("Masukkan angka yang valid.");
  return value;
};
const showResult = (root, value, note = "") => {
  const result = root.querySelector("#algebra-result");
  result.innerHTML = `<div class="result-label">HASIL PERHITUNGAN</div><div class="result-value">${escapeHtml(String(value))}</div>${note ? `<div class="result-note">${escapeHtml(note)}</div>` : ""}`;
};
const showError = (root, error) => {
  root.querySelector("#algebra-result").innerHTML = `<div class="result-label">PERIKSA INPUT</div><div class="error">${escapeHtml(error.message || "Terjadi kesalahan.")}</div>`;
};
function escapeHtml(text) {
  return text.replace(/[&<>"']/g, char => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" })[char]);
}

export function renderAlgebra(root) {
  root.innerHTML = `
    <section class="section-head"><h2>Aljabar</h2><p>Operasi dasar, persamaan, matriks, dan fungsi polinomial dalam satu ruang kerja.</p></section>
    <div class="workspace-grid">
      <section class="panel">
        <div class="panel-head"><h3>Kalkulator Aljabar</h3><p>Pilih alat yang ingin digunakan.</p></div>
        <div class="panel-body">
          <div class="tabs" role="tablist">
            <button class="tab active" data-tool="basic">Operasi dasar</button>
            <button class="tab" data-tool="linear">Linear</button>
            <button class="tab" data-tool="quadratic">Kuadrat</button>
            <button class="tab" data-tool="matrix">Matriks 2×2</button>
            <button class="tab" data-tool="polynomial">Polinomial</button>
          </div>
          <div id="algebra-form"></div>
          <div class="result-box" id="algebra-result"><div class="result-label">HASIL PERHITUNGAN</div><div class="muted">Isi input, lalu tekan Hitung.</div></div>
        </div>
      </section>
      <aside class="panel">
        <div class="panel-head"><h3>Catatan matematika</h3><p>Definisi singkat untuk membantu belajar.</p></div>
        <div class="panel-body">
          <div class="info-list">
            <div class="info-row"><b>01</b><span><strong>Persamaan linear</strong><br>ax + b = 0. Jika a ≠ 0, maka x = −b/a.</span></div>
            <div class="info-row"><b>02</b><span><strong>Persamaan kuadrat</strong><br>ax² + bx + c = 0 diselesaikan dengan diskriminan D = b² − 4ac.</span></div>
            <div class="info-row"><b>03</b><span><strong>Determinan matriks 2×2</strong><br>Untuk [[a,b],[c,d]], determinannya adalah ad − bc.</span></div>
            <div class="info-row"><b>04</b><span><strong>Polinomial kuadrat</strong><br>f(x) = ax² + bx + c. Modul ini menghitung nilai f(x) dari koefisien yang diberikan.</span></div>
          </div>
          <div class="notice">Catatan: hasil numerik dibulatkan secara tampilan. Untuk matriks, invers tidak ada jika determinan sama dengan nol.</div>
        </div>
      </aside>
    </div>`;
  const form = root.querySelector("#algebra-form");
  const buttons = root.querySelectorAll("[data-tool]");
  buttons.forEach(button => button.addEventListener("click", () => {
    buttons.forEach(item => item.classList.toggle("active", item === button));
    renderTool(form, button.dataset.tool, root);
  }));
  renderTool(form, "basic", root);
}

function renderTool(form, tool, root) {
  const templates = {
    basic: `<div class="field"><label for="operation">Operasi</label><select id="operation"><option value="+">Penjumlahan (+)</option><option value="-">Pengurangan (−)</option><option value="*">Perkalian (×)</option><option value="/">Pembagian (÷)</option><option value="%">Sisa bagi (%)</option><option value="pow">Pangkat (aᵇ)</option></select></div><div class="field-grid"><div class="field"><label for="a">Angka pertama (a)</label><input id="a" type="number" step="any" value="12"></div><div class="field"><label for="b">Angka kedua (b)</label><input id="b" type="number" step="any" value="8"></div></div>`,
    linear: `<p class="muted">Selesaikan persamaan ax + b = 0.</p><div class="field-grid"><div class="field"><label for="a">Koefisien a</label><input id="a" type="number" step="any" value="2"></div><div class="field"><label for="b">Konstanta b</label><input id="b" type="number" step="any" value="-10"></div></div>`,
    quadratic: `<p class="muted">Selesaikan ax² + bx + c = 0.</p><div class="field-grid"><div class="field"><label for="a">Koefisien a</label><input id="a" type="number" step="any" value="1"></div><div class="field"><label for="b">Koefisien b</label><input id="b" type="number" step="any" value="-5"></div><div class="field"><label for="c">Konstanta c</label><input id="c" type="number" step="any" value="6"></div></div>`,
    matrix: `<p class="muted">Matriks A = [[a,b],[c,d]]. Hitung determinan dan inversnya.</p><div class="matrix-grid"><input aria-label="a" id="a" type="number" step="any" value="1"><input aria-label="b" id="b" type="number" step="any" value="2"><input aria-label="c" id="c" type="number" step="any" value="3"><input aria-label="d" id="d" type="number" step="any" value="4"></div>`,
    polynomial: `<p class="muted">Evaluasi f(x) = ax² + bx + c pada nilai x.</p><div class="field-grid"><div class="field"><label for="a">Koefisien a</label><input id="a" type="number" step="any" value="1"></div><div class="field"><label for="b">Koefisien b</label><input id="b" type="number" step="any" value="2"></div><div class="field"><label for="c">Konstanta c</label><input id="c" type="number" step="any" value="1"></div><div class="field"><label for="x">Nilai x</label><input id="x" type="number" step="any" value="3"></div></div>`
  };
  form.innerHTML = `${templates[tool]}<button class="primary-btn" id="calculate">Hitung</button>`;
  form.querySelector("#calculate").addEventListener("click", () => {
    try {
      let result, note = "";
      if (tool === "basic") {
        const a = num(form,"a"), b = num(form,"b"), op = form.querySelector("#operation").value;
        if (op === "/" && b === 0) throw new Error("Pembagian dengan nol tidak terdefinisi.");
        if (op === "%" && b === 0) throw new Error("Sisa bagi dengan nol tidak terdefinisi.");
        const values = { "+": a+b, "-": a-b, "*": a*b, "/": a/b, "%": a%b, "pow": a**b };
        result = fmt(values[op]);
        if (!Number.isFinite(values[op])) throw new Error("Hasil tidak terhingga atau tidak valid.");
      } else if (tool === "linear") {
        const a = num(form,"a"), b = num(form,"b");
        if (a === 0 && b === 0) result = "Semua bilangan real adalah solusi.";
        else if (a === 0) result = "Tidak ada solusi.";
        else result = `x = ${fmt(-b/a)}`;
      } else if (tool === "quadratic") {
        const a = num(form,"a"), b = num(form,"b"), c = num(form,"c");
        if (a === 0) {
          if (b === 0) result = c === 0 ? "Semua x memenuhi persamaan." : "Tidak ada solusi.";
          else result = `Persamaan menjadi linear: x = ${fmt(-c/b)}`;
        } else {
          const d = b*b - 4*a*c;
          if (d > 0) result = `x₁ = ${fmt((-b+Math.sqrt(d))/(2*a))}, x₂ = ${fmt((-b-Math.sqrt(d))/(2*a))}`;
          else if (d === 0) result = `Akar kembar: x = ${fmt(-b/(2*a))}`;
          else {
            const real = -b/(2*a), imag = Math.sqrt(-d)/Math.abs(2*a);
            result = `x₁ = ${fmt(real)} + ${fmt(imag)}i; x₂ = ${fmt(real)} − ${fmt(imag)}i`;
          }
          note = `Diskriminan D = ${fmt(d)}. ${d > 0 ? "D positif: dua akar real berbeda." : d === 0 ? "D nol: satu akar real kembar." : "D negatif: dua akar kompleks."}`;
        }
      } else if (tool === "matrix") {
        const a = num(form,"a"), b = num(form,"b"), c = num(form,"c"), d = num(form,"d");
        const det = a*d - b*c;
        result = `Determinan = ${fmt(det)}\n`;
        if (Math.abs(det) < 1e-12) result += "Matriks tidak memiliki invers (determinan nol).";
        else result += `Invers = [[${fmt(d/det)}, ${fmt(-b/det)}], [${fmt(-c/det)}, ${fmt(a/det)}]]`;
        note = "Invers matriks dihitung dengan 1/(ad−bc) × [[d,−b],[−c,a]].";
      } else if (tool === "polynomial") {
        const a = num(form,"a"), b = num(form,"b"), c = num(form,"c"), x = num(form,"x");
        result = `f(${fmt(x)}) = ${fmt(a*x*x+b*x+c)}`;
        note = `Substitusi ke f(x) = ${fmt(a)}x² + ${fmt(b)}x + ${fmt(c)}.`;
      }
      showResult(root, result, note);
    } catch (error) { showError(root,error); }
  });
}
