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

// 4. Fungsi untuk menggambar data ke Tampilan HTML (SUDAH DI-UPGRADE DENGAN COUNTER)
function tampilkanKeLayar() {
    daftarBacaan.innerHTML = '';

    // [UPGRADE] Update Angka Total Judul Otomatis ke HTML
    const elemenTotal = document.getElementById('total-judul');
    if (elemenTotal) {
        elemenTotal.innerText = listDataBacaan.length;
    }

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
                
                <button class="btn-hapus" onclick="hapusCatatan(${index})">❌ Hapus</button>
            </div>
        `;
        daftarBacaan.innerHTML += kodinganKartu;
    });
}

// 5. Fungsi Otak untuk Menghapus Catatan (DITAMBAH RESET FILTER SEARCH)
function hapusCatatan(nomorUrut) {
    if (confirm("Apakah kamu yakin ingin menghapus catatan ini?")) {
        // Rumus JavaScript untuk membuang 1 item berdasarkan nomor urutnya
        listDataBacaan.splice(nomorUrut, 1);

        // Setelah dibuang dari array, update data baru ke localStorage agar sinkron
        localStorage.setItem('gudangKomik', JSON.stringify(listDataBacaan));

        // Gambar ulang layar agar kartu yang dihapus langsung hilang dari pandangan
        tampilkanKeLayar();

        // Bersihkan kolom search jika sedang mengetik saat menghapus agar tidak bug
        const inputCari = document.getElementById('input-cari');
        if (inputCari) inputCari.value = '';
    }
}

// 6. Fungsi Logika untuk Mengubah Tema (Interaktif Dark Mode)
function ubahTema() {
    const body = document.body;
    const tombol = document.getElementById('btn-tema');

    body.classList.toggle('dark-mode');

    if (body.classList.contains('dark-mode')) {
        tombol.innerText = "☀️ Mode Terang";
    } else {
        tombol.innerText = "🌙 Mode Gelap";
    }
}

// =========================================================================
// [FITUR BARU] 7. Fungsi Pencarian Live Search (Sangat Ringan, Anti Lag)
// =========================================================================
function cariKomik() {
    const kataKunci = document.getElementById('input-cari').value.toLowerCase();
    const kartuKomik = document.getElementsByClassName('card');

    listDataBacaan.forEach(function(item, index) {
        // Pastikan kartunya ada di layar sebelum di-filter
        if (kartuKomik[index]) {
            if (item.judul.toLowerCase().includes(kataKunci)) {
                kartuKomik[index].style.display = "block";  // Munculkan jika cocok
            } else {
                kartuKomik[index].style.display = "none";   // Sembunyikan jika tidak cocok
            }
        }
    });
}

// =========================================================================
// [FITUR BARU] 8. Fungsi Backup Data (Unduh Jadi File Teks .txt)
// =========================================================================
function downloadBackup() {
    if (listDataBacaan.length === 0) {
        alert("Gagal backup, database komik kamu masih kosong!");
        return;
    }
    
    // Ubah array data menjadi teks string yang rapi
    const dataStr = JSON.stringify(listDataBacaan, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    // Bikin link download palsu lewat kodingan agar otomatis mengunduh
    const linkDownload = document.createElement('a');
    linkDownload.href = url;
    linkDownload.download = "backup_gudang_komik.txt"; 
    linkDownload.click();
    
    URL.revokeObjectURL(url);
}

// =========================================================================
// [FITUR BARU] 9. Fungsi Restore Data (Upload File untuk Balikin Data)
// =========================================================================
function uploadBackup(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const dataHasilUpload = JSON.parse(e.target.result);
            
            // Validasi apakah file yang diupload beneran data list array komik
            if (Array.isArray(dataHasilUpload)) {
                listDataBacaan = dataHasilUpload;
                
                // Masukkan kembali ke localStorage dan gambar ke layar
                localStorage.setItem('gudangKomik', JSON.stringify(listDataBacaan));
                tampilkanKeLayar();
                
                alert("🎉 Berhasil! Seluruh data bacaan komik kamu sudah kembali!");
            } else {
                alert("Format file tidak dikenali! Gunakan file .txt backup asli dari web ini.");
            }
        } catch (error) {
            alert("Gagal membaca file. Pastikan file tersebut tidak rusak.");
        }
    };
    reader.readAsText(file);
}