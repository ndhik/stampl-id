# stample.id

Platform loyalitas digital untuk FnB UMKM Indonesia. Pengganti stamp card fisik berbasis web — tidak perlu install app.

## Struktur Domain

| Domain | Fungsi |
|--------|--------|
| `stample.id` | Landing page + dashboard pelanggan |
| `tenant.stample.id` | Dashboard & operasional UMKM |
| `admin.stample.id` | Admin panel (founder only) |

## Quick Start

### 1. Clone & Install

```bash
git clone <repo>
cd stample
npm install
```

### 2. Setup Environment

```bash
cp .env.example .env.local
# Isi semua nilai di .env.local
```

### 3. Setup Database

```bash
# Push schema ke Neon
npx prisma db push

# (Opsional) Buka Prisma Studio untuk lihat data
npx prisma studio
```

### 4. Generate Admin Password Hash

```bash
node -e "const b=require('bcryptjs'); b.hash('password-kamu',12).then(console.log)"
# Paste hasilnya ke ADMIN_PASSWORD_HASH di .env.local
```

### 5. Jalankan Dev Server

```bash
npm run dev
```

Buka `http://localhost:3000`

### 6. Test Subdomain di Lokal (Opsional)

Tambahkan ke `/etc/hosts`:
```
127.0.0.1 tenant.localhost
127.0.0.1 admin.localhost
```

Lalu akses `http://tenant.localhost:3000` dan `http://admin.localhost:3000`

---

## Deploy ke Vercel

1. Push ke GitHub
2. Import repo di vercel.com
3. Set semua environment variables dari `.env.example`
4. Tambahkan 3 domain di Vercel project settings:
   - `stample.id`
   - `tenant.stample.id`
   - `admin.stample.id`
5. Arahkan DNS di Cloudflare ke Vercel (CNAME ke `cname.vercel-dns.com`)

## Setup Google OAuth

1. Buka [console.cloud.google.com](https://console.cloud.google.com)
2. Buat project baru
3. APIs & Services → Credentials → Create OAuth 2.0 Client ID
4. Authorized redirect URIs:
   - `https://stample.id/api/auth/callback/google`
   - `https://tenant.stample.id/api/auth/callback/google`
   - `http://localhost:3000/api/auth/callback/google` (dev)

## Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Neon (PostgreSQL) + Prisma ORM
- **Auth**: Auth.js v5 (Google OAuth + email/password)
- **Storage**: Cloudflare R2
- **Cache**: Upstash Redis
- **Email**: Resend
- **Deploy**: Vercel
- **DNS/CDN**: Cloudflare

## Pricing Plans

| Plan | Harga |
|------|-------|
| Free | Rp 0 |
| Pro | Rp 49.000/bulan atau Rp 499.000/tahun |
| Premium | Rp 89.000/bulan atau Rp 899.000/tahun |

Pembayaran MVP via transfer bank manual. Admin konfirmasi lewat `admin.stample.id/invoices`.
