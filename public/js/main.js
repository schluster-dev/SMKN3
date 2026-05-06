/**
 * Main Interaction Script for SMKN 3 Linggabuana Portal
 * Arsitektur Digital oleh Ridho Kiswanto
 */

document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            // Logika Toggle Menu Mobile
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('flex');
            
            // Opsional: Animasi fade in sederhana
            if (!mobileMenu.classList.contains('hidden')) {
                mobileMenu.style.opacity = '0';
                setTimeout(() => {
                    mobileMenu.style.opacity = '1';
                    mobileMenu.style.transition = 'opacity 0.3s ease-in-out';
                }, 10);
            }
        });
    }

    // Efek Scroll Navbar: Menambah blur saat di-scroll
    window.addEventListener('scroll', () => {
        const nav = document.querySelector('nav');
        if (window.scrollY > 20) {
            nav.classList.add('bg-white/90');
            nav.classList.remove('bg-white/70');
        } else {
            nav.classList.add('bg-white/70');
            nav.classList.remove('bg-white/90');
        }
    });
});

async function initSliderEngine() {
    const wrapper = document.getElementById('slider-wrapper');
    const loader = document.getElementById('slider-loader');
    
    try {
        // Ambil data post terbaru
        const response = await fetch('https://smkn3linggabuana.sch.id/wp-json/wp/v2/posts?_embed&per_page=5');
        const posts = await response.json();

        if (!posts || posts.length === 0) {
            wrapper.innerHTML = `<div class="flex h-full items-center justify-center text-white font-mono text-xs">Tidak ada artikel ditemukan.</div>`;
            return;
        }

        // Render Slide
        // Ganti bagian wrapper.innerHTML dengan ini
wrapper.innerHTML = posts.map((post, i) => {
    const imgUrl = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'https://via.placeholder.com/1200x600/0f172a/ffffff?text=Arsip+Digital';
    
    return `
    <div class="absolute inset-0 w-full h-full opacity-0 transition-opacity duration-1000 ease-in-out z-10 slide-item" data-index="${i}">
        <!-- Gambar Background -->
        <img src="${imgUrl}" class="absolute inset-0 w-full h-full object-cover transition-transform duration-[10s] scale-110 img-parallax" alt="bg">
        
        <!-- Overlay Gelap (Alpha) Agar Teks Terbaca -->
        <div class="absolute inset-0 z-20 bg-black/50 md:bg-gradient-to-r md:from-black/80 md:to-transparent"></div>

        <!-- Kontainer Teks - Pastikan z-30 agar di atas gambar dan overlay -->
        <div class="relative z-30 h-full flex items-center px-8 md:px-20 lg:px-32">
            <div class="max-w-3xl">
                <div class="overflow-hidden mb-4">
                    <span class="block translate-y-full transition-transform duration-700 delay-300 text-blue-400 font-mono text-[10px] uppercase tracking-[0.5em] anim-el">
                        Arsip Terbaru
                    </span>
                </div>
                <div class="overflow-hidden mb-8">
                    <!-- Gunakan text-white agar kontras -->
                    <h2 class="translate-y-full transition-transform duration-700 delay-500 text-2xl md:text-5xl font-black text-white leading-tight uppercase anim-el">
                        ${post.title.rendered}
                    </h2>
                </div>
                <div class="overflow-hidden">
                    <a href="/posts/${post.slug}" class="translate-y-full transition-transform duration-700 delay-700 inline-flex items-center gap-4 bg-blue-600 px-6 py-3 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-blue-600 transition-all anim-el">
                        Lihat Artikel
                    </a>
                </div>
            </div>
        </div>
    </div>
    `;
}).join('');

        let currentIdx = 0;
        const slides = document.querySelectorAll('.slide-item');

        function moveSlide(newIdx) {
            // Reset Slide Lama
            slides[currentIdx].classList.replace('opacity-100', 'opacity-0');
            slides[currentIdx].classList.remove('z-20');
            slides[currentIdx].querySelectorAll('.anim-el').forEach(el => el.style.transform = 'translateY(100%)');
            slides[currentIdx].querySelector('.img-parallax').style.transform = 'scale(1.1)';

            // Set Slide Baru
            currentIdx = (newIdx + slides.length) % slides.length;
            slides[currentIdx].classList.replace('opacity-0', 'opacity-100');
            slides[currentIdx].classList.add('z-20');
            
            // Jalankan Animasi
            setTimeout(() => {
                slides[currentIdx].querySelectorAll('.anim-el').forEach(el => el.style.transform = 'translateY(0)');
                slides[currentIdx].querySelector('.img-parallax').style.transform = 'scale(1)';
            }, 50);
        }

        // Jalankan slide pertama & hapus loader
        moveSlide(0);
        if(loader) loader.style.display = 'none';

        // Event Tombol
        document.getElementById('next-slide').onclick = () => moveSlide(currentIdx + 1);
        document.getElementById('prev-slide').onclick = () => moveSlide(currentIdx - 1);

        // Auto Play 7 detik
        setInterval(() => moveSlide(currentIdx + 1), 7000);

    } catch (err) {
        console.error("API Error:", err);
        wrapper.innerHTML = `<div class="flex h-full items-center justify-center text-red-500 font-mono text-xs">Gagal memuat data dari SMKN 3 Linggabuana.</div>`;
    }
}

document.addEventListener('DOMContentLoaded', initSliderEngine);