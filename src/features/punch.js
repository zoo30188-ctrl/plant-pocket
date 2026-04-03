import { savePunch, getPunches, deletePunch } from '../utils/db.js';

export function initPunch() {
  const photoInput = document.getElementById('punchPhotoInput');
  const photoPreview = document.getElementById('photoPreview');
  const previewContainer = document.getElementById('photoPreviewContainer');
  const eqNoInput = document.getElementById('punchEqNo');
  const descInput = document.getElementById('punchDesc');
  const saveBtn = document.getElementById('punchSaveBtn');
  const listContainer = document.getElementById('punchListContainer');

  let currentImageBase64 = null;

  // Handle Photo input (resize locally before displaying/saving)
  photoInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Resize down to max 800px width/height to save DB space
        const canvas = document.createElement('canvas');
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
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        currentImageBase64 = canvas.toDataURL('image/jpeg', 0.8);
        photoPreview.src = currentImageBase64;
        previewContainer.style.display = 'block';
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });

  // Save Punch
  saveBtn.addEventListener('click', async () => {
    const eqNo = eqNoInput.value.trim();
    const desc = descInput.value.trim();

    if (!eqNo && !desc && !currentImageBase64) {
      alert("내용이나 사진을 입력해주세요.");
      return;
    }

    const punch = {
      eqNo: eqNo || 'No Eq No.',
      desc: desc || '',
      image: currentImageBase64,
      date: new Date().toISOString()
    };

    saveBtn.innerText = "저장 중...";
    try {
      await savePunch(punch);
      // Reset form
      eqNoInput.value = '';
      descInput.value = '';
      currentImageBase64 = null;
      photoInput.value = '';
      previewContainer.style.display = 'none';
      photoPreview.src = '';
      
      await loadPunchList();
    } catch(err) {
      alert("저장 실패: " + err.message);
    } finally {
      saveBtn.innerText = "💾 내 폰에 저장";
    }
  });

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
