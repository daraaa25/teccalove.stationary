<script>
    // 1. DATA PRODUK (Pastikan nama file di folder assets sama dengan ini)
    const products = [
        { id: 1, name: 'Tyna Backpack', price: 80000, img: 'assets/tyna backpack.jpg' },
        { id: 2, name: 'Loza Backpack', price: 85000, img: 'assets/loza backpack.jpg' },
        { id: 3, name: 'Piwwy Backpack', price: 80000, img: 'assets/piwwy backpack.jpg' },
        { id: 4, name: 'Pocket Pall', price: 30000, img: 'assets/pocket pall.jpg' },
        { id: 5, name: 'Pink Dust', price: 25000, img: 'assets/pink dust.jpg' },
        { id: 6, name: 'Cloud Cuddle', price: 25000, img: 'assets/cloud cuddle.jpg' },
        { id: 7, name: 'Cakey', price: 20000, img: 'assets/cakey.jpg' },
        { id: 8, name: 'Doll Curator', price: 20000, img: 'assets/doll curator.jpg' },
        { id: 9, name: 'Fruity Vault', price: 20000, img: 'assets/fruity vault.jpg' },
        { id: 10, name: 'Gravity Flow', price: 5000, img: 'assets/gravity flow.jpg' },
        { id: 11, name: 'Infinite Chew', price: 15000, img: 'assets/infinite chew.jpg' },
        { id: 12, name: 'Whisper Mark', price: 4000, img: 'assets/whisper mark.jpg' },
        { id: 'b1', name: 'Starter Pack', price: 100000, img: 'assets/complete starter pack.jpg' },
        { id: 'b2', name: 'Writer Pack', price: 35000, img: 'assets/writers blockbuster.jpg' },
        { id: 'b3', name: 'Duo Pack', price: 75000, img: 'assets/carry essentials duo.jpg' }
    ];

    let cart = [];
    let userName = "";

    // 2. FUNGSI PINDAH HALAMAN
    function showPage(pageId, btn) {
        // Sembunyikan semua konten
        document.querySelectorAll('.tab-content').forEach(s => s.classList.remove('active-page'));
        // Tampilkan halaman yang dipilih
        document.getElementById(pageId).classList.add('active-page');
        
        // Atur tombol menu jadi Bold/Aktif
        document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active-tab'));
        if(btn) btn.classList.add('active-tab');
        
        // Jika buka halaman orders, gambar ulang isi keranjang
        if(pageId === 'orders') renderCart();
        window.scrollTo(0,0);
    }

    // 3. SISTEM LOGIN & LOGOUT
    function toggleLoginModal() {
        if (userName) {
            if (confirm("Ingin logout dari " + userName + "?")) {
                userName = "";
                document.getElementById('user-display-name').innerText = "Login";
                document.getElementById('user-avatar').src = "https://ui-avatars.com/api/?name=?&background=ffffff&color=F8B4FE";
            }
            return;
        }
        document.getElementById('login-modal').classList.remove('hidden');
    }

    function handleLogin() {
        const input = document.getElementById('name-input').value;
        if (input.trim() === "") return alert("Masukkan namamu dulu ya!");
        
        userName = input;
        document.getElementById('user-display-name').innerText = userName;
        // Membuat inisial profil otomatis
        document.getElementById('user-avatar').src = `https://ui-avatars.com/api/?name=${userName}&background=ffffff&color=F8B4FE`;
        document.getElementById('login-modal').classList.add('hidden');
    }

    // 4. SISTEM KERANJANG (CART)
    function addToCart(id) {
        if (!userName) {
            alert("Login dulu yuk sebelum belanja!");
            toggleLoginModal();
            return;
        }
        const product = products.find(p => p.id == id);
        const existing = cart.find(item => item.id == id);
        
        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({ ...product, qty: 1 });
        }
        updateCartBadge();
        alert(product.name + " masuk keranjang! ✨");
    }

    function updateCartBadge() {
        const count = cart.reduce((total, item) => total + item.qty, 0);
        const badge = document.getElementById('cart-count');
        badge.innerText = count;
        badge.classList.toggle('hidden', count === 0);
    }

    function renderCart() {
        const list = document.getElementById('cart-list');
        const summary = document.getElementById('cart-summary');
        
        if (cart.length === 0) {
            list.innerHTML = `<div class="bg-white/20 p-10 rounded-[40px] text-center text-white"><p class="text-xl">Keranjang Kosong...</p></div>`;
            summary.classList.add('hidden');
            return;
        }

        summary.classList.remove('hidden');
        list.innerHTML = "";
        let total = 0;

        cart.forEach((item, index) => {
            total += item.price * item.qty;
            list.innerHTML += `
                <div class="cart-item">
                    <img src="${item.img}" class="w-16 h-16 rounded-xl object-cover">
                    <div class="flex-grow">
                        <h4 class="font-bold">${item.name}</h4>
                        <p class="text-pink-500 font-bold">IDR ${(item.price * item.qty).toLocaleString()}</p>
                    </div>
                    <div class="flex items-center gap-2">
                        <button onclick="changeQty(${index}, -1)" class="w-7 h-7 bg-gray-100 rounded-full">-</button>
                        <span>${item.qty}</span>
                        <button onclick="changeQty(${index}, 1)" class="w-7 h-7 bg-gray-100 rounded-full">+</button>
                        <button onclick="removeItem(${index})" class="ml-2 text-red-500">X</button>
                    </div>
                </div>`;
        });
        document.getElementById('total-price').innerText = "IDR " + total.toLocaleString();
    }

    function changeQty(index, val) {
        if (cart[index].qty + val >= 1) {
            cart[index].qty += val;
            renderCart();
            updateCartBadge();
        }
    }

    function removeItem(index) {
        cart.splice(index, 1);
        renderCart();
        updateCartBadge();
    }

    function processPay() {
        document.getElementById('order-main').classList.add('hidden');
        document.getElementById('buyer-name').innerText = userName;
        document.getElementById('success-screen').classList.remove('hidden');
        cart = [];
        updateCartBadge();
    }

    // 5. TIMER COUNTDOWN
    function startTimer() {
        let s = 24 * 3600 - 1;
        setInterval(() => {
            let h = Math.floor(s/3600).toString().padStart(2,'0');
            let m = Math.floor((s%3600)/60).toString().padStart(2,'0');
            let sc = (s%60).toString().padStart(2,'0');
            document.getElementById('timer-display').innerText = `${h}:${m}:${sc}`;
            s--;
        }, 1000);
    }

    // Jalankan timer saat web dibuka
    startTimer();
</script>