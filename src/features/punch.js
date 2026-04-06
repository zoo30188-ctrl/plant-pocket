import { savePunch, getPunches, deletePunch } from '../utils/db.js';

export function initPunch() {
  const photoInput = document.getElementById('punchPhotoInput');
  const previewContainer = document.getElementById('photoPreviewContainer');
  const canvas = document.getElementById('drawingCanvas');
  const clearCanvasBtn = document.getElementById('clearCanvasBtn');
  const eqNoInput = document.getElementById('punchEqNo');
  const descInput = document.getElementById('punchDesc');
  const saveBtn = document.getElementById('punchSaveBtn');
  const listContainer = document.getElementById('punchListContainer');
  const exportBtn = document.getElementById('exportHtmlBtn');

  let ctx = null;
  if (canvas) {
    ctx = canvas.getContext('2d');
  }

  let baseImageObj = null; // Store original resized image to allow clear
  let isImageLoaded = false;
  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;

  // Handle Photo input (resize locally before displaying/saving)
  photoInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Resize down to max 800px width/height to save DB space
        let width = img.width;
        let height = img.height;
        const max = 800;

        if (width > height && width > max) {
          height *= max / width;
          width = max;
        } else if (height > max) {
          width *= max / height;
          height = max;
        }
        
        canvas.width = width;
        canvas.height = height;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, width, height);
        
        baseImageObj = img;
        isImageLoaded = true;
        previewContainer.style.display = 'block';
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });

  // Canvas Drawing Logic
  const getPos = (e) => {
    const rect = canvas.getBoundingClientRect();
    // Calculate scale because canvas CSS size might differ from actual width/height
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX, clientY;
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e) => {
    if (!isImageLoaded) return;
    e.preventDefault();
    isDrawing = true;
    const pos = getPos(e);
    lastX = pos.x;
    lastY = pos.y;
  };

  const draw = (e) => {
    if (!isDrawing || !isImageLoaded) return;
    e.preventDefault();
    const pos = getPos(e);

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = '#ef4444'; // Red color
    ctx.lineWidth = Math.max(3, canvas.width / 150); // Scale line width
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    lastX = pos.x;
    lastY = pos.y;
  };

  const stopDrawing = (e) => {
    if (isDrawing) {
      e.preventDefault();
      isDrawing = false;
    }
  };

  if (canvas) {
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    canvas.addEventListener('touchstart', startDrawing, {passive: false});
    canvas.addEventListener('touchmove', draw, {passive: false});
    canvas.addEventListener('touchend', stopDrawing);
    canvas.addEventListener('touchcancel', stopDrawing);
  }

  // Clear Canvas (Redraw base)
  if (clearCanvasBtn) {
    clearCanvasBtn.addEventListener('click', () => {
      if (isImageLoaded && baseImageObj) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(baseImageObj, 0, 0, canvas.width, canvas.height);
      }
    });
  }

  // Save Punch
  saveBtn.addEventListener('click', async () => {
    const eqNo = eqNoInput.value.trim();
    const desc = descInput.value.trim();

    let finalImageBase64 = null;
    if (isImageLoaded) {
      finalImageBase64 = canvas.toDataURL('image/jpeg', 0.8);
    }

    if (!eqNo && !desc && !finalImageBase64) {
      alert("내용이나 사진을 입력해주세요.");
      return;
    }

    const punch = {
      eqNo: eqNo || 'No Eq No.',
      desc: desc || '',
      image: finalImageBase64,
      date: new Date().toISOString()
    };

    saveBtn.innerText = "저장 중...";
    try {
      await savePunch(punch);
      // Reset form
      eqNoInput.value = '';
      descInput.value = '';
      isImageLoaded = false;
      baseImageObj = null;
      photoInput.value = '';
      previewContainer.style.display = 'none';
      if(ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      await loadPunchList();
    } catch(err) {
      alert("저장 실패: " + err.message);
    } finally {
      saveBtn.innerText = "💾 내 폰에 저장";
    }
  });

  // HTML Export Logic
  if (exportBtn) {
    exportBtn.addEventListener('click', async () => {
      exportBtn.innerText = "생성 중...";
      try {
        const punches = await getPunches();
        if (punches.length === 0) {
          alert("내보낼 펀치 기록이 없습니다.");
          return;
        }
        
        // Sort newest first
        punches.sort((a,b) => new Date(b.date) - new Date(a.date));
        
        let htmlStr = `<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"><title>Plant Pocket 결함 리포트</title>
        <style>
          body { font-family: 'Malgun Gothic', sans-serif; padding: 20px; max-width: 800px; margin: auto; color: #333; } 
          h1 { color: #047857; border-bottom: 2px solid #047857; padding-bottom: 10px; }
          .item { border: 1px solid #cbd5e1; padding: 15px; margin-bottom: 20px; border-radius: 8px; page-break-inside: avoid; } 
          .header { display: flex; justify-content: space-between; align-items: baseline; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 10px; }
          .eqno { font-size: 1.25rem; font-weight: bold; color: #1e3a8a; margin: 0; }
          .date { font-size: 0.85rem; color: #64748b; }
          .desc { white-space: pre-wrap; margin-bottom: 15px; font-size: 0.95rem; }
          img { max-width: 100%; max-height: 400px; border: 1px solid #e2e8f0; border-radius: 4px; }
        </style></head><body>`;
        htmlStr += `<h1>Plant Pocket 현장 펀치 대장</h1><p style="text-align:right;">생성 일시: ${new Date().toLocaleString()}</p>`;
        
        punches.forEach(p => {
          htmlStr += `<div class="item">
            <div class="header">
              <p class="eqno">[${escapeHTML(p.eqNo)}]</p>
              <span class="date">기록일: ${new Date(p.date).toLocaleString()}</span>
            </div>
            <p class="desc">${escapeHTML(p.desc)}</p>
            ${p.image ? `<img src="${p.image}" />` : ''}
          </div>`;
        });
        htmlStr += `</body></html>`;
        
        const blob = new Blob([htmlStr], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const filenameDate = new Date().toISOString().slice(0,10);
        a.download = `Plant_Pocket_Report_${filenameDate}.html`;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, 100);
      } catch (err) {
        alert("내보내기 실패: " + err.message);
      } finally {
        exportBtn.innerText = "📄 리포트 내보내기";
      }
    });
  }

  // Load and display list
  async function loadPunchList() {
    try {
      const punches = await getPunches();
      if (punches.length === 0) {
        listContainer.innerHTML = '<p style="color:var(--text-muted); text-align:center;">저장된 기록이 없습니다.</p>';
        return;
      }

      // Sort newest first
      punches.sort((a,b) => new Date(b.date) - new Date(a.date));

      listContainer.innerHTML = punches.map(p => `
        <div class="card" style="margin-bottom: 1rem;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 0.5rem;">
            <strong>${escapeHTML(p.eqNo)}</strong>
            <span style="font-size:0.8rem; color:var(--text-muted);">${new Date(p.date).toLocaleString()}</span>
          </div>
          <p style="margin-bottom: ${p.image ? '1rem' : '0'}; white-space:pre-wrap;">${escapeHTML(p.desc)}</p>
          ${p.image ? `<img src="${p.image}" style="max-width:100%; border-radius:4px; margin-bottom:1rem;" />` : ''}
          <div style="display:flex; gap:0.5rem;">
            <button class="btn btn-secondary btn-copy-punch" data-text="[${escapeHTML(p.eqNo)}] ${escapeHTML(p.desc)}">📋 텍스트 복사</button>
            <button class="btn btn-secondary btn-delete-punch" data-id="${p.id}" style="color:red; flex:0.4;">삭제</button>
          </div>
        </div>
      `).join('');

      // Add events
      document.querySelectorAll('.btn-delete-punch').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          if(confirm('삭제하시겠습니까?')) {
            await deletePunch(Number(e.target.dataset.id));
            loadPunchList();
          }
        });
      });

      document.querySelectorAll('.btn-copy-punch').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const text = e.target.dataset.text;
          navigator.clipboard.writeText(text).then(() => {
            const org = e.target.innerText;
            e.target.innerText = "✅ 복사됨";
            setTimeout(() => e.target.innerText = org, 2000);
          });
        });
      });

    } catch(err) {
      console.error(err);
    }
  }

  // HTML escaping for safety
  function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }

  // Initial load
  loadPunchList();
}
