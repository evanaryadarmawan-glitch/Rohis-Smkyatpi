/* =========================================================================
   ROHIS DATA LAYER — localStorage wrapper
   Situs ini statis (tanpa server/database), sehingga seluruh data konten
   (kegiatan, pengurus, aspirasi, jurnal) disimpan di localStorage browser.
   Admin panel membaca & menulis ke sini agar perubahan langsung tampil
   di halaman publik pada perangkat yang sama.
   ========================================================================= */

const ROHIS = {
    KEYS: {
        ACTIVITIES: 'rohis_activities_v1',
        PENGURUS: 'rohis_pengurus_v1',
        ASPIRASI: 'rohis_aspirasi_v1',
        JURNAL: 'rohis_jurnal_v1',
        ADMIN_PASS: 'rohis_admin_pass_v1',
        ADMIN_SESSION: 'rohis_admin_session_v1'
    },

    _get(key, fallback) {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        } catch (e) { return fallback; }
    },
    _set(key, value) {
        try { localStorage.setItem(key, JSON.stringify(value)); return true; }
        catch (e) { return false; }
    },
    _id() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); },

    /* ---------------- SEED DEFAULTS (hanya jika kosong) ---------------- */
    init() {
        if (!localStorage.getItem(this.KEYS.ACTIVITIES)) {
            this._set(this.KEYS.ACTIVITIES, [
                { id: this._id(), img: 'assets/img/foto1.jpg', tag: 'Rutin Jumat Wage', title: 'Istighosah Akbar & Doa Tolak Bala', desc: 'Majelis munajat spiritual bulanan yang diikuti oleh seluruh guru, karyawan, dan siswa demi keselamatan dunia dan akhirat.' },
                { id: this._id(), img: 'assets/img/foto2.jpg', tag: 'Tahunan', title: 'Gema Resolusi Jihad Hari Santri', desc: 'Penyelenggaraan pawai obor religi, upacara sakral adat sarungan, serta perlombaan baca kitab kuning antar kelas.' },
                { id: this._id(), img: 'assets/img/foto3.jpg', tag: 'Mingguan', title: 'Kajian Fiqih Kontemporer Remaja', desc: 'Pembahasan kritis interaktif mengenai etika bermedia sosial, tata cara ibadah yang valid, dan pembentukan moralitas.' }
            ]);
        }
        if (!localStorage.getItem(this.KEYS.PENGURUS)) {
            this._set(this.KEYS.PENGURUS, [
                { id: this._id(), nama: 'Ely Tri Rahayuningsih', jabatan: 'Lurah Rohis', wa: '62895322090541' },
                { id: this._id(), nama: 'Dwi Oktavianai', jabatan: 'Ketua 2', wa: '6289621412600' }
            ]);
        }
        if (!localStorage.getItem(this.KEYS.ASPIRASI)) this._set(this.KEYS.ASPIRASI, []);
        if (!localStorage.getItem(this.KEYS.JURNAL)) this._set(this.KEYS.JURNAL, []);
        if (!localStorage.getItem(this.KEYS.ADMIN_PASS)) this._set(this.KEYS.ADMIN_PASS, 'rohis2026');
    },

    /* ---------------- ACTIVITIES ---------------- */
    getActivities() { return this._get(this.KEYS.ACTIVITIES, []); },
    saveActivities(arr) { return this._set(this.KEYS.ACTIVITIES, arr); },
    addActivity(item) {
        const arr = this.getActivities();
        arr.unshift({ id: this._id(), ...item });
        return this.saveActivities(arr);
    },
    updateActivity(id, item) {
        const arr = this.getActivities().map(a => a.id === id ? { ...a, ...item } : a);
        return this.saveActivities(arr);
    },
    deleteActivity(id) {
        return this.saveActivities(this.getActivities().filter(a => a.id !== id));
    },

    /* ---------------- PENGURUS ---------------- */
    getPengurus() { return this._get(this.KEYS.PENGURUS, []); },
    savePengurus(arr) { return this._set(this.KEYS.PENGURUS, arr); },
    addPengurus(item) {
        const arr = this.getPengurus();
        arr.push({ id: this._id(), ...item });
        return this.savePengurus(arr);
    },
    deletePengurus(id) {
        return this.savePengurus(this.getPengurus().filter(p => p.id !== id));
    },

    /* ---------------- ASPIRASI ---------------- */
    getAspirasi() { return this._get(this.KEYS.ASPIRASI, []); },
    addAspirasi(item) {
        const arr = this.getAspirasi();
        arr.push({ id: this._id(), waktu: new Date().toLocaleString('id-ID'), dibaca: false, ...item });
        return this._set(this.KEYS.ASPIRASI, arr);
    },
    markAspirasiRead(id) {
        const arr = this.getAspirasi().map(a => a.id === id ? { ...a, dibaca: true } : a);
        return this._set(this.KEYS.ASPIRASI, arr);
    },
    deleteAspirasi(id) {
        return this._set(this.KEYS.ASPIRASI, this.getAspirasi().filter(a => a.id !== id));
    },
    clearAspirasi() { return this._set(this.KEYS.ASPIRASI, []); },

    /* ---------------- JURNAL YAUMI ---------------- */
    getJurnal() { return this._get(this.KEYS.JURNAL, []); },
    addJurnal(item) {
        const arr = this.getJurnal();
        arr.push({ id: this._id(), ...item });
        return this._set(this.KEYS.JURNAL, arr);
    },
    deleteJurnal(id) {
        return this._set(this.KEYS.JURNAL, this.getJurnal().filter(j => j.id !== id));
    },
    clearJurnal() { return this._set(this.KEYS.JURNAL, []); },

    /* ---------------- ADMIN AUTH (proteksi ringan sisi-klien) ---------------- */
    auth: {
        checkPassword(pw) { return pw === ROHIS._get(ROHIS.KEYS.ADMIN_PASS, 'rohis2026'); },
        setPassword(pw) { return ROHIS._set(ROHIS.KEYS.ADMIN_PASS, pw); },
        login() { sessionStorage.setItem(ROHIS.KEYS.ADMIN_SESSION, '1'); },
        logout() { sessionStorage.removeItem(ROHIS.KEYS.ADMIN_SESSION); },
        isLoggedIn() { return sessionStorage.getItem(ROHIS.KEYS.ADMIN_SESSION) === '1'; }
    }
};

ROHIS.init();
