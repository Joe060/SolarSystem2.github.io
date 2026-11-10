/**
 * ==========================================================================
 * Interactive Solar System Explorer - Main Script (Step 3)
 * Spatial Canvas Navigation, 3-Phase State Machine & GSAP Camera Pan-Zoom
 * ==========================================================================
 */

// State Global Aplikasi
const AppState = {
  currentPhase: "loading", // "loading" | "lobby" | "explore"
  activeTargetId: "sun",
  isZooming: false,
  lobbyScale: 0.22,
  exploreScale: 1.6,
  canvasCenter: 3000, // Koordinat pusat canvas (3000px, 3000px)
  orbitTweensMap: {}, // Map objek tween orbit per-planet { trackTween, labelTween, visualTween, trackEl, nodeEl }
  trackingTargetId: null, // ID benda langit yang sedang dilacak secara live oleh kamera
  trackingTickerFn: null // Referensi fungsi ticker GSAP untuk real-time camera tracking
};

document.addEventListener("DOMContentLoaded", () => {
  // 1. Inisialisasi latar belakang bintang 2D
  createStarfield(120);

  // 2. Siapkan kanvas koordinat tata surya (render garis orbit, matahari & planet)
  initSpatialSolarSystem();

  // 3. Pasang event listener untuk interaktivitas tombol & navigasi
  initUIEventListeners();

  // 4. Mulai simulasi Loading Screen dengan GSAP (Fase 1 -> Fase 2)
  startLoadingSimulation();
});

/* ==========================================================================
   FASE 1: SIMULASI LOADING SCREEN & TRANSISI GSAP
   ========================================================================== */

/**
 * Simulasi loading dengan persentase 0% -> 100% menggunakan GSAP
 * Ketika 100%, otomatis memicu transisi ke Fase 2 (Lobby)
 */
function startLoadingSimulation() {
  const progressBar = document.getElementById("loading-progress-bar");
  const percentText = document.getElementById("loading-percent");
  const statusLabel = document.querySelector(".loading-status-label");
  const speechText = document.getElementById("mas-amba-speech");
  const enterBtn = document.getElementById("btn-enter-lobby");

  const progressObj = { value: 0 };

  // Status teks edukatif bertahap
  const statusStages = [
    { threshold: 0, text: "Menghubungkan sensor orbital tata surya...", speech: "Halo! Saya Mas Amba dari planet Ngawi nanjauh disana..." },
    { threshold: 30, text: "Memuat koordinat 8 planet utama & 5 planet kerdil...", speech: "Roket sudah siap, bahan bakar kosmik terisi penuh!" },
    { threshold: 65, text: "Menyelaraskan gravitasi orbit Matahari...", speech: "Kencangkan sabuk pengamanmu kawan!" },
    { threshold: 90, text: "Sistem navigasi spasial terkoneksi sempurna!", speech: "Tiga... Dua... Satu... Kita siap meluncur!" }
  ];

  // Timeline GSAP untuk loading
  gsap.to(progressObj, {
    value: 100,
    duration: 3.2,
    ease: "power1.inOut",
    onUpdate: () => {
      const currentVal = Math.round(progressObj.value);
      if (progressBar) progressBar.style.width = `${currentVal}%`;
      if (percentText) percentText.textContent = `${currentVal}%`;

      // Perbarui teks status sesuai stage
      for (let i = statusStages.length - 1; i >= 0; i--) {
        if (currentVal >= statusStages[i].threshold) {
          if (statusLabel && statusLabel.textContent !== statusStages[i].text) {
            statusLabel.textContent = statusStages[i].text;
          }
          if (speechText && speechText.textContent !== `"${statusStages[i].speech}"`) {
            speechText.textContent = `"${statusStages[i].speech}"`;
          }
          break;
        }
      }
    },
    onComplete: () => {
      if (statusLabel) statusLabel.textContent = "Sistem siap! Memasuki orbit utama tata surya...";
      
      // Delay singkat 400ms sebelum transisi mulus ke Lobby
      gsap.delayedCall(0.5, transitionLoadingToLobby);
    }
  });

  // Tombol alternatif jika user ingin langsung skip ke Lobby
  if (enterBtn) {
    enterBtn.addEventListener("click", () => {
      gsap.killTweensOf(progressObj);
      transitionLoadingToLobby();
    });
  }
}

/**
 * Transisi GSAP: Fade-out / slide-up Loading Screen & Menampilkan Lobby
 */
function transitionLoadingToLobby() {
  if (AppState.currentPhase !== "loading") return;
  AppState.currentPhase = "lobby";

  const loadingScreen = document.getElementById("loading-screen");
  const lobbyScreen = document.getElementById("lobby-screen") || document.getElementById("lobby-ui");
  const spaceCanvas = document.getElementById("space-canvas");

  // Hitung skala Lobby yang pas dengan resolusi layar pengguna
  calculateLobbyScale();

  const tl = gsap.timeline();

  // 1. Mas Amba melesat cepat ke depan sebelum loading ditutup
  tl.to("#mas-amba-rocket-rider", {
    x: 250,
    y: -80,
    scale: 1.15,
    opacity: 0,
    duration: 0.65,
    ease: "power2.in"
  });

  // 2. Loading screen slide-up dan fade-out
  tl.to(loadingScreen, {
    yPercent: -100,
    opacity: 0,
    duration: 0.9,
    ease: "power3.inOut",
    onComplete: () => {
      loadingScreen.style.display = "none";
      loadingScreen.classList.remove("active");
    }
  }, "-=0.3");

  // 3. Set kanvas ke posisi tengah (Matahari) dalam skala Lobby zoom-out
  tl.fromTo(spaceCanvas, 
    { scale: 0.05, opacity: 0 },
    { scale: AppState.lobbyScale, x: 0, y: 0, opacity: 1, duration: 1.4, ease: "power2.out" },
    "-=0.7"
  );

  // 4. Lobby UI fade-in & slide dari samping
  if (lobbyScreen) {
    lobbyScreen.classList.remove("hidden");
    lobbyScreen.style.display = "flex";
    tl.fromTo("#lobby-sidebar", 
      { x: 100, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
      "-=0.9"
    );
    tl.fromTo(".lobby-header",
      { y: -50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
      "-=0.7"
    );
  }
}

/* ==========================================================================
   FASE 2: RENDER KANVAS SPASIAL & MEKANIKA ORBIT
   ========================================================================== */

/**
 * Menghitung skala kanvas agar seluruh tata surya muat pada mode Lobby
 */
function calculateLobbyScale() {
  const minDim = Math.min(window.innerWidth, window.innerHeight);
  // Radius terjauh (Neptunus/Sabuk Kuiper) sekitar 2000-2600px
  AppState.lobbyScale = Math.max(0.14, Math.min(0.26, (minDim / 2900)));
}

/**
 * Inisialisasi kanvas koordinat: garis orbit, node planet, dan bulan
 */
function initSpatialSolarSystem() {
  const orbitLayer = document.getElementById("orbit-lines-layer");
  const planetsGroup = document.getElementById("planets-nodes-group");
  const dwarfGroup = document.getElementById("dwarf-planets-nodes-group");
  const lobbyPillsList = document.getElementById("lobby-celestial-pills");
  const exploreDock = document.getElementById("explore-planet-dock");

  if (!window.solarSystemData || !orbitLayer) return;

  const cx = AppState.canvasCenter;
  const cy = AppState.canvasCenter;

  // Set ukuran SVG layer orbit
  orbitLayer.setAttribute("viewBox", `0 0 ${cx * 2} ${cy * 2}`);
  orbitLayer.setAttribute("width", `${cx * 2}`);
  orbitLayer.setAttribute("height", `${cy * 2}`);

  // Kosongkan container sebelum render
  orbitLayer.innerHTML = "";
  if (planetsGroup) planetsGroup.innerHTML = "";
  if (dwarfGroup) dwarfGroup.innerHTML = "";
  if (lobbyPillsList) lobbyPillsList.innerHTML = "";
  if (exploreDock) exploreDock.innerHTML = "";

  // 1. Render Tombol Matahari di Dock Explore
  if (exploreDock) {
    exploreDock.appendChild(createDockButton({ id: "sun", name: "Matahari" }));
  }

  // 2. Loop data benda langit untuk membuat orbit & node spasial
  window.solarSystemData.forEach((item, index) => {
    // A. Render Pill di Sidebar Lobby
    if (lobbyPillsList) {
      const pillBtn = document.createElement("button");
      pillBtn.className = "lobby-celestial-btn";
      pillBtn.innerHTML = `
        <span>${item.name}</span>
        <span style="font-size: 0.88rem; opacity: 0.7;">${item.stats.distanceFromSun}</span>
      `;
      pillBtn.addEventListener("click", () => {
        zoomToCelestialObject(item.id);
      });
      lobbyPillsList.appendChild(pillBtn);
    }

    // Matahari berada di pusat (0,0), tidak memiliki jalur orbit mengelilingi dirinya sendiri
    if (item.id === "sun") {
      const sunNode = document.getElementById("celestial-obj-sun");
      if (sunNode) {
        sunNode.addEventListener("click", () => zoomToCelestialObject("sun"));
      }
      return;
    }

    const r = item.visual.orbitRadius;

    // B. Buat Lingkaran Jalur Orbit di SVG
    const orbitCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    orbitCircle.setAttribute("cx", cx);
    orbitCircle.setAttribute("cy", cy);
    orbitCircle.setAttribute("r", r);
    orbitCircle.setAttribute("class", "orbit-path-line");
    orbitLayer.appendChild(orbitCircle);

    // C. Buat Sistem Revolusi Orbit (Rotasi GPU-composited dengan GSAP)
    const orbitTrack = document.createElement("div");
    orbitTrack.className = `orbit-track track-${item.id}`;
    orbitTrack.id = `orbit-track-${item.id}`;
    orbitTrack.style.cssText = `
      position: absolute;
      left: ${cx}px;
      top: ${cy}px;
      width: ${r * 2}px;
      height: ${r * 2}px;
      margin-left: -${r}px;
      margin-top: -${r}px;
      border-radius: 50%;
      pointer-events: none;
    `;

    // D. Buat Node Planet di tepi atas lingkaran orbit
    const planetNode = document.createElement("div");
    planetNode.className = `celestial-node node-${item.id}`;
    planetNode.id = `celestial-obj-${item.id}`;
    planetNode.setAttribute("data-id", item.id);
    planetNode.setAttribute("data-type", item.type);
    planetNode.style.cssText = `
      position: absolute;
      left: 50%;
      top: 0;
      transform: translate(-50%, -50%);
      pointer-events: auto;
      display: flex;
      flex-direction: column;
      align-items: center;
    `;

    // 1. Kontainer Visual Planet (.planet-svg) - Terpisah dari teks
    const visualWrap = document.createElement("div");
    visualWrap.className = "celestial-body-visual planet-svg";
    visualWrap.innerHTML = generatePlanetSvgVisual(item);

    // 2. Kontainer Teks Nama Planet (.planet-label) - Terpisah secara independen
    const labelTag = document.createElement("span");
    labelTag.className = "celestial-label-tag planet-label";
    labelTag.textContent = item.name;

    planetNode.appendChild(visualWrap);
    planetNode.appendChild(labelTag);

    // G. Render Miniatur Bulan/Satelit Alami yang Mengorbit Planetnya
    const localMoonsSystem = createLocalMoonsSystem(item);
    if (localMoonsSystem) {
      planetNode.appendChild(localMoonsSystem);
    }

    // Event Klik pada Planet: Pan & Zoom ke planet tersebut
    planetNode.addEventListener("click", (e) => {
      e.stopPropagation();
      zoomToCelestialObject(item.id);
    });

    orbitTrack.appendChild(planetNode);

    // Kelompokkan ke container yang tepat (Planet Utama / Planet Kerdil)
    if (item.type === "planet" && planetsGroup) {
      planetsGroup.appendChild(orbitTrack);
    } else if (item.type === "dwarf-planet" && dwarfGroup) {
      dwarfGroup.appendChild(orbitTrack);
    }

    // E. Tambahkan ke Dock Navigasi Explore
    if (exploreDock) {
      exploreDock.appendChild(createDockButton(item));
    }

    // F. Animasi Revolusi Orbit Berkelanjutan (Kecepatan Tenang & Anggun - Calm Cosmic Pace)
    // Diperlambat 2.5x - 3x lipat agar pergerakan planet terasa megah dan edukatif
    const basePeriod = 80; // Bumi = 80 detik
    const period = Math.max(32, basePeriod * Math.pow(r / 580, 0.75));
    const initialAngle = (index * 42) % 360;

    gsap.set(orbitTrack, { rotation: initialAngle });
    gsap.set(labelTag, { rotation: -initialAngle });
    gsap.set(visualWrap, { rotation: -initialAngle });

    // Tween Revolusi Track
    const trackTween = gsap.to(orbitTrack, {
      rotation: "+=360",
      duration: period,
      repeat: -1,
      ease: "none"
    });

    // Counter-rotation HANYA pada label teks agar selalu tegak lurus (upright) dan tidak backflip
    const labelCounterTween = gsap.to(labelTag, {
      rotation: "-=360",
      duration: period,
      repeat: -1,
      ease: "none"
    });

    // Counter-rotation pada visual agar orientasi visual konsisten
    const visualCounterTween = gsap.to(visualWrap, {
      rotation: "-=360",
      duration: period,
      repeat: -1,
      ease: "none"
    });

    // Simpan ke peta tweens untuk fitur Camera Lock / Orbit Freeze
    AppState.orbitTweensMap[item.id] = {
      trackTween,
      labelTween: labelCounterTween,
      visualTween: visualCounterTween,
      trackEl: orbitTrack,
      nodeEl: planetNode
    };
  });
}

/**
 * Helper membuat tombol pill dock pada mode Explore
 */
function createDockButton(item) {
  const btn = document.createElement("button");
  btn.className = `dock-planet-btn btn-dock-${item.id}`;
  btn.setAttribute("data-id", item.id);
  btn.textContent = item.name;
  btn.addEventListener("click", () => {
    zoomToCelestialObject(item.id);
  });
  return btn;
}

/**
 * Membuat miniatur sistem satelit/bulan yang mengorbit planet induknya
 * Skala bulan jauh lebih kecil dari planet, mengorbit secara kontinu
 */
function createLocalMoonsSystem(item) {
  if (!item.moons || !item.moons.majorMoons || item.moons.majorMoons.length === 0) {
    return null;
  }

  const container = document.createElement("div");
  container.className = `local-moons-system moons-system-${item.id}`;
  container.setAttribute("aria-hidden", "true");

  // Tampilkan hingga maksimal 4 bulan utama agar visual tetap elegan dan bersih
  const moonsToShow = item.moons.majorMoons.slice(0, 4);
  const baseR = 48;
  const stepR = 12;

  moonsToShow.forEach((moonName, mIdx) => {
    const moonR = baseR + mIdx * stepR;
    const moonPeriod = 3.5 + mIdx * 2.2; // Revolusi cepat (3.5s - 10s)

    const moonTrack = document.createElement("div");
    moonTrack.className = "local-moon-track";
    moonTrack.style.cssText = `
      left: -${moonR}px;
      top: -${moonR}px;
      width: ${moonR * 2}px;
      height: ${moonR * 2}px;
      pointer-events: none;
    `;

    // Garis lintasan orbit bulan berupa SVG circle dashed halus
    const svgCircle = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgCircle.setAttribute("viewBox", `0 0 ${moonR * 2} ${moonR * 2}`);
    svgCircle.style.cssText = "position:absolute; inset:0; width:100%; height:100%; pointer-events:none;";
    
    const circleEl = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circleEl.setAttribute("cx", moonR);
    circleEl.setAttribute("cy", moonR);
    circleEl.setAttribute("r", moonR - 1);
    circleEl.setAttribute("fill", "none");
    circleEl.setAttribute("stroke", "rgba(255, 255, 255, 0.18)");
    circleEl.setAttribute("stroke-width", "1");
    circleEl.setAttribute("stroke-dasharray", "2 3");
    svgCircle.appendChild(circleEl);
    moonTrack.appendChild(svgCircle);

    // Node Fisik Bulan (skala jauh lebih kecil dari planet)
    const moonDot = document.createElement("div");
    moonDot.className = "local-moon-dot";
    moonDot.title = `${moonName} (Bulan ${item.name})`;
    const dotSize = mIdx === 0 ? 6 : 5;
    moonDot.style.cssText = `
      left: 50%;
      top: 0;
      width: ${dotSize}px;
      height: ${dotSize}px;
      margin-left: -${dotSize / 2}px;
      margin-top: -${dotSize / 2}px;
    `;

    moonTrack.appendChild(moonDot);
    container.appendChild(moonTrack);

    // GSAP continuous revolution for local moon
    const startAngle = (mIdx * 80 + 25) % 360;
    gsap.set(moonTrack, { rotation: startAngle });
    gsap.to(moonTrack, {
      rotation: "+=360",
      duration: moonPeriod,
      repeat: -1,
      ease: "none"
    });
  });

  return container;
}

/* ==========================================================================
   FASE 3: SISTEM KAMERA PAN & ZOOM SPASIAL GSAP
   ========================================================================== */

/**
 * Kerangka fungsi Pan & Zoom Spasial menuju benda langit tertentu
 * Menggeser dan memperbesar kanvas spasial laksana Google Maps
 * @param {string} objectId - ID benda langit (misal 'sun', 'earth', 'mars', dll.)
 * @param {number} [targetScale] - Skala perbesaran (opsional)
 */
/**
 * Memulai Live Camera Tracking Loop menggunakan gsap.ticker
 * Mengunci titik pusat viewport layar secara dinamis pada planet target yang terus mengorbit
 * @param {string} objectId - ID planet yang akan diikuti kamera
 */
function startCameraTracking(objectId) {
  // Hentikan tracking sebelumnya jika ada
  stopCameraTracking();

  if (!objectId || objectId === "sun") return;
  AppState.trackingTargetId = objectId;

  const spaceCanvas = document.getElementById("space-canvas");
  const targetNode = document.getElementById(`celestial-obj-${objectId}`);
  if (!spaceCanvas || !targetNode) return;

  // Handler tick yang dijalankan setiap frame (60-120fps)
  AppState.trackingTickerFn = () => {
    // Jangan jalankan saat sedang dalam proses animasi pan/zoom manual antar planet
    if (AppState.isZooming || AppState.currentPhase !== "explore") return;

    // Dapatkan posisi real-time planet di layar (viewport)
    const rect = targetNode.getBoundingClientRect();
    const planetCenterX = rect.left + rect.width / 2;
    const planetCenterY = rect.top + rect.height / 2;

    const viewportCenterX = window.innerWidth / 2;
    const viewportCenterY = window.innerHeight / 2;

    const diffX = viewportCenterX - planetCenterX;
    const diffY = viewportCenterY - planetCenterY;

    // Geser kanvas secara instan & mulus mengikuti pergerakan orbit planet
    if (Math.abs(diffX) > 0.04 || Math.abs(diffY) > 0.04) {
      const currentCanvasX = gsap.getProperty(spaceCanvas, "x") || 0;
      const currentCanvasY = gsap.getProperty(spaceCanvas, "y") || 0;
      gsap.set(spaceCanvas, {
        x: currentCanvasX + diffX,
        y: currentCanvasY + diffY
      });
    }
  };

  gsap.ticker.add(AppState.trackingTickerFn);
}

/**
 * Menghentikan Live Camera Tracking Loop (Reset Camera Lock)
 */
function stopCameraTracking() {
  if (AppState.trackingTickerFn) {
    gsap.ticker.remove(AppState.trackingTickerFn);
    AppState.trackingTickerFn = null;
  }
  AppState.trackingTargetId = null;
}

function zoomToCelestialObject(objectId, targetScale = AppState.exploreScale) {
  if (AppState.isZooming) return;
  AppState.isZooming = true;
  AppState.activeTargetId = objectId;

  // Hentikan tracking kamera sebelumnya agar tidak terjadi konflik transform saat kamera meluncur
  stopCameraTracking();

  const itemData = window.solarSystemData.find(item => item.id === objectId);
  if (!itemData) {
    AppState.isZooming = false;
    return;
  }

  const spaceCanvas = document.getElementById("space-canvas");
  const lobbyScreen = document.getElementById("lobby-screen") || document.getElementById("lobby-ui");
  const exploreUI = document.getElementById("explore-ui");
  const detailCard = document.getElementById("planet-detail-overlay-card");
  const ambaWidget = document.getElementById("amba-explorer-widget");
  const cx = AppState.canvasCenter;
  const cy = AppState.canvasCenter;

  // 1. Tentukan Koordinat Target Terkini pada Kanvas Spasial
  let targetCanvasX = cx;
  let targetCanvasY = cy;

  if (objectId !== "sun") {
    // Ambil rotasi orbit track saat ini untuk mendapatkan posisi x, y real-time
    const trackEl = document.getElementById(`orbit-track-${objectId}`);
    const r = itemData.visual.orbitRadius;
    let currentAngleRad = 0;
    
    if (trackEl) {
      const transform = gsap.getProperty(trackEl, "rotation") || 0;
      currentAngleRad = (transform - 90) * (Math.PI / 180); // Posisi top adalah 0 rad
    }

    targetCanvasX = cx + r * Math.cos(currentAngleRad);
    targetCanvasY = cy + r * Math.sin(currentAngleRad);
  }

  // Offset Pan Kamera agar Koordinat Target Tepat Berada di Tengah Layar
  const panOffsetX = (cx - targetCanvasX) * targetScale;
  const panOffsetY = (cy - targetCanvasY) * targetScale;

  // Sembunyikan detail card & widget jika sedang tampil saat berpindah planet
  if (detailCard && detailCard.style.display !== "none") {
    gsap.to(detailCard, { opacity: 0, scale: 0.95, duration: 0.2, onComplete: () => { detailCard.style.display = "none"; } });
  }
  if (ambaWidget && ambaWidget.style.display !== "none") {
    gsap.to(ambaWidget, { opacity: 0, y: 15, duration: 0.2, onComplete: () => { ambaWidget.style.display = "none"; } });
  }

  // 2. Timeline GSAP Terkoordinasi (Fix Sync Animasi Zoom & UI Reveal)
  const tl = gsap.timeline({
    onComplete: () => {
      AppState.isZooming = false;
      AppState.currentPhase = "explore";

      // Aktifkan Real-time Camera Tracking Loop agar kamera selalu mengunci dan mengikuti pergerakan orbit planet!
      startCameraTracking(objectId);

      // HANYA tampilkan UI Explore & Detail Card di callback onComplete setelah seluruh zoom selesai 100%!
      if (exploreUI) {
        exploreUI.style.display = "flex";
        gsap.to(exploreUI, { opacity: 1, duration: 0.35, ease: "power2.out" });
      }

      updateExploreHUD(itemData);
      showPlanetDetailCard(itemData);
      showAmbaExplorerWidget(itemData);
    }
  });

  // A. UI Lobby LANGSUNG fade-out di awal
  if (AppState.currentPhase === "lobby" && lobbyScreen) {
    tl.to(lobbyScreen, {
      opacity: 0,
      duration: 0.35,
      ease: "power2.out",
      onComplete: () => {
        lobbyScreen.style.display = "none";
      }
    }, 0);
  }

  // B. Kamera Pan & Zoom ke Target (Animasi Utama)
  tl.to(spaceCanvas, {
    x: panOffsetX,
    y: panOffsetY,
    scale: targetScale,
    duration: 1.85,
    ease: "power3.inOut"
  }, AppState.currentPhase === "lobby" ? 0.15 : 0);
}

/**
 * Mengembalikan kamera ke mode Orbit Utuh (Lobby Zoom-Out)
 */
function resetCameraToLobby() {
  if (AppState.isZooming) return;
  AppState.isZooming = true;
  AppState.currentPhase = "lobby";

  // Hentikan Real-time Camera Tracking Loop (Reset Camera Lock)
  stopCameraTracking();

  const spaceCanvas = document.getElementById("space-canvas");
  const lobbyScreen = document.getElementById("lobby-screen") || document.getElementById("lobby-ui");
  const exploreUI = document.getElementById("explore-ui");
  const detailCard = document.getElementById("planet-detail-overlay-card");
  const ambaWidget = document.getElementById("amba-explorer-widget");

  calculateLobbyScale();

  const tl = gsap.timeline({
    onComplete: () => {
      AppState.isZooming = false;
    }
  });

  // Sembunyikan Detail Card & Widget Mas Amba
  if (detailCard) {
    tl.to(detailCard, {
      opacity: 0,
      x: -30,
      scale: 0.95,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        detailCard.style.display = "none";
      }
    }, 0);
  }

  if (ambaWidget) {
    tl.to(ambaWidget, {
      opacity: 0,
      y: 20,
      duration: 0.25,
      ease: "power2.in",
      onComplete: () => {
        ambaWidget.style.display = "none";
      }
    }, 0);
  }

  if (exploreUI) {
    tl.to(exploreUI, {
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        exploreUI.style.display = "none";
      }
    }, 0.1);
  }

  // Zoom Out Kamera ke seluruh tata surya
  tl.to(spaceCanvas, {
    x: 0,
    y: 0,
    scale: AppState.lobbyScale,
    duration: 1.6,
    ease: "power3.inOut"
  }, 0.2);

  // Munculkan kembali UI Lobby
  if (lobbyScreen) {
    lobbyScreen.style.display = "flex";
    tl.fromTo(lobbyScreen, 
      { opacity: 0 },
      { opacity: 1, duration: 0.6, ease: "power2.out" },
      "-=0.4"
    );
  }
}

/**
 * Memperbarui tampilan HUD Explore (Nama Target & Tombol Aktif)
 */
function updateExploreHUD(itemData) {
  const targetLabel = document.getElementById("current-target-name");
  if (targetLabel) {
    targetLabel.textContent = `${itemData.name} (${itemData.englishName})`;
  }

  // Update status tombol dock aktif
  document.querySelectorAll(".dock-planet-btn").forEach(btn => {
    if (btn.getAttribute("data-id") === itemData.id) {
      btn.classList.add("active");
      btn.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    } else {
      btn.classList.remove("active");
    }
  });
}

/**
 * Menampilkan dan mengisi data pada Floating Planet Detail Card
 */
function showPlanetDetailCard(item) {
  const card = document.getElementById("planet-detail-overlay-card");
  if (!card) return;

  // Isi data ke elemen-elemen kartu
  const setText = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  };

  setText("detail-name", item.name);
  setText("detail-category", item.category);
  setText("detail-distance", item.stats.distanceFromSun);
  setText("detail-tagline", item.tagline);
  setText("detail-travel-time", item.travelTimeFromEarth || "-");
  setText("detail-description", item.description);
  setText("stat-diameter", item.stats.diameter);
  setText("stat-revolution", item.stats.orbitalPeriod);
  setText("stat-rotation", item.stats.rotationPeriod);
  setText("stat-temperature", item.stats.temperature);
  setText("detail-moons-title", `Satelit Alami (Total: ${item.moons.total})`);
  setText("detail-moons-summary", item.moons.summary);
  setText("detail-funfact-text", item.funFact);

  // Render chip bulan utama
  const moonsListEl = document.getElementById("detail-major-moons-list");
  if (moonsListEl) {
    if (item.moons.majorMoons && item.moons.majorMoons.length > 0) {
      moonsListEl.innerHTML = item.moons.majorMoons
        .map(moon => `<span class="moon-pill">${moon}</span>`)
        .join("");
      moonsListEl.style.display = "flex";
    } else {
      moonsListEl.innerHTML = "";
      moonsListEl.style.display = "none";
    }
  }

  // Animasi Pop-in Card (HANYA tampil setelah zoom 100% selesai)
  card.style.display = "block";
  card.setAttribute("aria-hidden", "false");
  gsap.fromTo(card,
    { opacity: 0, x: -40, scale: 0.95 },
    { opacity: 1, x: 0, scale: 1, duration: 0.45, ease: "power2.out" }
  );
}

/**
 * Menampilkan Widget Mas Amba Melayang di Kanan Bawah (#amba-explorer-widget)
 */
function showAmbaExplorerWidget(item) {
  const widget = document.getElementById("amba-explorer-widget");
  const quoteEl = document.getElementById("mas-amba-explore-quote");
  if (!widget) return;

  const masAmbaQuotes = {
    sun: "Awas jangan terlalu dekat kawan! Suhu permukaannya 5.500°C, bisa bikin roket kita matang dalam sedetik!",
    mercury: "Planet terdekat dari Matahari nih! Di sini tidak ada atmosfer, siang hari panas ekstrem, malamnya sedingin es!",
    venus: "Planet terpanas di tata surya akibat efek rumah kaca ekstrem. Langitnya diselimuti awan asam sulfat tebal!",
    earth: "Wah, Bumi rumah kita tercinta! Tempat paling ramah bagi kehidupan di seluruh tata surya.",
    mars: "Planet Merah! Tanahnya kaya oksida besi dan punya gunung berapi tertinggi di tata surya, Olympus Mons.",
    jupiter: "Raksasa gas pelindung tata surya! Bintik Merah Besarnya adalah badai raksasa yang ukurannya lebih luas dari Bumi.",
    saturn: "Cincin esnya memukau sekali ya! Saking ringannya, Saturnus bisa mengapung kalau ditaruh di bak air raksasa.",
    uranus: "Planet es raksasa yang menggelinding miring seperti bola boling! Warnanya biru kehijauan yang indah karena gas metana.",
    neptune: "Planet terjauh dengan badai angin supersonik tercepat di tata surya, kecepatannya tembus 2.000 km/jam!",
    ceres: "Objek terbesar di Sabuk Asteroid antara Mars dan Jupiter. Dia satu-satunya planet kerdil di tata surya bagian dalam.",
    pluto: "Meskipun statusnya planet kerdil sejak 2006, Pluto punya gletser es raksasa berbentuk hati (Tombaugh Regio)!",
    haumea: "Bentuknya lonjong unik seperti bola rugbi karena berputar sangat cepat pada porosnya—hanya 4 jam per rotasi!",
    makemake: "Ditemukan saat masa Paskah 2005 di Sabuk Kuiper. Permukaannya dilapisi kristal es metana dan etana murni.",
    eris: "Planet kerdil paling masif di Sabuk Kuiper. Penemuannya inilah yang memicu perdebatan definisi ulang planet!"
  };

  if (quoteEl) {
    const quote = masAmbaQuotes[item.id] || item.tagline;
    quoteEl.textContent = `"${quote}"`;
  }

  widget.style.display = "flex";
  gsap.fromTo(widget,
    { opacity: 0, y: 30, scale: 0.95 },
    { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: "power2.out" }
  );
}

/**
 * Animasi Mas Amba meluncur secara epik saat tombol "Meluncur!!" diklik di Lobby
 * Menembus angkasa menuju pusat Matahari diiringi kamera Zoom-In ekstrem
 */
function triggerLaunchSequence() {
  const flybyEl = document.getElementById("mas-amba-launch-flyby");
  if (!flybyEl) {
    zoomToCelestialObject("sun", 1.8);
    return;
  }

  flybyEl.style.display = "block";
  const rocketWrap = flybyEl.querySelector(".flyby-rocket-wrap");

  const flyTl = gsap.timeline();
  // Set posisi awal roket di kiri bawah layar
  gsap.set(rocketWrap, {
    x: -180,
    y: window.innerHeight + 60,
    scale: 0.65,
    rotation: -30,
    opacity: 1
  });

  // Roket melesat cepat ke arah tengah
  flyTl.to(rocketWrap, {
    x: window.innerWidth * 0.5 - 50,
    y: window.innerHeight * 0.5 - 50,
    scale: 1.25,
    rotation: -15,
    duration: 0.8,
    ease: "power2.in"
  });

  // Menukik ke pusat kanvas (Matahari) dan memudar
  flyTl.to(rocketWrap, {
    x: window.innerWidth * 0.5 + 350,
    y: window.innerHeight * 0.5 - 260,
    scale: 0.15,
    opacity: 0,
    duration: 0.5,
    ease: "power2.out",
    onComplete: () => {
      flybyEl.style.display = "none";
    }
  });

  // Kamera serentak melakukan transisi Zoom-In ekstrem ke Matahari
  zoomToCelestialObject("sun", 1.8);
}

/* ==========================================================================
   EVENT LISTENERS & KONTROL USER
   ========================================================================== */

function initUIEventListeners() {
  // 1. Tombol Utama Meluncur di Lobby: picu animasi flyby & zoom kamera ke Matahari
  const launchBtn = document.getElementById("btn-launch-explore");
  if (launchBtn) {
    launchBtn.addEventListener("click", () => {
      triggerLaunchSequence();
    });
  }

  // 2. Tombol Kembali ke Orbit Utuh
  const returnBtn = document.getElementById("btn-back-to-lobby");
  if (returnBtn) {
    returnBtn.addEventListener("click", () => {
      resetCameraToLobby();
    });
  }

  // 3. Tombol Tutup Detail Card
  const closeCardBtn = document.getElementById("btn-close-detail-card");
  if (closeCardBtn) {
    closeCardBtn.addEventListener("click", () => {
      const card = document.getElementById("planet-detail-overlay-card");
      if (card) {
        gsap.to(card, {
          opacity: 0,
          x: -30,
          duration: 0.3,
          onComplete: () => {
            card.style.display = "none";
            card.setAttribute("aria-hidden", "true");
          }
        });
      }
    });
  }

  // 4. Tombol Kontrol Kamera (+ / - / 1:1)
  const spaceCanvas = document.getElementById("space-canvas");
  const zoomInBtn = document.getElementById("btn-zoom-in");
  const zoomOutBtn = document.getElementById("btn-zoom-out");
  const resetZoomBtn = document.getElementById("btn-zoom-reset");

  if (zoomInBtn) {
    zoomInBtn.addEventListener("click", () => {
      const currentScale = gsap.getProperty(spaceCanvas, "scale") || 1;
      gsap.to(spaceCanvas, { scale: currentScale * 1.3, duration: 0.4, ease: "power1.out" });
    });
  }

  if (zoomOutBtn) {
    zoomOutBtn.addEventListener("click", () => {
      const currentScale = gsap.getProperty(spaceCanvas, "scale") || 1;
      gsap.to(spaceCanvas, { scale: Math.max(0.1, currentScale * 0.75), duration: 0.4, ease: "power1.out" });
    });
  }

  if (resetZoomBtn) {
    resetZoomBtn.addEventListener("click", () => {
      if (AppState.activeTargetId) {
        zoomToCelestialObject(AppState.activeTargetId);
      }
    });
  }

  // 5. Responsif saat Window Resize
  window.addEventListener("resize", () => {
    if (AppState.currentPhase === "lobby") {
      calculateLobbyScale();
      gsap.to(spaceCanvas, { scale: AppState.lobbyScale, duration: 0.3 });
    }
  });
}

/* ==========================================================================
   HELPER VISUAL 2D KURZGESAGT SVG (Dipakai untuk merender planet pada kanvas)
   ========================================================================== */

function generatePlanetSvgVisual(item) {
  const { id, visual } = item;
  const pCol = visual.primaryColor;
  const aCol = visual.accentColor;
  const gCol = visual.glowColor;

  const vbSize = 140;
  const cx = 70;
  const cy = 70;
  const r = 38 * (visual.relativeSizeScale > 1.5 ? 1.3 : visual.relativeSizeScale < 0.6 ? 0.75 : 1.0);

  let specificFeatures = "";

  switch (id) {
    case "mercury":
      specificFeatures = `
        <circle cx="${cx - 10}" cy="${cy - 8}" r="5" fill="${aCol}" opacity="0.7" />
        <circle cx="${cx + 8}" cy="${cy + 10}" r="6" fill="${aCol}" opacity="0.6" />
      `;
      break;

    case "venus":
      specificFeatures = `
        <clipPath id="clip-canvas-${id}">
          <circle cx="${cx}" cy="${cy}" r="${r}" />
        </clipPath>
        <g clip-path="url(#clip-canvas-${id})">
          <path d="M ${cx - r} ${cy - 10} Q ${cx} ${cy - 20} ${cx + r} ${cy - 8}" stroke="${aCol}" stroke-width="7" fill="none" opacity="0.6" />
          <path d="M ${cx - r} ${cy + 6} Q ${cx} ${cy - 5} ${cx + r} ${cy + 8}" stroke="${aCol}" stroke-width="9" fill="none" opacity="0.6" />
        </g>
      `;
      break;

    case "earth":
      return `
        <svg class="planet-canvas-svg" viewBox="0 0 160 160" width="120" height="120">
          <circle cx="80" cy="80" r="38" fill="#1D70B8" />
          <clipPath id="earth-canvas-clip">
            <circle cx="80" cy="80" r="38" />
          </clipPath>
          <g clip-path="url(#earth-canvas-clip)">
            <!-- Rotasi Poros: Pergeseran Benua & Awan Atmosfer -->
            <g class="earth-continents-drift">
              <path d="M 45 55 Q 55 50 62 60 T 70 78 T 55 86 Z" fill="#2ECC71" />
              <path d="M 68 62 Q 78 56 83 70 T 75 88 Z" fill="#2ECC71" />
              <path d="M 95 52 Q 105 48 112 58 T 120 76 T 105 84 Z" fill="#2ECC71" />
              <path d="M 118 60 Q 128 54 133 68 T 125 86 Z" fill="#2ECC71" />
              <path d="M 40 72 Q 60 70 70 72" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" opacity="0.8" fill="none" />
              <path d="M 90 70 Q 110 68 120 70" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" opacity="0.8" fill="none" />
            </g>
            <path d="M 80 42 A 38 38 0 0 1 118 80 A 38 38 0 0 1 80 118 A 38 38 0 0 0 80 42" fill="#0D2E5C" opacity="0.38" />
          </g>
        </svg>
      `;

    case "mars":
      specificFeatures = `
        <clipPath id="clip-canvas-${id}">
          <circle cx="${cx}" cy="${cy}" r="${r}" />
        </clipPath>
        <g clip-path="url(#clip-canvas-${id})">
          <ellipse cx="${cx}" cy="${cy - r + 4}" rx="14" ry="6" fill="#FFFFFF" opacity="0.9" />
          <path d="M ${cx - 20} ${cy + 3} Q ${cx} ${cy - 3} ${cx + 20} ${cy + 6}" stroke="${aCol}" stroke-width="5" stroke-linecap="round" fill="none" />
        </g>
      `;
      break;

    case "jupiter":
      specificFeatures = `
        <clipPath id="clip-canvas-${id}">
          <circle cx="${cx}" cy="${cy}" r="${r}" />
        </clipPath>
        <g clip-path="url(#clip-canvas-${id})">
          <!-- Rotasi Poros: Sabuk Awan Gas & Bintik Merah Raksasa -->
          <g class="jupiter-clouds-drift">
            <rect x="${cx - r - 20}" y="${cy - 28}" width="${r * 2 + 40}" height="9" fill="${aCol}" opacity="0.8" />
            <rect x="${cx - r - 20}" y="${cy - 12}" width="${r * 2 + 40}" height="7" fill="#F4E0C0" opacity="0.7" />
            <rect x="${cx - r - 20}" y="${cy}" width="${r * 2 + 40}" height="11" fill="${aCol}" opacity="0.85" />
            <rect x="${cx - r - 20}" y="${cy + 16}" width="${r * 2 + 40}" height="8" fill="#F4E0C0" opacity="0.65" />
            <ellipse cx="${cx + 18}" cy="${cy + 6}" rx="11" ry="8" fill="#9E2A2B" />
          </g>
        </g>
      `;
      break;

    case "saturn":
      return `
        <svg class="planet-canvas-svg" viewBox="0 0 180 160" width="140" height="120">
          <g transform="rotate(-22 90 80)">
            <ellipse cx="90" cy="80" rx="82" ry="22" fill="none" stroke="#E9C46A" stroke-width="14" opacity="0.9" />
            <ellipse cx="90" cy="80" rx="90" ry="25" fill="none" stroke="#F4A261" stroke-width="4" opacity="0.7" />
          </g>
          <circle cx="90" cy="80" r="38" fill="#E9C46A" />
          <clipPath id="saturn-canvas-clip">
            <circle cx="90" cy="80" r="38" />
          </clipPath>
          <g clip-path="url(#saturn-canvas-clip)">
            <rect x="45" y="65" width="90" height="7" fill="#C59B27" opacity="0.5" />
            <rect x="45" y="77" width="90" height="8" fill="#DEB038" opacity="0.4" />
            <path d="M 90 42 A 38 38 0 0 1 128 80 A 38 38 0 0 1 90 118 A 38 38 0 0 0 90 42" fill="#75560C" opacity="0.32" />
          </g>
          <g transform="rotate(-22 90 80)">
            <path d="M 8 80 A 82 22 0 0 0 172 80" fill="none" stroke="#E9C46A" stroke-width="14" opacity="0.9" />
          </g>
        </svg>
      `;

    case "uranus":
      return `
        <svg class="planet-canvas-svg" viewBox="0 0 160 160" width="120" height="120">
          <g transform="rotate(78 80 80)">
            <ellipse cx="80" cy="80" rx="64" ry="14" fill="none" stroke="#B5E2FA" stroke-width="5" opacity="0.75" />
          </g>
          <circle cx="80" cy="80" r="34" fill="#83C5BE" />
          <path d="M 80 46 A 34 34 0 0 1 114 80 A 34 34 0 0 1 80 114 A 34 34 0 0 0 80 46" fill="#006D77" opacity="0.35" />
        </svg>
      `;

    case "neptune":
      specificFeatures = `
        <clipPath id="clip-canvas-${id}">
          <circle cx="${cx}" cy="${cy}" r="${r}" />
        </clipPath>
        <g clip-path="url(#clip-canvas-${id})">
          <path d="M ${cx - r} ${cy - 9} Q ${cx} ${cy - 15} ${cx + r} ${cy - 5}" stroke="#90E0EF" stroke-width="4.5" fill="none" opacity="0.8" />
          <ellipse cx="${cx - 8}" cy="${cy + 4}" rx="9" ry="6" fill="#03045E" opacity="0.8" />
        </g>
      `;
      break;

    case "pluto":
      specificFeatures = `
        <clipPath id="clip-canvas-${id}">
          <circle cx="${cx}" cy="${cy}" r="${r}" />
        </clipPath>
        <g clip-path="url(#clip-canvas-${id})">
          <path d="M ${cx - 3} ${cy - 3} C ${cx - 3} ${cy - 12}, ${cx - 16} ${cy - 12}, ${cx - 16} ${cy - 3} C ${cx - 16} ${cy + 7}, ${cx - 3} ${cy + 14}, ${cx - 3} ${cy + 17} C ${cx - 3} ${cy + 14}, ${cx + 10} ${cy + 7}, ${cx + 10} ${cy - 3} C ${cx + 10} ${cy - 12}, ${cx - 3} ${cy - 12}, ${cx - 3} ${cy - 3} Z" fill="#FFF1E6" opacity="0.9" />
        </g>
      `;
      break;

    case "ceres":
      specificFeatures = `
        <circle cx="${cx - 8}" cy="${cy - 6}" r="4" fill="${aCol}" opacity="0.7" />
        <circle cx="${cx - 2}" cy="${cy + 3}" r="3" fill="#FFFFFF" />
      `;
      break;

    case "haumea":
      return `
        <svg class="planet-canvas-svg" viewBox="0 0 140 140" width="100" height="100">
          <g transform="rotate(-15 70 70)">
            <ellipse cx="70" cy="70" rx="36" ry="21" fill="${pCol}" />
            <path d="M 70 49 A 36 21 0 0 1 106 70 A 36 21 0 0 1 70 91 A 36 21 0 0 0 70 49" fill="${aCol}" opacity="0.4" />
          </g>
        </svg>
      `;

    default:
      specificFeatures = "";
      break;
  }

  return `
    <svg class="planet-canvas-svg" viewBox="0 0 ${vbSize} ${vbSize}" width="${vbSize * 0.85}" height="${vbSize * 0.85}">
      <circle cx="${cx}" cy="${cy}" r="${r + 7}" fill="${gCol}" opacity="0.2" />
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="${pCol}" />
      ${specificFeatures}
      <path d="M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx + r} ${cy} A ${r} ${r} 0 0 1 ${cx} ${cy + r} A ${r} ${r} 0 0 0 ${cx} ${cy - r}" fill="${aCol}" opacity="0.38" />
    </svg>
  `;
}

/**
 * Membuat bintang-bintang 2D acak pada background
 */
function createStarfield(count) {
  const starsContainer = document.getElementById("stars-container");
  if (!starsContainer) return;

  const fragment = document.createDocumentFragment();

  for (let i = 0; i < count; i++) {
    const star = document.createElement("div");
    star.className = "star-dot";

    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const size = Math.random() < 0.7 ? 2 : Math.random() < 0.9 ? 3 : 4;
    const duration = 2 + Math.random() * 4;
    const delay = Math.random() * 5;
    const opacity = 0.3 + Math.random() * 0.7;

    star.style.left = `${x}vw`;
    star.style.top = `${y}vh`;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.opacity = opacity;
    star.style.animation = `starTwinkle ${duration}s ease-in-out ${delay}s infinite alternate`;

    fragment.appendChild(star);
  }

  starsContainer.appendChild(fragment);
}
