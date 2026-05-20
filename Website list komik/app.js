// 1. Ambil semua elemen HTML yang kita butuhkan berdasarkan ID-nya
const formBacaan = document.getElementById('formBacaan');
const inputJudul = document.getElementById('judul');
const inputChapter = document.getElementById('chapter');
const inputStatus = document.getElementById('status');
const inputStatuskomik = document.getElementById('statuskomik');
const daftarBacaan = document.getElementById('daftarBacaan');

// 2. Ambil data lama dari localStorage (Flashdisk Browser), jika kosong buat array []
let listDataBacaan = JSON.parse(localStorage.getItem('gudangKomik')) || [];

// Langsung gambar ke layar jika ada data lama pas web dibuka
tampilkanKeLayar();

// 3. Logika saat tombol Submit diklik
formBacaan.addEventListener('submit', function(event) {
    event.preventDefault();

    const waktuSekarang = new Date();
    const waktuFormat = waktuSekarang.toLocaleString('id-ID');

    const catatanBaru = {
        judul: inputJudul.value,
        chapter: inputChapter.value,
        status: inputStatus.value,
        statuskomik: inputStatuskomik.value,
        waktu: waktuFormat
    };

    listDataBacaan.push(catatanBaru);

    // Simpan ke localStorage
    localStorage.setItem('gudangKomik', JSON.stringify(listDataBacaan));

    formBacaan.reset();
    tampilkanKeLayar();
});

// 4. Fungsi untuk menggambar data ke Tampilan HTML
function tampilkanKeLayar() {
    daftarBacaan.innerHTML = '';

    if (listDataBacaan.length === 0) {
        daftarBacaan.innerHTML = '<p class="pesan-kosong">Belum ada catatan. Yuk input bacaan pertamamu!</p>';
        return;
    }

    // `index` di sini berfungsi sebagai nomor urut absen kartu (0, 1, 2, dst)
    listDataBacaan.forEach(function(item, index) {
        const kodinganKartu = `
            <div class="card">
                <h4>${item.judul}</h4>
                <p>Status: <b>${item.status}</b> | <b>${item.statuskomik}</b> | Terakhir di: <b>Chapter ${item.chapter}</b></p>
                <p class="timeline">🕒 Dibaca pada: ${item.waktu}</p>
                
                <!-- Trik Kunci: Tombol hapus dititipkan nomor indeks kartunya -->
                <button class="btn-hapus" onclick="hapusCatatan(${index})">❌ Hapus</button>
            </div>
        `;
        daftarBacaan.innerHTML += kodinganKartu;
    });
}

// 5. [BARU] Fungsi Otak untuk Menghapus Catatan
function hapusCatatan(nomorUrut) {
    // Tanyakan dulu ke user biar tidak sengaja kehapus
    if (confirm("Apakah kamu yakin ingin menghapus catatan ini?")) {
        
        // Rumus JavaScript untuk membuang 1 item berdasarkan nomor urutnya
        listDataBacaan.splice(nomorUrut, 1);

        // Setelah dibuang dari array, update data baru ke localStorage agar sinkron
        localStorage.setItem('gudangKomik', JSON.stringify(listDataBacaan));

        // Gambar ulang layar agar kartu yang dihapus langsung hilang dari pandangan
        tampilkanKeLayar();
    }
}
// Tambahkan fungsi ini di paling bawah file app.js kamu

function ubahTema() {
    // 1. Ambil elemen body
    const body = document.body;
    // 2. Ambil elemen tombol saklar
    const tombol = document.getElementById('btn-tema');

    // 3. FITUR UTAMA: .toggle() otomatis pasang/lepas kelas 'dark-mode'
    body.classList.toggle('dark-mode');

    // 4. Ganti tulisan tombolnya biar interaktif
    if (body.classList.contains('dark-mode')) {
        tombol.innerText = "☀️ Mode Terang";
    } else {
        tombol.innerText = "🌙 Mode Gelap";
    }
}
