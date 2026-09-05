# PRD (Product Requirement Document)
## Real-Time Modern Chat Web Application ("PulseChat")

---

### 1. Executive Summary & Objective
Membangun web aplikasi chatting modern berkinerja tinggi dengan feel/interaksi *native app* (mengadopsi kesederhanaan WhatsApp Web, visual dinamis Instagram DM, dan micro-interaction responsif TikTok Direct Messages).

---

### 2. Target Persona & Use Cases
- **Persona:** Generasi Z & Milenial yang terbiasa dengan chatting berbasis media, stiker, reaksi emoji cepat, dan navigasi geser/tap instan.
- **Use Cases:**
  - Chat personal (1-on-1) real-time dengan status pengiriman akurat.
  - Chat grup dengan kontrol admin dan avatar grup.
  - Berbagi media kaya (foto, video pendek/reels, voice notes).
  - Sinkronisasi instan saat berpindah perangkat (desktop & mobile browser).

---

### 3. Core Functional Requirements (MVP)

#### 3.1 Authentication & Profile
- Registrasi/Login via Telepon/Email & OAuth (Google/Apple).
- Manajemen Profil: Username unik, display name, avatar, status bio, dan preferensi privasi (terakhir dilihat / last seen, centang biru).

#### 3.2 Real-time Messaging
- Pengiriman teks kilat (<100ms lokal) via WebSocket / WebRTC DataChannel.
- Status pesan berjenjang:
  - `Pending` (ikon jam)
  - `Sent` (centang abu-abu satu)
  - `Delivered` (centang abu-abu dua)
  - `Read` (centang biru ganda / avatar kecil pemirsa)
- Indikator kehadiran (*Presence*): "Online", "Terakhir dilihat ...", dan "Sedang mengetik... / Typing...".

#### 3.3 Rich Interactive Features
- **Balas Pesan (Quote / Thread Reply):** Menyorot pesan yang dirujuk dengan preview ringkas.
- **Reaksi Emoji Cepat (Instagram/TikTok style):** Double-tap pesan untuk memberi love, atau long-press/hover untuk picker 6 emoji utama (+ custom emoji drawer).
- **Voice Notes (WhatsApp style):** Tombol tahan untuk rekam, waveform dinamis, visualisasi durasi, dan fitur dengar sebelum kirim.
- **Pemberitahuan & Unread Badges:** Indikator visual pesan belum terbaca dengan counter numerik yang akurat.
- **Hapus & Edit Pesan:** Hapus untuk semua orang (dalam batas toleransi 15 menit) atau hapus hanya untuk saya.

---

### 4. Non-Functional Requirements

| Dimensi | Spesifikasi |
|---|---|
| **Latensi Pengiriman** | < 150ms roundtrip (RTT) pada koneksi 4G/WiFi stabil |
| **Ketersediaan (SLA)** | 99.9% uptime dengan clustering Socket server |
| **Enkripsi & Keamanan** | TLS 1.3 in-transit, enkripsi AES-256 at-rest, hashing Argon2id untuk kredensial |
| **Responsivitas UI** | PWA-ready, 60fps animasi transition, LCP < 1.2 detik |
| **Kapasitas Media** | Foto maksimal 10MB (otomatis kompres WebP), Video maksimal 50MB, Audio Opus/AAC |
