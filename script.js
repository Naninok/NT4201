// Constants
const DENSITY = 1.23;      // kg/L
const NITRITE_RATIO = 0.20; // nitrite fraction in NT4201 (20%)

// Example product NT range to show (you gave example NT 3000-5000 ppm -> nitrite 600-1000 ppm)
const EX_SAMPLE_MIN = 3000; // ppm of NT product (example)
const EX_SAMPLE_MAX = 5000; // ppm

// DOM
const ppmNow = document.getElementById('ppm_now');
const ppmTarget = document.getElementById('ppm_target');
const volume = document.getElementById('volume');

const mainResult = document.getElementById('main_result');
const rangeBlock = document.getElementById('range_block');
const detail = document.getElementById('detail');

function fnum(n, d=2){
  if (!isFinite(n)) return "-";
  return Number(n).toLocaleString(undefined, {minimumFractionDigits: d, maximumFractionDigits: d});
}

function calculate(){
  const now = parseFloat(ppmNow.value);
  const target = parseFloat(ppmTarget.value);
  const vol = parseFloat(volume.value);

  // validate
  if (!isFinite(now) || !isFinite(target) || !isFinite(vol)){
    mainResult.textContent = "-";
    rangeBlock.innerHTML = "";
    detail.innerHTML = "";
    return;
  }

  const delta = target - now;
  if (delta <= 0){
    mainResult.textContent = "ไม่ต้องเติมเพิ่ม";
    rangeBlock.innerHTML = "";
    detail.innerHTML = "";
    return;
  }

  // Nitrite needed (kg)
  const nitrite_kg = (delta * vol) / 1000.0; // kg

  // NT4201 needed (kg) and liters
  const nt_kg = nitrite_kg / NITRITE_RATIO;
  const nt_L = nt_kg / DENSITY;

  mainResult.textContent = `ต้องเติม NT4201 = ${fnum(nt_L,2)} L`;

  // ---------- Range display (example using NT 3000-5000 ppm) ----------
  // If product NT in system is 3000-5000 ppm -> nitrite = 0.2 * NT
  const nit_min = (EX_SAMPLE_MIN * NITRITE_RATIO); // ppm -> nitrite from product
  const nit_max = (EX_SAMPLE_MAX * NITRITE_RATIO);

  // Also compute how many liters of product are needed to reach EX_SAMPLE_MIN or MAX in the system:
  // To create X ppm of product in system: product_mass_kg = X(ppm) * vol(m3) / 1000
  // product_L = product_mass_kg / density
  const prod_kg_min = (EX_SAMPLE_MIN * vol) / 1000.0;
  const prod_kg_max = (EX_SAMPLE_MAX * vol) / 1000.0;
  const prod_L_min = prod_kg_min / DENSITY;
  const prod_L_max = prod_kg_max / DENSITY;

  rangeBlock.innerHTML = `
    <div class="range-item"> NT4201 ${EX_SAMPLE_MIN}–${EX_SAMPLE_MAX} ppm </div>
    <div class="range-sub">จะให้ Nitrite ≈ ${fnum(nit_min,0)}–${fnum(nit_max,0)} ppm </div>
    <div class="range-sub" style="margin-top:8px">ปริมาณ NT4201 ที่ต้องเติมทั้งหมด (สำหรับ Working Volume = ${vol} m³):</div>
    <div class="range-sub">NT4201 ${EX_SAMPLE_MIN} ppm → ต้องเติมอย่างน้อย ≈ ${fnum(prod_L_min,2)} L</div>
    <div class="range-sub">NT4201 ${EX_SAMPLE_MAX} ppm → ต้องเติมไม่เกิน ≈ ${fnum(prod_L_max,2)} L</div>
  `;

  // ---------- Detailed calculation steps ----------
  detail.innerHTML = `
    Δppm = ${target} - ${now} = <b>${fnum(delta,2)}</b><br><br>

    Nitrite ที่ต้องเติม = Δppm × Volume(m³) / 1000 = ${fnum(delta)} × ${fnum(vol)} / 1000 = <b>${fnum(nitrite_kg,3)} kg</b><br><br>

    NT4201 (เนื่องจาก Nitrite เป็น 20% ของ NT) → NT4201_kg = Nitrite_kg / 0.20 = <b>${fnum(nt_kg,3)} kg</b><br>
    แปลงเป็นลิตร (density = ${DENSITY} kg/L): NT4201_L = ${fnum(nt_kg,3)} / ${DENSITY} = <b>${fnum(nt_L,2)} L</b>
  `;
}

[ppmNow, ppmTarget, volume].forEach(el => el.addEventListener('input', calculate));

// initial run (in case defaults present)
calculate();
