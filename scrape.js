import fs from 'fs';
import path from 'path';

// Konfigurasi URL Target
const BASE_URL = 'https://smkn3linggabuana.sch.id/wp-json/wp/v2';
const DATA_DIR = './src/data';

// Fungsi pembantu untuk mengunduh dan menyimpan JSON
async function fetchAndSave(endpoint, fileName) {
  try {
    console.log(`🚀 Sedang menyedot data [${fileName}] dari WordPress...`);
    // Mengambil limit maksimal 100 data per permintaan
    const response = await fetch(`${BASE_URL}/${endpoint}?per_page=100&_embed`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();

    // Pastikan folder tujuan src/data tersedia
    if (!fs.existsSync(DATA_DIR)){
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    // Tulis file json ke laptop
    fs.writeFileSync(path.join(DATA_DIR, fileName), JSON.stringify(data, null, 2));
    console.log(`✅ Sukses menyimpan: ${fileName} (${data.length} data)`);
  } catch (error) {
    console.error(`❌ Gagal menyedot [${fileName}]:`, error.message);
  }
}

async function jalankanSedotMassal() {
  console.log("\n=== MEMULAI PROSES PENYEDOTAN DATA FINAL SMKN 3 LINGGABUANA ===\n");
  
  // Eksekusi semua data penting sekaligus
  await fetchAndSave('posts', 'posts.json');
  await fetchAndSave('pages', 'pages.json');
  await fetchAndSave('categories', 'categories.json');
  await fetchAndSave('tags', 'tags.json');
  await fetchAndSave('media', 'media.json');

  console.log("\n========================================================");
  console.log("🎉 SEMUA DATA PENTING SELESAI DISIMPAN DI FOLDER LOKAL PC!");
  console.log("📂 Cek folder: src/data/");
  console.log("========================================================\n");
}

jalankanSedotMassal();