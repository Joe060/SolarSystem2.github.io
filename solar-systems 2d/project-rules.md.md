# Project Overview
Project Name: Interactive Solar System Explorer
Description: Web edukatif tata surya interaktif berbasis "Spatial Canvas Navigation" dengan 3 fase utama (Loading Screen, Lobby Orbit, dan Explore Detail).
Visual Style: 2D Flat Vector bergaya "Kurzgesagt" (warna solid, cerah, flat shading).

# Application Flow & States
Aplikasi memiliki 3 fase utama yang dikendalikan via JavaScript & GSAP:

1. **Loading Screen:**
   - Menampilkan maskot "Mas Amba" (seorang astronot berkulit hitam yang menunggangi roket layaknya kuda).
   - Animasi: Mas Amba melesat dari kiri layar ke tengah.
   - Teks perkenalan: "Halo! Saya Mas Amba dari planet Ngawi nanjauh disana..."

2. **Lobby (Dashboard Interaktif):**
   - Kamera berada dalam mode *Zoom Out* maksimal. Menampilkan seluruh tata surya (Matahari di tengah, dan planet-planet berukuran proporsional mengorbit secara terus-menerus).
   - UI Lobby: Terdapat sidebar/menu informasi di sebelah kanan.
   - Interaksi Maskot: Mas Amba standby menyapa pengguna, "Siap untuk menjelajah tata surya kita?".
   - Terdapat tombol utama: "Meluncur!!".

3. **Explore Mode (Spatial Canvas Zoom Navigation):**
   - Mengusung konsep *Pan & Zoom* seperti Google Maps.
   - Seluruh benda langit berada dalam satu container raksasa (`#space-canvas`).
   - Saat tombol "Meluncur!!" diklik: Kamera/canvas melakukan transisi GSAP Zoom-In ekstrem menuju Matahari diiringi animasi Mas Amba yang melesat ke arah yang sama.
   - Saat berpindah planet (misal Merkurius ke Venus): Kamera akan bergeser (panning) secara mulus melintasi angkasa menuju koordinat planet tujuan, lalu melakukan zoom pada planet tersebut.
   - UI Explore: Saat kamera fokus pada sebuah planet, Panel Kartu Informasi (Overlay Information Card) dan Mas Amba akan muncul secara *overlay* / melayang di samping planet tersebut.

# Advanced Visual & Animation Rules
1. **Animasi Benda Langit (Lebih Hidup):**
   - **Matahari:** Memiliki animasi lidah api/plasma yang sesekali melontar (SVG animation/CSS keyframes).
   - **Planet:** Terlihat berputar pada porosnya (rotasi).
   - **Satelit/Bulan:** Bulan mengorbit mengelilingi planetnya masing-masing. Skala bulan harus terlihat jauh lebih kecil dari planetnya.
2. **Aturan Konten Data:**
   - HANYA sebutkan nama bulan-bulan utama, sisanya sebutkan angkanya saja.
   - Tambahkan properti `travelTimeFromEarth` (estimasi waktu tempuh dari Bumi menggunakan teknologi pesawat luar angkasa saat ini) untuk setiap planet dan planet kerdil di `data.js`.

# Development Steps for AI Agent
PENTING: Kerjakan bertahap sesuai instruksi user.
- **Step 1 (Struktur & Data):** Update `data.js` (tambah `travelTimeFromEarth`) dan rombak `index.html` menjadi 3 kontainer fase (`#loading-screen`, `#lobby-screen`, `#space-canvas-container`).
- **Step 2 (Visual & Styling):** Buat CSS/SVG untuk Loading Screen, Maskot Mas Amba, dan desain layout peta spasial tata surya.
- **Step 3 (Animasi & Logika Navigasi):** Implementasikan GSAP untuk animasi orbit, transisi meluncur, dan sistem kamera *Pan & Zoom* spasial antar planet.