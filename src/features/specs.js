import { PIPING_SPECS, FLANGE_SPECS } from '../data/specs.js';

export function initSpecs() {
  const pipeNps = document.getElementById('pipeNps');
  const pipeSch = document.getElementById('pipeSch');
  const pipeResult = document.getElementById('pipeResult');
  const pipeCopyBtn = document.getElementById('pipeCopyBtn');

  const updatePipeResult = () => {
    const nps = pipeNps.value;
    const sch = pipeSch.value;
    if (nps && sch) {
      const od = PIPING_SPECS.OD[nps];
      const thk = PIPING_SPECS.THK[nps] ? PIPING_SPECS.THK[nps][sch] : null;

      if (od && thk) {
        const id = (od - thk * 2).toFixed(2);
        pipeResult.innerHTML = `<strong>NPS ${nps} - Sch ${sch}</strong>\n외경 (O.D) : ${od} mm\n두께 (Thk) : ${thk} mm\n내경 (I.D) : ${id} mm`;
        pipeCopyBtn.style.display = 'block';
        pipeCopyBtn.onclick = () => copyText(pipeResult.innerText, pipeCopyBtn);
      } else {
        pipeResult.innerHTML = "해당하는 스케줄 규격이 없습니다.";
        pipeCopyBtn.style.display = 'none';
      }
    }
  };

  pipeNps.addEventListener('change', updatePipeResult);
  pipeSch.addEventListener('change', updatePipeResult);

  const flangeClass = document.getElementById('flangeClass');
  const flangeNps = document.getElementById('flangeNps');
  const flangeResult = document.getElementById('flangeResult');
  const flangeCopyBtn = document.getElementById('flangeCopyBtn');

  const updateFlangeResult = () => {
    const cls = flangeClass.value;
    const nps = flangeNps.value;
    if (cls && nps) {
      const data = FLANGE_SPECS[cls] ? FLANGE_SPECS[cls][nps] : null;
      if (data) {
        flangeResult.innerHTML = `<strong>${cls}# - NPS ${nps}</strong>\n볼트 수량 : ${data.bolts} EA\n볼트 규격 : ${data.size}`;
        flangeCopyBtn.style.display = 'block';
        flangeCopyBtn.onclick = () => copyText(flangeResult.innerText, flangeCopyBtn);
      } else {
        flangeResult.innerHTML = "해당하는 플랜지 규격이 없습니다.";
        flangeCopyBtn.style.display = 'none';
      }
    }
  };

  flangeClass.addEventListener('change', updateFlangeResult);
  flangeNps.addEventListener('change', updateFlangeResult);

  function copyText(text, btn) {
    navigator.clipboard.writeText(text).then(() => {
      const originalText = btn.innerText;
      btn.innerText = "✅ 복사 완료!";
      setTimeout(() => btn.innerText = originalText, 2000);
    });
  }
}
