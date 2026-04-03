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

  // Bolting Sequence
  const boltCount = document.getElementById('boltCount');
  const boltingResult = document.getElementById('boltingResult');

  const sequences = {
    "4": "1 - 3 - 2 - 4",
    "8": "1 - 5 - 3 - 7 - 2 - 6 - 4 - 8",
    "12": "1 - 7 - 4 - 10 - 2 - 8 - 5 - 11 - 3 - 9 - 6 - 12",
    "16": "1 - 9 - 5 - 13 - 3 - 11 - 7 - 15 - 2 - 10 - 6 - 14 - 4 - 12 - 8 - 16",
    "20": "1 - 11 - 6 - 16 - 3 - 13 - 8 - 18 - 5 - 15 - 10 - 20 - 2 - 12 - 7 - 17 - 4 - 14 - 9 - 19",
    "24": "1 - 13 - 7 - 19 - 4 - 16 - 10 - 22 - 2 - 14 - 8 - 20 - 5 - 17 - 11 - 23 - 3 - 15 - 9 - 21 - 6 - 18 - 12 - 24"
  };

  boltCount.addEventListener('change', (e) => {
    boltingResult.innerText = sequences[e.target.value] || "패턴 정보 없음";
  });
}
