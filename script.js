  /* --------------------------- Simpanan data (localStorage) --------------------------- */
    const DB = {
      usersKey:'asuraku_users_v1',
      authKey:'asuraku_auth_v1',
      historyKey:'asuraku_hist_v1',
      productsKey:'asuraku_products_v1'
    }

    // contoh produk (minimal 3 per jenis)
    const sampleProducts = [
  {
    id:'k1',
    type:'kesehatan',
    title:'HealthCare Silver',
    company:'NiSi Health',
    price:2000000,
    summary:'Perlindungan dasar rawat inap',
    image:'img/HPsilver.png'
  },
  {
    id:'k2',
    type:'kesehatan',
    title:'HealthCare Gold',
    company:'NiSi Health',
    price:3500000,
    summary:'Perlindungan lengkap rawat jalan & inap',
    image:'img/HCgold.png'
  },
  {
    id:'k3',
    type:'kesehatan',
    title:'Proteksi Keluarga',
    company:'NiSi Health',
    price:2500000,
    summary:'Perlindungan keluarga kecil',
    image:'https://img.icons8.com/color/96/family.png'
  },
  {
    id:'m1',
    type:'mobil',
    title:'AutoCare Basic',
    company:'NiSi Auto',
    price:0,
    summary:'Asuransi all-risk untuk mobil baru',
    image:'https://img.icons8.com/color/96/car.png'
  },
  {
    id:'m2',
    type:'mobil',
    title:'AutoCare Plus',
    company:'NiSi Auto',
    price:0,
    summary:'All-risk + jaminan kecelakaan diri',
    image:'https://img.icons8.com/color/96/car-insurance.png'
  },
  {
    id:'m3',
    type:'mobil',
    title:'Third-Party Protect',
    company:'NiSi Auto',
    price:0,
    summary:'Tanggung jawab pihak ketiga',
    image:'https://img.icons8.com/color/96/traffic-jam.png'
  },
  {
    id:'j1',
    type:'jiwa',
    title:'LifeSecure 1M',
    company:'NiSi Life',
    price:1000000,
    summary:'Pertanggungan Rp1.000.000.000',
    image:'https://img.icons8.com/color/96/heart-with-pulse.png'
  },
  {
    id:'j2',
    type:'jiwa',
    title:'LifeSecure 2M',
    company:'NiSi Life',
    price:2000000,
    summary:'Pertanggungan Rp2.000.000.000',
    image:'https://img.icons8.com/color/96/like--v3.png'
  },
  {
    id:'j3',
    type:'jiwa',
    title:'LifePremium 5M',
    company:'NiSi Life',
    price:5000000,
    summary:'Pertanggungan tinggi untuk keluarga',
    image:'https://img.icons8.com/color/96/security-checked.png'
  }
];


    function initProducts(){
      if(!localStorage.getItem(DB.productsKey)){
        localStorage.setItem(DB.productsKey,JSON.stringify(sampleProducts));
      }
    }

    initProducts();

    /* --------------------------- Utilitas Validasi --------------------------- */
    function isValidEmail(email){
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    function onlyDigits(str){return /^\d+$/.test(str);} 

    /* --------------------------- Auth Sim (localStorage) --------------------------- */
    function getUsers(){return JSON.parse(localStorage.getItem(DB.usersKey)||'[]')}
    function saveUsers(u){localStorage.setItem(DB.usersKey,JSON.stringify(u))}
    function setAuth(email){localStorage.setItem(DB.authKey,email)}
    function getAuth(){return localStorage.getItem(DB.authKey)}
    function logout(){localStorage.removeItem(DB.authKey); renderNavUser(); location.hash='#/' }

    /* --------------------------- Router (hash) --------------------------- */
    const app = document.getElementById('app');

    function renderNavUser(){
      const ua = document.getElementById('user-area');
      const email = getAuth();
      if(email){
        ua.innerHTML = `<div style="display:flex;gap:8px;align-items:center"><div class="muted small">${email}</div><button class="btn-ghost" onclick="logout()">Logout</button></div>`;
      } else {
        ua.innerHTML = `<a class="btn" href="#/login">Login</a> <a class="btn" href="#/signup" style="background:var(--accent);">Sign up</a>`;
      }
    }

    window.addEventListener('hashchange', renderRoute);
    renderNavUser();

    function renderRoute(){
      const hash = location.hash || '#/';
      const [_,route, param] = hash.split('/');
      if(route==='login') renderLogin();
      else if(route==='signup') renderSignup();
      else if(route==='products') renderProducts();
      else if(route==='product') renderProductDetail(param);
      else if(route==='buy') renderBuy(param);
      else if(route==='checkout') renderCheckout();
      else if(route==='history') renderHistory();
      else renderHome();
      renderNavUser();
    }

    /* --------------------------- Views --------------------------- */
    function renderHome(){
      const products = JSON.parse(localStorage.getItem(DB.productsKey)||'[]');
      app.innerHTML = `
        <section class="hero card" style="background:linear-gradient(180deg,rgba(255,255,255,0.6),transparent)">
          <div class="left">
            <span class="badge">Marketplace</span>
            <h2>Membandingkan & Membeli Produk Asuransi dengan Mudah</h2>
            <p class="muted">Pilih asuransi kesehatan, mobil, atau jiwa dari berbagai penyedia. Buat akun dan kelola histori pembelian Anda.</p>
            <div style="margin-top:12px"><a class="btn" href="#/products">Lihat Produk</a></div>
          </div>
          <div class="right" style="min-width:220px;text-align:right">
            <img src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=60" style="width:200px;border-radius:10px;object-fit:cover"/>
          </div>
        </section>

        <section class="card products">
          <div class="meta"><h3>Produk Populer</h3><div class="muted small">${products.length} produk tersedia</div></div>
          <div class="grid">
            ${products.slice(0,6).map(p=>`<div class="card product-card"><img src="https://source.unsplash.com/collection/190727/300x200?sig=${p.id}"/><div style="flex:1"><div style="font-weight:700">${p.title}</div><div class="muted small">${p.company} • ${p.type}</div></div><div><a class="btn" href="#/product/${p.id}">Detail</a></div></div>`).join('')}
          </div>
        </section>
      `;
    }

    /* --------------------------- Login --------------------------- */
    function renderLogin(){
      app.innerHTML = `
        <section class="card" style="max-width:480px;margin:0 auto">
          <h3>Login</h3>
          <form id="loginForm">
            <label>Email</label>
            <input type="email" name="email" required />
            <label>Password</label>
            <input type="password" name="password" required />
            <div style="margin-top:12px;display:flex;gap:8px;justify-content:space-between;align-items:center">
              <button class="btn">Login</button>
              <a href="#/signup" class="muted small">Tidak punya akun? Daftar</a>
            </div>
            <div id="loginMsg" class="helper"></div>
          </form>
        </section>
      `;

      document.getElementById('loginForm').addEventListener('submit',function(e){
        e.preventDefault();
        const f = e.target;
        const email = f.email.value.trim();
        const pass = f.password.value;
        const msg = document.getElementById('loginMsg');
        if(!email||!pass){ msg.textContent='Email dan kata sandi harus diisi'; return; }
        if(!isValidEmail(email)){ msg.textContent='Format email tidak valid'; return; }
        const users = getUsers();
        const user = users.find(u=>u.email===email && u.password===pass);
        if(!user){ msg.textContent='Email atau kata sandi salah'; return; }
        setAuth(email);
        msg.style.color='green'; msg.textContent='Login berhasil! Mengarahkan...';
        renderNavUser();
        setTimeout(()=>{ location.hash='#/'; renderRoute(); },600);
      })
    }

    /* --------------------------- Signup --------------------------- */
    function renderSignup(){
      app.innerHTML = `
        <section class="card" style="max-width:640px;margin:0 auto">
          <h3>Sign Up</h3>
          <form id="signupForm">
            <label>Email</label><input name="email" type="email" required />
            <label>Password</label><input name="password" type="password" required />
            <label>Konfirmasi Password</label><input name="confirm" type="password" required />
            <label>Nama Lengkap</label><input name="name" type="text" required />
            <label>Nomor HP</label><input name="phone" type="text" required />
            <div style="margin-top:12px;display:flex;gap:8px;justify-content:space-between;align-items:center">
              <button class="btn">Daftar</button>
              <div style="display:flex;gap:8px"><a class="muted small" href="#/">Kembali ke Home</a><a class="muted small" href="#/login">Sudah punya akun? Login</a></div>
            </div>
            <div id="signupMsg" class="helper"></div>
          </form>
        </section>
      `;

      document.getElementById('signupForm').addEventListener('submit',function(e){
        e.preventDefault();
        const f = e.target; const email=f.email.value.trim(); const pw=f.password.value; const conf=f.confirm.value; const name=f.name.value.trim(); const phone=f.phone.value.trim();
        const msg = document.getElementById('signupMsg'); msg.style.color='';
        if(!email||!pw||!name||!phone){ msg.textContent='Email, kata sandi, nama lengkap, dan nomor handphone harus diisi'; return; }
        if(!isValidEmail(email)){ msg.textContent='Format email tidak valid'; return; }
        if(pw.length<8){ msg.textContent='Kata sandi minimal 8 karakter'; return; }
        if(pw!==conf){ msg.textContent='Kata sandi dan konfirmasi tidak cocok'; return; }
        if(name.length<3||name.length>32||/\d/.test(name)){ msg.textContent='Nama lengkap harus 3-32 karakter dan tidak boleh mengandung angka'; return; }
        if(!/^08\d{8,14}$/.test(phone)){ msg.textContent='Nomor HP harus diawali 08, hanya angka, panjang 10-16 digit'; return; }
        const users = getUsers();
        if(users.find(u=>u.email===email)){ msg.textContent='Email sudah terdaftar'; return; }
        users.push({email,password:pw,name,phone}); saveUsers(users);
        msg.style.color='green'; msg.textContent='Pendaftaran berhasil. Silakan login.';
        setTimeout(()=>{ location.hash='#/login'; renderRoute(); },900);
      })
    }

    /* --------------------------- Products List --------------------------- */
function renderProducts(){
  const products = JSON.parse(localStorage.getItem(DB.productsKey)||'[]');
  app.innerHTML = `
    <section class="card">
      <h3>Semua Produk</h3>
      <div class="grid">
        ${products.map(p=>`
          <div class="card product-card" style="display:flex;align-items:center;gap:12px">
            <img src="${p.image}" alt="${p.title}" style="width:80px;height:80px;object-fit:contain"/>
            <div style="flex:1">
              <div style="font-weight:700">${p.title}</div>
              <div class="muted small">${p.company} • ${p.type}</div>
              <p class="muted">${p.summary}</p>
            </div>
            <div><a class="btn" href="#/product/${p.id}">Lihat</a></div>
          </div>
        `).join('')}
      </div>
    </section>
  `;
}

    /* --------------------------- Product Detail --------------------------- */
function renderProductDetail(id){
  const products = JSON.parse(localStorage.getItem(DB.productsKey)||'[]');
  const p = products.find(x=>x.id===id);
  if(!p){ app.innerHTML='<div class="card">Produk tidak ditemukan</div>'; return; }
  app.innerHTML = `
    <section class="card" style="max-width:900px;margin:0 auto">
      <div style="display:flex;gap:20px;align-items:flex-start">
        <img src="${p.image}" alt="${p.title}" 
             style="width:320px;height:200px;object-fit:contain;border-radius:10px"/>
        <div style="flex:1">
          <h3>${p.title}</h3>
          <div class="muted">${p.company} • ${p.type}</div>
          <p class="muted">${p.summary}</p>
          <div style="margin-top:12px"><a class="btn" href="#/buy/${p.id}">Beli Produk</a></div>
        </div>
      </div>
    </section>
  `;
}

    /* --------------------------- Buy (show form per type) --------------------------- */
    function requireAuthRedirect(){ if(!getAuth()){ alert('Anda harus login untuk mengakses halaman ini'); location.hash='#/login'; return false } return true }

    function renderBuy(productId){
      if(!requireAuthRedirect()) return;
      const products = JSON.parse(localStorage.getItem(DB.productsKey)||'[]');
      const p = products.find(x=>x.id===productId);
      if(!p){ app.innerHTML='<div class="card">Produk tidak ditemukan</div>'; return; }

      if(p.type==='mobil') renderBuyMobil(p);
      else if(p.type==='kesehatan') renderBuyKesehatan(p);
      else if(p.type==='jiwa') renderBuyJiwa(p);
      else app.innerHTML='<div class="card">Jenis produk tidak dikenali</div>';
    }

    /* -------- Mobil Form & Premi ---------- */
    function renderBuyMobil(p){
      app.innerHTML = `
        <section class="card" style="max-width:800px;margin:0 auto">
          <h3>Beli — ${p.title}</h3>
          <form id="mobilForm">
            <label>Merk Mobil</label><input name="merk" required />
            <label>Jenis Mobil</label><input name="jenis" required />
            <label>Tahun Pembuatan</label><input name="tahun" type="number" required />
            <label>Harga Mobil (angka, tanpa titik)</label><input name="harga" type="number" required />
            <label>Nomor Plat Mobil</label><input name="plat" required />
            <label>Nomor Mesin</label><input name="nomesin" required />
            <label>Nomor Rangka</label><input name="norangka" required />
            <label>Nama Pemilik</label><input name="pemilik" required />
            <label>Upload Foto (tidak benar-benar diupload, hanya simpan nama file)</label>
            <input name="foto1" type="file" accept="image/*" />
            <input name="foto2" type="file" accept="image/*" />
            <input name="foto3" type="file" accept="image/*" />
            <input name="foto4" type="file" accept="image/*" />
            <input name="foto5" type="file" accept="image/*" />
            <input name="foto6" type="file" accept="image/*" />
            <div style="margin-top:12px;display:flex;gap:8px"><button class="btn">Hitung Premi & Checkout</button><a class="muted" href="#/products">Batal</a></div>
            <div id="mobilMsg" class="helper"></div>
          </form>
        </section>
      `;

      document.getElementById('mobilForm').addEventListener('submit',function(e){
        e.preventDefault();
        const f = e.target; const merk=f.merk.value.trim(); const jenis=f.jenis.value.trim(); const tahun=Number(f.tahun.value); const harga=Number(f.harga.value);
        const plat=f.plat.value.trim(); const nomesin=f.nomesin.value.trim(); const norangka=f.norangka.value.trim(); const pemilik=f.pemilik.value.trim();
        const msg = document.getElementById('mobilMsg'); msg.style.color='';
        if(!merk||!jenis||!tahun||!harga||!plat||!nomesin||!norangka||!pemilik){ msg.textContent='Semua field harus diisi'; return; }
        const tahunNow = new Date().getFullYear(); const umur = tahunNow - tahun;
        let premi;
        if(umur>=0 && umur<=3) premi = 0.025 * harga;
        else if(umur>3 && umur<=5){ if(harga < 200000000) premi = 0.04*harga; else premi = 0.03*harga; }
        else if(umur>5) premi = 0.05*harga;
        else { msg.textContent='Tahun pembuatan tidak valid'; return; }
        premi = Math.round(premi);
        const purchase = {id:'trx_'+Date.now(), productId:p.id, productTitle:p.title, type:'mobil', date:new Date().toLocaleString(), price:premi, raw:{merk,jenis,tahun,harga,plat,nomesin,norangka,pemilik}}
        // simpan sementara ke checkpoint checkout
        sessionStorage.setItem('checkout', JSON.stringify(purchase));
        location.hash = '#/checkout';
      })
    }

    /* -------- Kesehatan Form & Premi ---------- */
    function renderBuyKesehatan(p){
      app.innerHTML = `
        <section class="card" style="max-width:700px;margin:0 auto">
          <h3>Beli — ${p.title}</h3>
          <form id="kesForm">
            <label>Nama Lengkap (sesuai KTP)</label><input name="nama" required />
            <label>Tanggal Lahir</label><input name="ttl" type="date" required />
            <label>Pekerjaan</label><input name="job" required />
            <label>Merokok</label><select name="smoke"><option value="0">Tidak</option><option value="1">Ya</option></select>
            <label>Riwayat Hipertensi</label><select name="hip"><option value="0">Tidak</option><option value="1">Ya</option></select>
            <label>Diabetes</label><select name="diab"><option value="0">Tidak</option><option value="1">Ya</option></select>
            <div style="margin-top:12px;display:flex;gap:8px"><button class="btn">Hitung Premi & Checkout</button><a class="muted" href="#/products">Batal</a></div>
            <div id="kesMsg" class="helper"></div>
          </form>
        </section>
      `;

      document.getElementById('kesForm').addEventListener('submit',function(e){
        e.preventDefault();
        const f = e.target; const nama=f.nama.value.trim(); const ttl=f.ttl.value; const job=f.job.value.trim(); const smoke=Number(f.smoke.value); const hip=Number(f.hip.value); const diab=Number(f.diab.value);
        const msg = document.getElementById('kesMsg'); msg.style.color='';
        if(!nama||!ttl||!job){ msg.textContent='Semua field harus diisi'; return; }
        const dob = new Date(ttl); if(isNaN(dob)) { msg.textContent='Tanggal lahir tidak valid'; return; }
        const age = new Date().getFullYear() - dob.getFullYear();
        // m factor
        let m=0.2; if(age<=20) m=0.1; else if(age>20 && age<=35) m=0.2; else if(age>35 && age<=50) m=0.25; else if(age>50) m=0.4;
        const P = 2000000;
        const premi = Math.round(P + (m*P) + (smoke*0.5*P) + (hip*0.4*P) + (diab*0.5*P));
        const purchase = {id:'trx_'+Date.now(), productId:p.id, productTitle:p.title, type:'kesehatan', date:new Date().toLocaleString(), price:premi, raw:{nama,ttl,job,smoke,hip,diab,age}}
        sessionStorage.setItem('checkout', JSON.stringify(purchase)); location.hash='#/checkout';
      })
    }

    /* -------- Jiwa Form & Premi ---------- */
    function renderBuyJiwa(p){
      app.innerHTML = `
        <section class="card" style="max-width:600px;margin:0 auto">
          <h3>Beli — ${p.title}</h3>
          <form id="jiwaForm">
            <label>Nama Lengkap (sesuai KTP)</label><input name="nama" required />
            <label>Tanggal Lahir</label><input name="ttl" type="date" required />
            <label>Besaran Pertanggungan</label>
            <select name="tanggung">
              <option value="1000000000">Rp1.000.000.000</option>
              <option value="2000000000">Rp2.000.000.000</option>
              <option value="3500000000">Rp3.500.000.000</option>
              <option value="5000000000">Rp5.000.000.000</option>
              <option value="10000000000">Rp10.000.000.000</option>
            </select>
            <div style="margin-top:12px;display:flex;gap:8px"><button class="btn">Hitung Premi & Checkout</button><a class="muted" href="#/products">Batal</a></div>
            <div id="jiwaMsg" class="helper"></div>
          </form>
        </section>
      `;

      document.getElementById('jiwaForm').addEventListener('submit',function(e){
        e.preventDefault();
        const f = e.target; const nama=f.nama.value.trim(); const ttl=f.ttl.value; const t = Number(f.tanggung.value);
        const msg = document.getElementById('jiwaMsg'); msg.style.color='';
        if(!nama||!ttl||!t){ msg.textContent='Semua field harus diisi'; return; }
        const age = new Date().getFullYear() - new Date(ttl).getFullYear();
        let m = 0.002; if(age<=30) m=0.002; else if(age>30 && age<=50) m=0.004; else if(age>50) m=0.01;
        // premi per bulan = m * t
        const premi = Math.round(m * t / 1); // already per month basis
        const purchase = {id:'trx_'+Date.now(), productId:p.id, productTitle:p.title, type:'jiwa', date:new Date().toLocaleString(), price:premi, raw:{nama,ttl,age,t}}
        sessionStorage.setItem('checkout', JSON.stringify(purchase)); location.hash='#/checkout';
      })
    }

    /* --------------------------- Checkout --------------------------- */
    function renderCheckout(){
      if(!requireAuthRedirect()) return;
      const co = JSON.parse(sessionStorage.getItem('checkout')||'null');
      if(!co){ app.innerHTML='<div class="card">Tidak ada item untuk dibayar. Silakan pilih produk.</div>'; return; }
      app.innerHTML = `
        <section class="card" style="max-width:700px;margin:0 auto">
          <h3>Checkout</h3>
          <div style="display:flex;gap:20px">
            <div style="flex:1">
              <div style="font-weight:700">${co.productTitle}</div>
              <div class="muted small">Jenis: ${co.type}</div>
              <div style="margin-top:8px">Harga premi: <strong>Rp ${co.price.toLocaleString('id-ID')}</strong></div>
              <div style="margin-top:12px"><label>Pilih Metode Pembayaran</label><select id="paym"><option value="transfer">Transfer</option><option value="kartu">Kartu Kredit</option><option value="ovo">OVO</option></select></div>
            </div>
            <div style="width:220px"><div class="card" style="padding:12px"><div class="muted small">Ringkasan</div><div style="font-weight:700;margin-top:6px">Rp ${co.price.toLocaleString('id-ID')}</div></div></div>
          </div>
          <div style="margin-top:12px;display:flex;gap:8px"><button class="btn" id="doPay">Bayar</button><a class="muted" href="#/products">Batal</a></div>
        </section>
      `;

      document.getElementById('doPay').addEventListener('click',function(){
        // anggap pembayaran berhasil
        const hist = JSON.parse(localStorage.getItem(DB.historyKey)||'[]');
        const user = getAuth();
        const entry = {...co, paid:true, user};
        hist.push(entry); localStorage.setItem(DB.historyKey,JSON.stringify(hist));
        sessionStorage.removeItem('checkout');
        alert('Pembayaran berhasil. Mengarah ke halaman histori.');
        location.hash = '#/history';
      })
    }

    /* --------------------------- History --------------------------- */
    function renderHistory(){
      if(!requireAuthRedirect()) return;
      const histAll = JSON.parse(localStorage.getItem(DB.historyKey)||'[]');
      const user = getAuth();
      const my = histAll.filter(h=>h.user===user);
      app.innerHTML = `
        <section class="card">
          <h3>Histori Pembelian</h3>
          ${my.length?`<table><thead><tr><th>Nama Produk</th><th>Jenis</th><th>Tanggal</th><th>Harga</th><th>Status</th></tr></thead><tbody>${my.map(h=>`<tr><td>${h.productTitle}</td><td>${h.type}</td><td>${h.date}</td><td>Rp ${h.price.toLocaleString('id-ID')}</td><td>${h.paid?'<span style="color:green">Lunas</span>':'Belum'}</td></tr>`).join('')}</tbody></table>`:'<div class="muted">Belum ada histori pembelian</div>'}
        </section>
      `;
    }

    /* --------------------------- Init route on first load --------------------------- */
    renderRoute();

    // make renderRoute accessible after canmore etc
    window.renderRoute = renderRoute;
    window.logout = logout;