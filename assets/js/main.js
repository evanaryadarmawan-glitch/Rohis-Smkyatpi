/* ================= LOADING SCREEN ================= */
(function initLoader() {
    let hidden = false;
    function hideLoader() {
        if (hidden) return;
        hidden = true;
        const loader = document.getElementById('siteLoader');
        if (!loader) return;
        loader.classList.add('loader-hide');
        setTimeout(() => loader.remove(), 700);
    }
    window.addEventListener('load', () => setTimeout(hideLoader, 400));
    // Jaring pengaman agar loading screen tidak pernah tersangkut lebih dari 3 detik
    setTimeout(hideLoader, 3000);
})();

/* ================= TEMA GELAP/TERANG ================= */
function toggleVisionMode() {
    const root = document.documentElement;
    const target = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', target);
    localStorage.setItem('rohis_theme', target);
    document.querySelectorAll('.v-icon').forEach(el => {
        el.className = 'v-icon ' + (target === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon');
    });
}
(function initTheme() {
    const saved = localStorage.getItem('rohis_theme');
    if (saved === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
})();

/* ================= NAVIGASI MOBILE ================= */
function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    if (menu) menu.classList.toggle('open');
}

/* ================= WAKTU SHALAT REAL-TIME ================= */
async function sinkronisasiWaktuShalat() {
    const elShubuh = document.getElementById('shubuh');
    if (!elShubuh) return;
    try {
        const res = await fetch('https://api.aladhan.com/v1/timingsByCity?city=Semarang&country=Indonesia&method=2');
        const result = await res.json();
        const t = result.data.timings;
        document.getElementById('shubuh').innerText = t.Fajr;
        document.getElementById('dzuhur').innerText = t.Dhuhr;
        document.getElementById('ashar').innerText = t.Asr;
        document.getElementById('maghrib').innerText = t.Maghrib;
        document.getElementById('isya').innerText = t.Isha;
        document.getElementById('live-date').innerText = result.data.date.readable;
    } catch (err) {
        document.getElementById('shubuh').innerText = '04:26';
        document.getElementById('dzuhur').innerText = '11:43';
        document.getElementById('ashar').innerText = '14:59';
        document.getElementById('maghrib').innerText = '17:39';
        document.getElementById('isya').innerText = '18:53';
        document.getElementById('live-date').innerText = 'Mode Offline';
    }
}
document.addEventListener('DOMContentLoaded', sinkronisasiWaktuShalat);

/* ================= RENDER KEGIATAN TERBARU (dipakai di beranda) ================= */
function renderActivityCards(containerId, limit) {
    const el = document.getElementById(containerId);
    if (!el) return;
    const data = ROHIS.getActivities().slice(0, limit || 999);
    if (data.length === 0) {
        el.innerHTML = '<div class="empty-state">Belum ada dokumentasi kegiatan.</div>';
        return;
    }
    el.innerHTML = data.map(a => `
        <div class="activity-card">
            <img src="${a.img}" class="activity-img" alt="${a.title}" onerror="this.src='assets/img/logo.jpg'">
            <div class="activity-body">
                <span class="activity-tag">${a.tag}</span>
                <h4>${a.title}</h4>
                <p>${a.desc}</p>
            </div>
        </div>
    `).join('');
}

/* ================= RENDER KONTAK PENGURUS ================= */
function renderPengurusTable(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;
    const data = ROHIS.getPengurus();
    if (data.length === 0) {
        el.innerHTML = '<div class="empty-state">Belum ada data pengurus.</div>';
        return;
    }
    el.innerHTML = `
        <table style="width:100%;border-collapse:collapse;font-size:12px;min-width:400px;">
            <thead>
                <tr style="background:var(--bg-site);text-align:left;">
                    <th style="padding:10px;">Nama Lengkap</th>
                    <th style="padding:10px;">Amanah Jabatan</th>
                    <th style="padding:10px;">Aksi Hubungi</th>
                </tr>
            </thead>
            <tbody>
                ${data.map(p => `
                    <tr>
                        <td style="padding:10px;"><b>${p.nama}</b></td>
                        <td style="padding:10px;">${p.jabatan}</td>
                        <td style="padding:10px;"><a href="https://wa.me/${p.wa}" class="btn-wa" target="_blank"><i class="fa-brands fa-whatsapp"></i> Chat WA</a></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

/* ================= RENDER STRUKTUR PENGURUS (kartu, halaman Tentang) ================= */
function renderStrukturGrid(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;
    const data = ROHIS.getPengurus();
    if (data.length === 0) {
        el.innerHTML = '<div class="empty-state">Belum ada data pengurus.</div>';
        return;
    }
    // Contoh struktur render di dalam fungsi renderStrukturGrid
el.innerHTML = data.map(p => `
    <div class="struktur-card">
        <div class="struktur-avatar-wrapper">
            ${p.foto ? `<img src="${p.foto}" class="struktur-avatar" alt="${p.nama}">` : `<div class="struktur-avatar"><i class="fa-solid fa-user"></i></div>`}
        </div>
        <h4>${p.nama}</h4>
        <span>${p.jabatan}</span>
    </div>
`).join('');
}

/* ================= RENDER PEMBINA ROHIS (kartu, halaman Tentang) ================= */
function renderPembinaGrid(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;
    const data = ROHIS.getPembina();
    if (data.length === 0) {
        el.innerHTML = '<div class="empty-state">Belum ada data pembina.</div>';
        return;
    }
    
    el.className = data.length === 1 ? 'pembina-grid-center' : 'pembina-grid';

    el.innerHTML = data.map((p, i) => `
        <div class="card pembina-card" style="animation-delay:${i * 70}ms; text-align: center;">
            <span class="pembina-badge" style="margin: 0 auto 12px auto; display: inline-flex;"><i class="fa-solid fa-star"></i> Pembina</span>
            <div class="struktur-avatar" style="${p.foto ? 'padding:0;overflow:hidden;' : 'display:flex;align-items:center;justify-content:center;'}">
                ${p.foto ? `<img src="${p.foto}" style="width:100%;height:100%;object-fit:cover;border-radius:10px;">` : `<i class="fa-solid fa-chalkboard-user"></i>`}
            </div>
            <h4>${p.nama}</h4>
            <span>${p.jabatan}</span>
            ${p.keterangan ? `<p class="pembina-desc">${p.keterangan}</p>` : ''}
            ${p.wa ? `<a href="https://wa.me/${p.wa}" class="btn-wa" target="_blank" style="margin-top:10px;justify-content:center;"><i class="fa-brands fa-whatsapp"></i> Chat WA</a>` : ''}
        </div>
    `).join('');
}