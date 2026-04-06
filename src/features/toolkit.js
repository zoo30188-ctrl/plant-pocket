export function initToolkit() {
  // Temperature Converter
  const tempC = document.getElementById('tempC');
  const tempF = document.getElementById('tempF');

  tempC.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val)) tempF.value = ((val * 9/5) + 32).toFixed(1);
    else tempF.value = '';
  });

  tempF.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val)) tempC.value = ((val - 32) * 5/9).toFixed(1);
    else tempC.value = '';
  });

  // Pressure Converter
  const pressKg = document.getElementById('pressKg');
  const pressPsi = document.getElementById('pressPsi');
  const pressBar = document.getElementById('pressBar');
  const pressMpa = document.getElementById('pressMpa');

  const updatePressure = (source, value) => {
    if (isNaN(value)) {
      pressKg.value = '';
      pressPsi.value = '';
      pressBar.value = '';
      pressMpa.value = '';
      return;
    }

    let kg = 0;
    // Base unit: kg/cm2
    if (source === 'kg') kg = value;
    else if (source === 'psi') kg = value * 0.070307;
    else if (source === 'bar') kg = value * 1.01972;
    else if (source === 'mpa') kg = value * 10.1972;

    if (source !== 'kg') pressKg.value = kg.toFixed(2);
    if (source !== 'psi') pressPsi.value = (kg * 14.2233).toFixed(2);
    if (source !== 'bar') pressBar.value = (kg * 0.980665).toFixed(2);
    if (source !== 'mpa') pressMpa.value = (kg * 0.0980665).toFixed(3);
  };

  pressKg.addEventListener('input', (e) => updatePressure('kg', parseFloat(e.target.value)));
  pressPsi.addEventListener('input', (e) => updatePressure('psi', parseFloat(e.target.value)));
  pressBar.addEventListener('input', (e) => updatePressure('bar', parseFloat(e.target.value)));
  pressMpa.addEventListener('input', (e) => updatePressure('mpa', parseFloat(e.target.value)));

  document.getElementById('clearConverter').addEventListener('click', () => {
    tempC.value = ''; tempF.value = '';
    pressKg.value = ''; pressPsi.value = ''; pressBar.value = ''; pressMpa.value = '';
  });

  // Bolting Sequence & SVG Renderer
  const boltCount = document.getElementById('boltCount');
  const boltingResult = document.getElementById('boltingResult');
  const svgContainer = document.getElementById('boltingSvgContainer');

  const sequences = {
    "4": "1 - 3 - 2 - 4",
    "8": "1 - 5 - 3 - 7 - 2 - 6 - 4 - 8",
    "12": "1 - 7 - 4 - 10 - 2 - 8 - 5 - 11 - 3 - 9 - 6 - 12",
    "16": "1 - 9 - 5 - 13 - 3 - 11 - 7 - 15 - 2 - 10 - 6 - 14 - 4 - 12 - 8 - 16",
    "20": "1 - 11 - 6 - 16 - 3 - 13 - 8 - 18 - 5 - 15 - 10 - 20 - 2 - 12 - 7 - 17 - 4 - 14 - 9 - 19",
    "24": "1 - 13 - 7 - 19 - 4 - 16 - 10 - 22 - 2 - 14 - 8 - 20 - 5 - 17 - 11 - 23 - 3 - 15 - 9 - 21 - 6 - 18 - 12 - 24"
  };

  const drawBoltingSVG = (totalBolts, sequenceStr) => {
    const seq = sequenceStr.split(' - ').map(Number);
    const size = 300;
    const center = size / 2;
    const radius = 110;
    const fontSize = totalBolts >= 16 ? 10 : 12;

    let svg = `<svg viewBox="0 0 ${size} ${size}" width="100%" height="auto" style="max-width:300px;">
      <circle cx="${center}" cy="${center}" r="130" fill="none" stroke="#cbd5e1" stroke-width="4" />
      <circle cx="${center}" cy="${center}" r="80" fill="none" stroke="#cbd5e1" stroke-width="2" />
    `;

    // Coordinates mapping for each bolt number (1-based index)
    const getCoords = (boltNum) => {
      // Rotate -90deg so bolt 1 is at 12 o'clock
      const angle = (boltNum - 1) * (Math.PI * 2 / totalBolts) - (Math.PI / 2);
      const x = center + radius * Math.cos(angle);
      const y = center + radius * Math.sin(angle);
      return {x, y};
    };

    // Draw lines following the sequence
    let lines = '';
    for (let i = 0; i < seq.length - 1; i++) {
        const p1 = getCoords(seq[i]);
        const p2 = getCoords(seq[i+1]);
        // Lighter arrow line colors
        lines += `<line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" stroke="#93c5fd" stroke-width="1.5" stroke-dasharray="4" />`;
    }
    // Connect last to first to close pattern? Optional. Let's not close it physically to show start/end.
    svg += lines;

    // Draw bolt circles and texts
    let dots = '';
    for (let i = 1; i <= totalBolts; i++) {
      const p = getCoords(i);
      // Find its rank in the sequence (1st step, 2nd step...)
      const stepOrder = seq.indexOf(i) + 1;
      
      const isFirst = stepOrder === 1;
      const isSecond = stepOrder === 2;
      const fill = isFirst ? '#1e40af' : (isSecond ? '#3b82f6' : '#ffffff');
      const textFill = isFirst || isSecond ? '#ffffff' : '#1e3a8a';
      const stroke = isFirst || isSecond ? 'none' : '#94a3b8';

      dots += `<circle cx="${p.x}" cy="${p.y}" r="12" fill="${fill}" stroke="${stroke}" stroke-width="1" />`;
      dots += `<text x="${p.x}" y="${p.y}" fill="${textFill}" font-size="${fontSize}" font-family="sans-serif" font-weight="bold" text-anchor="middle" dominant-baseline="central">${stepOrder}</text>`;
    }
    svg += dots;
    svg += `</svg>`;
    return svg;
  };

  const updateBolting = () => {
    const count = boltCount.value;
    const seqStr = sequences[count];
    if (seqStr) {
      boltingResult.innerText = seqStr;
      svgContainer.innerHTML = drawBoltingSVG(Number(count), seqStr);
    } else {
      boltingResult.innerText = "패턴 정보 없음";
      svgContainer.innerHTML = '';
    }
  };

  boltCount.addEventListener('change', updateBolting);
  updateBolting(); // Initial Render
}
