const buttons = document.querySelectorAll('button[data-scenario-id]');
const playerCountSelect = document.getElementById('playerCount');
const startGameBtn = document.getElementById('startGameBtn');
const qrCodesDiv = document.getElementById('qrCodes');

let selectedScenarioId = null;

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    buttons.forEach(b => b.style.backgroundColor = '');
    btn.style.backgroundColor = '#4CAF50';
    selectedScenarioId = btn.getAttribute('data-scenario-id');
  });
});

startGameBtn.addEventListener('click', async () => {
  if (!selectedScenarioId) {
    alert('لطفاً یک سناریو انتخاب کنید');
    return;
  }

  const playerCount = Number(playerCountSelect.value);

  // برای نمونه فرض می‌کنیم نقش‌ها عددی از 1 تا playerCount باشند
  const selected_roles = [];
  for (let i = 1; i <= playerCount; i++) {
    selected_roles.push(i.toString());
  }

  try {
    const res = await fetch('/api/games', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        scenario_id: selectedScenarioId,
        player_count: playerCount,
        selected_roles
      })
    });

    if (!res.ok) {
      const error = await res.json();
      alert('خطا: ' + (error.error || 'نامشخص'));
      return;
    }

    const data = await res.json();
    const gameId = data.gameId;

    // نمایش QR کدها (برای هر بازیکن یک لینک جداگانه به شکل ثابت)
    qrCodesDiv.innerHTML = '';

    for (let i = 1; i <= playerCount; i++) {
      const qrDiv = document.createElement('div');
      qrDiv.className = 'qrItem';

      const roleLink = `https://yourdomain.com/game/${gameId}/player/${i}`;

      // لینک و شماره بازیکن
      qrDiv.innerHTML = `
        <div>بازیکن ${i}</div>
        <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(roleLink)}" alt="QR Code Player ${i}" />
        <div><a href="${roleLink}" target="_blank">مشاهده نقش</a></div>
      `;

      qrCodesDiv.appendChild(qrDiv);
    }

  } catch (err) {
    alert('خطا در برقراری ارتباط با سرور');
    console.error(err);
  }
});
