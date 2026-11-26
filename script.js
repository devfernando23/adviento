/**
 * CALENDARIO DE ADVIENTO DE AMOR - LÓGICA PRINCIPAL
 */

// Estado de la aplicación
const AppState = {
  openedDays: JSON.parse(localStorage.getItem('adviento_opened_days') || '[]'),
  coupons: JSON.parse(localStorage.getItem('adviento_coupons') || '{}'),
  previewMode: localStorage.getItem('adviento_preview_mode') === 'true',
  audioEnabled: false,
  snowEnabled: true,
  currentModalDay: null
};

// Web Audio API para efectos de sonido (chimes y besos)
let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

// Reproduce campanilla suave (chime navideño) al abrir puerta
function playChimeSound() {
  try {
    initAudio();
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, index) => {
      setTimeout(() => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.2);
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.start();
        osc.stop(audioCtx.currentTime + 1.2);
      }, index * 90);
    });
  } catch (e) {
    console.log("Audio no habilitado todavía");
  }
}

// Sonido tierno al enviar un beso
function playKissSound() {
  try {
    initAudio();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(400, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.2);
  } catch (e) {}
}

// ==========================================
// CONTROL DE FECHAS Y ACCESO
// ==========================================
function isDateUnlocked(dia) {
  // En Modo Pruebas, todas las casillas están habilitadas
  if (AppState.previewMode) {
    return true;
  }

  const now = new Date();
  const mesActual = now.getMonth(); // 0 = Enero, 10 = Noviembre, 11 = Diciembre
  const diaActual = now.getDate();

  // Si NO estamos en diciembre, ninguna tarjeta se puede abrir aún
  if (mesActual !== 11) {
    return false;
  }

  // Si ya estamos en diciembre, solo se abren los días que ya llegaron
  return diaActual >= dia;
}

function getCalendarDayStatus(dia) {
  const unlocked = isDateUnlocked(dia);

  // Si la fecha aún no llega, está estrictamente bloqueada
  if (!unlocked) {
    return 'locked';
  }

  // Si ya llegó la fecha y ya se volteó anteriormente
  if (AppState.openedDays.includes(dia)) {
    return 'opened';
  }

  // Si ya llegó la fecha pero aún no se abre
  return 'available';
}

// ==========================================
// RENDERIZADO DE LA GRILLA (3D FLIP CARDS)
// ==========================================
function renderCalendar() {
  const grid = document.getElementById('calendar-grid');
  if (!grid) return;
  grid.innerHTML = '';

  DIAS_ADVIENTO.forEach(item => {
    const status = getCalendarDayStatus(item.dia);
    // Sincronizar el campo status ('abierto' o 'cerrado')
    item.status = (status === 'opened') ? 'abierto' : 'cerrado';
    // Solo puede estar volteada si la fecha está desbloqueada y ya fue abierta
    const isFlipped = (status === 'opened');

    const card = document.createElement('div');
    card.className = `advent-card ${status} ${isFlipped ? 'flipped' : ''} ${item.dia === 24 ? 'day-24' : ''}`;
    card.dataset.day = item.dia;

    let typeName = 'Carta';
    if (item.tipo === 'cupon') typeName = 'Cupón';
    else if (item.tipo === 'raspa') typeName = 'Rasca y Gana';
    else if (item.tipo === 'ruleta') typeName = 'Ruleta';
    else if (item.tipo === 'besos') typeName = 'Besos';
    else if (item.tipo === 'recuerdos') typeName = 'Recuerdos';

    card.innerHTML = `
      <div class="card-inner">
        <!-- CARA FRONTAL: SOLO EL NÚMERO (MISTERIOSO, SIN SPOILERS) -->
        <div class="card-front">
          <div class="front-ribbon-v"></div>
          <div class="front-ribbon-h"></div>
          <div class="front-brand-title">24 Días Contigo 💛</div>
          <div class="front-seal">
            <span class="front-seal-heart">♥</span>
            <span class="front-day-number">${item.dia}</span>
          </div>
          <div class="front-status-hint">
            ${status === 'locked' ? `🔒 Se abre el ${item.dia} de Dic` : (isFlipped ? '✨ Ya revelado' : '🎁 Toca para abrir')}
          </div>
        </div>

        <!-- CARA TRASERA: CONTENIDO REVELADO AL VOLTEAR -->
        <div class="card-back">
          <div class="back-header">
            <span>Día ${item.dia}</span>
            <span>✨</span>
          </div>
          <div class="back-content">
            <div class="back-icon">${item.icono}</div>
            <span class="back-type-pill">${typeName}</span>
            <div class="back-title">${item.titulo}</div>
          </div>
          <button class="back-btn" type="button">
            Ver detalle ✨
          </button>
        </div>
      </div>
    `;

    card.addEventListener('click', () => handleCardClick(item, card));
    grid.appendChild(card);
  });

  updateProgress();
  updateWalletBadge();
}

function updateProgress() {
  const total = DIAS_ADVIENTO.length;
  // Solo contar días que son válidamente abiertos
  const opened = AppState.openedDays.filter(dia => isDateUnlocked(dia)).length;
  const pct = Math.round((opened / total) * 100);

  const welcomeFill = document.getElementById('welcome-progress-fill');
  const welcomeText = document.getElementById('welcome-progress-text');
  if (welcomeFill) welcomeFill.style.width = `${pct}%`;
  if (welcomeText) welcomeText.innerText = `${opened} de ${total} sorpresas abiertas (${pct}%)`;
}

// ==========================================
// MODAL DE BIENVENIDA (Al cargar la página)
// ==========================================
function openWelcomeModal() {
  const modal = document.getElementById('welcome-modal');
  if (modal) {
    updateProgress();
    modal.classList.add('active');
  }
}

function closeWelcomeModal() {
  const modal = document.getElementById('welcome-modal');
  if (modal) {
    modal.classList.remove('active');
    playChimeSound();
    // Enfocar suavemente la tarjeta del día actual al cerrar la bienvenida
    setTimeout(() => {
      scrollToCurrentDay(true);
    }, 150);
  }
}

// ==========================================
// GESTIÓN DE CLICKS Y VOLTEO (FLIP)
// ==========================================
function handleCardClick(item, cardElement) {
  const status = getCalendarDayStatus(item.dia);

  // Si está bloqueado por fecha, NO se voltea
  if (status === 'locked') {
    shakeCard(item.dia);
    const now = new Date();
    const mesActual = now.getMonth();

    if (mesActual !== 12) {
      alert(`¡Aún no es diciembre, mi Fio! ❤️🎄\n\nEste calendario comienza el 1 de Diciembre. La sorpresa #${item.dia} se abrirá el ${item.dia} de Diciembre.`);
    } else {
      alert(`¡Paciencia, mi Fio! ❤️\n\nEsta sorpresa se desbloqueará el ${item.dia} de Diciembre.`);
    }
    return;
  }

  const isAlreadyFlipped = cardElement.classList.contains('flipped');

  // Si ya estaba volteada, abrir directamente el modal con el detalle
  if (isAlreadyFlipped) {
    openModal(item);
    return;
  }

  // Si es la primera vez que se presiona: VOLTEAR LA TARJETA (FLIP)
  cardElement.classList.add('flipped');
  playChimeSound();
  launchConfetti();

  // Guardar en progreso y notificar primera apertura
  if (!AppState.openedDays.includes(item.dia)) {
    AppState.openedDays.push(item.dia);
    localStorage.setItem('adviento_opened_days', JSON.stringify(AppState.openedDays));
    item.status = 'abierto';

    // Enviar notificación a Telegram
    const tipoEmoji = item.tipo === 'cupon' ? '🎟️ Cupón' : (item.tipo === 'carta' ? '💌 Carta' : (item.tipo === 'raspa' ? '🪄 Rasca y Gana' : '✨ Detalle'));
    notificarTelegram(
      `❤️ <b>¡Fio abrió el Día ${item.dia}!</b>\n\n` +
      `🎁 <b>Sorpresa:</b> ${item.titulo}\n` +
      `📂 <b>Tipo:</b> ${tipoEmoji}\n` +
      (item.cupon ? `🎟️ <b>Cupón desbloqueado:</b> ${item.cupon.titulo}\n` : '') +
      `⏰ <i>${new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} - ${new Date().toLocaleDateString('es-ES')}</i>`
    );
  }

  // Guardar cupón en billetera automáticamente si aplica
  if (item.tipo === 'cupon' && item.cupon) {
    if (!AppState.coupons[item.cupon.id]) {
      AppState.coupons[item.cupon.id] = {
        id: item.cupon.id,
        dia: item.dia,
        titulo: item.cupon.titulo,
        descripcion: item.cupon.descripcion,
        icono: item.cupon.icono,
        canjeado: false,
        fechaCanje: null
      };
      localStorage.setItem('adviento_coupons', JSON.stringify(AppState.coupons));
    }
  }

  updateProgress();
  updateWalletBadge();

  // Esperar a que termine la animación de volteo para abrir el modal interactivo
  setTimeout(() => {
    openModal(item);
  }, 750);
}

function shakeCard(dia) {
  const card = document.querySelector(`.advent-card[data-day="${dia}"]`);
  if (card) {
    card.classList.add('shake-anim');
    setTimeout(() => card.classList.remove('shake-anim'), 500);
  }
}

// ==========================================
// MODAL DE DETALLE DIARIO
// ==========================================
function openModal(item) {
  AppState.currentModalDay = item;
  const modalOverlay = document.getElementById('day-modal');
  const modalBody = document.getElementById('modal-dynamic-content');
  const dayTag = document.getElementById('modal-day-tag');
  const modalTitle = document.getElementById('modal-title');
  const modalSubtitle = document.getElementById('modal-subtitle');

  if (!modalOverlay || !modalBody) return;

  dayTag.innerText = `Día ${item.dia} de Diciembre • ${item.icono}`;
  modalTitle.innerText = item.titulo;
  modalSubtitle.innerText = item.subtitulo || '';

  // Renderizar contenido dinámico según el tipo
  let contentHtml = `<p class="modal-text" style="margin-bottom:15px;">${item.contenido}</p>`;

  if (item.tipo === 'cupon') {
    const c = item.cupon;
    const isRedeemed = AppState.coupons[c.id]?.canjeado;
    contentHtml += `
      <div class="coupon-box" id="modal-coupon-box">
        ${isRedeemed ? '<div class="redeemed-stamp">¡CANJEADO!</div>' : ''}
        <div class="coupon-header">
          <span class="coupon-icon">${c.icono}</span>
          <div>
            <div class="coupon-title">${c.titulo}</div>
            <span style="font-size:0.75rem; color:#f59e0b; text-transform:uppercase;">Cupón Oficial de Amor</span>
          </div>
        </div>
        <p class="coupon-desc">${c.descripcion}</p>
        <div class="coupon-footer">
          <span>Emitido por: ${CONFIG.nombreEl}</span>
          <span>Para: ${CONFIG.nombreElla} ❤️</span>
        </div>
      </div>
      <button class="btn-primary" onclick="canjearDesdeModal('${c.id}')" ${isRedeemed ? 'disabled style="opacity:0.6; cursor:not-allowed;"' : ''}>
        ${isRedeemed ? '✅ Cupón ya canjeado' : '🎟️ Canjear este cupón con ' + CONFIG.nombreEl}
      </button>
    `;
  } else if (item.tipo === 'recuerdos' && item.lista) {
    contentHtml += `
      <ul class="reasons-list">
        ${item.lista.map((razon, idx) => `<li><strong>${idx + 1}.</strong> ${razon}</li>`).join('')}
      </ul>
    `;
  } else if (item.tipo === 'raspa') {
    contentHtml += `
      <div class="scratch-container" id="scratch-wrapper">
        <div class="scratch-secret">${item.secreto}</div>
        <canvas class="scratch-canvas" id="scratch-canvas"></canvas>
      </div>
      <p style="text-align:center; font-size:0.85rem; color:#94a3b8;">✨ Pasa tu dedo o cursor sobre la tarjeta dorada para raspar</p>
    `;
  } else if (item.tipo === 'ruleta') {
    contentHtml += `
      <div class="roulette-container">
        <div style="position:relative; display:inline-block;">
          <div class="roulette-pointer"></div>
          <div class="roulette-wheel" id="roulette-wheel"></div>
        </div>
        <div class="roulette-result" id="roulette-result">¿Listos para girar? ¡Haz click abajo!</div>
        <button class="btn-primary" id="btn-spin-roulette" onclick="spinRoulette()">🎯 Girar Ruleta de Citas</button>
      </div>
    `;
  } else if (item.tipo === 'besos') {
    contentHtml += `
      <div class="jar-container" id="jar-container">
        <button class="jar-icon-btn" onclick="spawnKiss(event)">🍯</button>
        <p style="margin-top:10px; font-weight:600; color:#fda4af;">Toca el frasco para enviar besos ilimitados</p>
        <p id="kiss-count" style="font-size:0.85rem; color:#94a3b8; margin-top:5px;">Besos enviados en esta sesión: 0</p>
      </div>
    `;
  } else if (item.tipo === 'carta') {
    if (item.fraseDestacada) {
      contentHtml += `
        <div style="background:rgba(225,29,72,0.15); border-left:4px solid #e11d48; padding:12px 18px; border-radius:8px; font-style:italic; margin:15px 0;">
          ${item.fraseDestacada}
        </div>
      `;
    }
    if (item.firma) {
      contentHtml += `<div style="text-align:right; font-family:var(--font-title); font-size:1.1rem; color:#f59e0b; margin-top:15px;">${item.firma}</div>`;
    }
  }

  modalBody.innerHTML = contentHtml;
  modalOverlay.classList.add('active');

  // Inicializar Canvas Rascable si aplica
  if (item.tipo === 'raspa') {
    setTimeout(initScratchCard, 80);
  }
}

function closeModal() {
  const modalOverlay = document.getElementById('day-modal');
  if (modalOverlay) modalOverlay.classList.remove('active');
  AppState.currentModalDay = null;
}

// ==========================================
// JUEGO DE RASCAR (SCRATCH CARD)
// ==========================================
function initScratchCard() {
  const canvas = document.getElementById('scratch-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const rect = canvas.getBoundingClientRect();
  
  canvas.width = rect.width;
  canvas.height = rect.height;

  // Pintar fondo raspable brillante con patrón festivo
  const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  grad.addColorStop(0, '#f59e0b');
  grad.addColorStop(0.5, '#fbbf24');
  grad.addColorStop(1, '#d97706');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Texto sobre el raspable
  ctx.font = 'bold 15px Poppins, sans-serif';
  ctx.fillStyle = '#78350f';
  ctx.textAlign = 'center';
  ctx.fillText('✨ RASPA AQUÍ CON AMOR ✨', canvas.width / 2, canvas.height / 2 + 5);

  let isDrawing = false;
  let scratchedPixels = 0;

  function scratch(x, y) {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 18, 0, Math.PI * 2);
    ctx.fill();
    scratchedPixels++;
    if (scratchedPixels === 40) {
      launchConfetti();
    }
  }

  function getPos(e) {
    const box = canvas.getBoundingClientRect();
    if (e.touches && e.touches[0]) {
      return {
        x: e.touches[0].clientX - box.left,
        y: e.touches[0].clientY - box.top
      };
    }
    return {
      x: e.clientX - box.left,
      y: e.clientY - box.top
    };
  }

  canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    const pos = getPos(e);
    scratch(pos.x, pos.y);
  });

  window.addEventListener('mouseup', () => { isDrawing = false; });

  canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;
    const pos = getPos(e);
    scratch(pos.x, pos.y);
  });

  // Eventos táctiles para móviles
  canvas.addEventListener('touchstart', (e) => {
    isDrawing = true;
    const pos = getPos(e);
    scratch(pos.x, pos.y);
    e.preventDefault();
  }, { passive: false });

  canvas.addEventListener('touchmove', (e) => {
    if (!isDrawing) return;
    const pos = getPos(e);
    scratch(pos.x, pos.y);
    e.preventDefault();
  }, { passive: false });

  canvas.addEventListener('touchend', () => { isDrawing = false; });
}

// ==========================================
// RULETA DE CITAS
// ==========================================
let isSpinning = false;
function spinRoulette() {
  if (isSpinning) return;
  const wheel = document.getElementById('roulette-wheel');
  const result = document.getElementById('roulette-result');
  const btn = document.getElementById('btn-spin-roulette');
  if (!wheel || !result) return;

  isSpinning = true;
  btn.disabled = true;
  result.innerHTML = '🎡 Girando el destino del amor...';

  const dayData = AppState.currentModalDay;
  const opciones = dayData?.opcionesRuleta || [
    "Picnic romántico 🧺",
    "Cena con velas 🕯️",
    "Noche de películas 🎬",
    "Paseo navideño 🎄"
  ];

  // Cálculo aleatorio de giros
  const randomSpins = 5 + Math.floor(Math.random() * 5); // 5 a 10 vueltas completas
  const selectedIndex = Math.floor(Math.random() * opciones.length);
  const degreesPerSection = 360 / opciones.length;
  const targetRotation = (randomSpins * 360) + (selectedIndex * degreesPerSection);

  wheel.style.transform = `rotate(${targetRotation}deg)`;

  setTimeout(() => {
    isSpinning = false;
    btn.disabled = false;
    result.innerHTML = `🎉 ¡Cita seleccionada!: <strong style="color:#fde047; margin-left:6px;">${opciones[selectedIndex]}</strong>`;
    launchConfetti();
    playChimeSound();
  }, 3600);
}

// ==========================================
// FRASCO DE BESOS INFINITOS
// ==========================================
let sessionKissCount = 0;
function spawnKiss(event) {
  playKissSound();
  sessionKissCount++;
  const countEl = document.getElementById('kiss-count');
  if (countEl) countEl.innerText = `Besos enviados en esta sesión: ${sessionKissCount} 💋`;

  const container = document.getElementById('jar-container');
  if (!container) return;

  const kiss = document.createElement('div');
  kiss.className = 'floating-kiss';
  const emojis = ['💋', '💖', '🥰', '😘', '❤️', '✨'];
  kiss.innerText = emojis[Math.floor(Math.random() * emojis.length)];

  // Posición aleatoria
  const drift = (Math.random() - 0.5) * 120;
  kiss.style.setProperty('--drift', `${drift}px`);
  kiss.style.left = `calc(50% - 15px + ${(Math.random() - 0.5) * 60}px)`;
  kiss.style.top = '40%';

  container.appendChild(kiss);
  setTimeout(() => kiss.remove(), 1500);
}

// ==========================================
// BILLETERA DE CUPONES
// ==========================================
function updateWalletBadge() {
  const badge = document.getElementById('wallet-count');
  if (!badge) return;
  const count = Object.keys(AppState.coupons).length;
  badge.innerText = count;
}

function openWalletModal() {
  const modal = document.getElementById('wallet-modal');
  if (!modal) return;
  renderWalletList('todos');
  modal.classList.add('active');
}

function closeWalletModal() {
  const modal = document.getElementById('wallet-modal');
  if (modal) modal.classList.remove('active');
}

function renderWalletList(filter) {
  const list = document.getElementById('wallet-list');
  if (!list) return;

  const couponsArr = Object.values(AppState.coupons);
  let filtered = couponsArr;

  if (filter === 'disponibles') {
    filtered = couponsArr.filter(c => !c.canjeado);
  } else if (filter === 'canjeados') {
    filtered = couponsArr.filter(c => c.canjeado);
  }

  if (filtered.length === 0) {
    list.innerHTML = `
      <div class="wallet-empty">
        <p style="font-size:2.5rem; margin-bottom:10px;">🎟️</p>
        <p>Aún no tienes cupones en esta sección.</p>
        <p style="font-size:0.85rem; color:#94a3b8; margin-top:6px;">Abre más puertas del calendario de adviento para desbloquearlos.</p>
      </div>
    `;
    return;
  }

  list.innerHTML = filtered.map(c => `
    <div class="coupon-box" style="margin: 8px 0;">
      ${c.canjeado ? '<div class="redeemed-stamp">¡CANJEADO!</div>' : ''}
      <div class="coupon-header">
        <span class="coupon-icon">${c.icono}</span>
        <div>
          <div class="coupon-title">${c.titulo}</div>
          <span style="font-size:0.75rem; color:#f59e0b;">Desbloqueado el Día ${c.dia} de Diciembre</span>
        </div>
      </div>
      <p class="coupon-desc">${c.descripcion}</p>
      <div class="coupon-footer">
        <span>${c.canjeado ? 'Canjeado el ' + c.fechaCanje : 'Estado: Disponible para canjear'}</span>
        ${!c.canjeado ? `<button class="btn-secondary" style="padding:4px 12px; font-size:0.8rem;" onclick="canjearCupon('${c.id}')">Canjear Ahora</button>` : ''}
      </div>
    </div>
  `).join('');
}

function filterWallet(tipo, btn) {
  document.querySelectorAll('.wallet-filter-tabs .tab-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderWalletList(tipo);
}

function canjearDesdeModal(couponId) {
  canjearCupon(couponId);
  // Reabrir modal del día para ver el sello de canjeado
  if (AppState.currentModalDay) {
    openModal(AppState.currentModalDay);
  }
}

function canjearCupon(couponId) {
  const c = AppState.coupons[couponId];
  if (!c) return;

  const confirmAction = confirm(`¿Quieres canjear el cupón:\n"${c.titulo}" con ${CONFIG.nombreEl}? ❤️\n\nAl confirmar, quedará marcado como canjeado.`);
  if (!confirmAction) return;

  c.canjeado = true;
  const now = new Date();
  c.fechaCanje = now.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
  localStorage.setItem('adviento_coupons', JSON.stringify(AppState.coupons));

  // Notificar por Telegram el canje del cupón
  notificarTelegram(
    `🎉 <b>¡CUPÓN CANJEADO POR TU NOVIA!</b>\n\n` +
    `🎟️ <b>Cupón:</b> ${c.titulo}\n` +
    `📅 <b>Día ${c.dia}</b>: ${c.descripcion}\n` +
    `⏰ <i>Fecha: ${c.fechaCanje}</i>\n\n` +
    `👉 <i>¡Es momento de cumplirle este detalle con todo tu amor! 🥰</i>`
  );

  launchConfetti();
  playChimeSound();
  alert(`🎉 ¡Cupón canjeado con éxito!\nMuéstrale esta pantalla a ${CONFIG.nombreEl} para hacer válido tu beneficio.`);

  renderWalletList('todos');
}

// ==========================================
// TOGGLE DE MODO VISTA PREVIA
// ==========================================
function togglePreviewMode() {
  AppState.previewMode = !AppState.previewMode;
  localStorage.setItem('adviento_preview_mode', AppState.previewMode);
  renderCalendar();
  setTimeout(() => {
    scrollToCurrentDay(true);
  }, 100);
}

// ==========================================
// MOTOR DE NIEVE EN CANVAS
// ==========================================
function initSnow() {
  const canvas = document.getElementById('snow-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const flakes = [];
  const flakeCount = Math.min(75, Math.floor(width / 18));

  for (let i = 0; i < flakeCount; i++) {
    const roll = Math.random();
    let type = 'snow';
    if (roll < 0.22) type = 'heart';
    else if (roll < 0.42) type = 'sparkle';

    flakes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2 + 1,
      type: type,
      size: Math.random() * 5 + 9,
      opacity: Math.random() * 0.45 + 0.35,
      velY: Math.random() * 0.65 + 0.35,
      velX: (Math.random() - 0.5) * 0.35
    });
  }

  function draw() {
    if (!AppState.snowEnabled) {
      ctx.clearRect(0, 0, width, height);
      requestAnimationFrame(draw);
      return;
    }

    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < flakes.length; i++) {
      const f = flakes[i];

      if (f.type === 'heart') {
        ctx.fillStyle = `rgba(244, 63, 94, ${f.opacity})`;
        ctx.font = `${f.size}px serif`;
        ctx.fillText('♥', f.x, f.y);
      } else if (f.type === 'sparkle') {
        ctx.fillStyle = `rgba(253, 224, 71, ${f.opacity})`;
        ctx.font = `${f.size}px serif`;
        ctx.fillText('✦', f.x, f.y);
      } else {
        ctx.fillStyle = `rgba(255, 255, 255, ${f.opacity})`;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Actualizar posición
    for (let i = 0; i < flakes.length; i++) {
      const f = flakes[i];
      f.y += f.velY;
      f.x += f.velX;

      if (f.y > height) {
        f.y = -10;
        f.x = Math.random() * width;
      }
      if (f.x > width) f.x = 0;
      if (f.x < 0) f.x = width;
    }

    requestAnimationFrame(draw);
  }

  draw();
}

// ==========================================
// CONFETTI FESTIVO CASERO (Sin dependencias)
// ==========================================
function launchConfetti() {
  const container = document.body;
  const colors = ['#f59e0b', '#e11d48', '#10b981', '#38bdf8', '#fbbf24', '#ffffff'];

  for (let i = 0; i < 45; i++) {
    const confetto = document.createElement('div');
    confetto.style.position = 'fixed';
    confetto.style.width = `${Math.random() * 10 + 6}px`;
    confetto.style.height = `${Math.random() * 6 + 4}px`;
    confetto.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetto.style.top = '-10px';
    confetto.style.left = `${Math.random() * 100}vw`;
    confetto.style.opacity = '1';
    confetto.style.borderRadius = '2px';
    confetto.style.pointerEvents = 'none';
    confetto.style.zIndex = '9999';
    confetto.style.transform = `rotate(${Math.random() * 360}deg)`;

    const duration = Math.random() * 2 + 1.5;
    confetto.style.transition = `transform ${duration}s ease-out, top ${duration}s ease-out, opacity ${duration}s ease-out`;

    container.appendChild(confetto);

    setTimeout(() => {
      confetto.style.top = `${Math.random() * 80 + 20}vh`;
      confetto.style.transform = `translateX(${(Math.random() - 0.5) * 200}px) rotate(${Math.random() * 720}deg)`;
      confetto.style.opacity = '0';
    }, 20);

    setTimeout(() => confetto.remove(), duration * 1000 + 200);
  }
}

// ==========================================
// NOTIFICACIONES A TELEGRAM EN TIEMPO REAL
// ==========================================
function notificarTelegram(mensaje) {
  if (!CONFIG.telegram || !CONFIG.telegram.activo) return;
  const { botToken, chatId } = CONFIG.telegram;
  if (!botToken || !chatId || botToken === "PEGA_AQUI_TU_BOT_TOKEN" || chatId === "PEGA_AQUI_TU_CHAT_ID") return;

  try {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: mensaje,
        parse_mode: 'HTML'
      })
    }).catch(err => {
      console.warn("No se pudo enviar notificación de Telegram:", err);
    });
  } catch (e) {
    console.warn("Error en notificarTelegram:", e);
  }
}

// ==========================================
// REINICIAR PROGRESO (Para pruebas)
// ==========================================
function resetCalendarProgress() {
  const confirmReset = confirm('¿Deseas reiniciar todas las tarjetas para volverlas a cerrar y probarlas desde cero?');
  if (!confirmReset) return;

  AppState.openedDays = [];
  AppState.coupons = {};
  localStorage.removeItem('adviento_opened_days');
  localStorage.removeItem('adviento_coupons');

  renderCalendar();
  setTimeout(() => {
    scrollToCurrentDay(true);
  }, 100);
  alert('✨ Calendario reiniciado. ¡Todas las puertas están cerradas y listas!');
}

// ==========================================
// AUTO-ENFOQUE AL DÍA ACTUAL EN DICIEMBRE
// ==========================================
function scrollToCurrentDay(smooth = true) {
  const grid = document.getElementById('calendar-grid');
  if (!grid) return;

  const now = new Date();
  const mesActual = now.getMonth(); // 11 = Diciembre
  const diaActual = now.getDate();

  let targetDay = 1;
  if (mesActual === 11) {
    // Si estamos en diciembre, enfocar directamente la tarjeta del día actual (1 a 24)
    targetDay = Math.min(Math.max(diaActual, 1), 24);
  } else if (AppState.previewMode) {
    // En modo pruebas, buscar la primera tarjeta que falte por abrir
    const firstUnopened = DIAS_ADVIENTO.find(d => !AppState.openedDays.includes(d.dia));
    targetDay = firstUnopened ? firstUnopened.dia : 1;
  }

  const targetCard = grid.querySelector(`.advent-card[data-day="${targetDay}"]`);
  if (!targetCard) return;

  const isMobile = window.innerWidth <= 767;
  if (isMobile) {
    const scrollTarget = Math.max(0, targetCard.offsetLeft - 16);
    grid.scrollTo({
      left: scrollTarget,
      behavior: smooth ? 'smooth' : 'auto'
    });
  } else {
    targetCard.scrollIntoView({
      behavior: smooth ? 'smooth' : 'auto',
      block: 'nearest',
      inline: 'center'
    });
  }
}

// ==========================================
// INICIALIZACIÓN
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  renderCalendar();
  initSnow();

  // Posicionar inmediatamente en el día actual
  setTimeout(() => {
    scrollToCurrentDay(false);
  }, 120);

  // Abrir automáticamente el modal de bienvenida al cargar la página
  setTimeout(() => {
    openWelcomeModal();
  }, 350);

  // Cerrar modales al hacer click fuera del contenido
  window.addEventListener('click', (e) => {
    const dayModal = document.getElementById('day-modal');
    const walletModal = document.getElementById('wallet-modal');
    const welcomeModal = document.getElementById('welcome-modal');
    if (e.target === dayModal) closeModal();
    if (e.target === walletModal) closeWalletModal();
    if (e.target === welcomeModal) closeWelcomeModal();
  });

  // Cerrar con tecla Escape
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      closeWalletModal();
      closeWelcomeModal();
    }
  });
});
