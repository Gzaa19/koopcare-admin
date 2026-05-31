# KYC Photo Upload — Mobile ke Web Admin

Dokumen ini menjelaskan alur lengkap upload foto KYC dari aplikasi mobile Flutter hingga tampil di web admin KoopCare.

---

## Gambaran Alur

```
Flutter (mobile)
    │
    │  POST /api/v1/mobile/kyc/submit
    │  Content-Type: multipart/form-data
    │  Field: ktp_photo, selfie_photo
    │
    ▼
Backend (Express)
    │
    │  multer + multer-storage-cloudinary
    │  → upload otomatis ke Cloudinary
    │  → dapat secure_url
    │
    ▼
Database (Railway MySQL)
    │
    │  Simpan ktp_photo_url & selfie_photo_url
    │  (berupa URL Cloudinary)
    │
    ▼
Web Admin (React)
    │
    │  GET /api/v1/kyc/:id
    │  → tampilkan foto via <img src={url} />
    │
    ▼
Admin melihat foto KTP & selfie, lalu Setujui / Tolak
```

---

## 1. Endpoint Mobile

### Submit KYC

```
POST /api/v1/mobile/kyc/submit
Authorization: Bearer <token_member>
Content-Type: multipart/form-data
```

| Field         | Tipe   | Wajib | Keterangan                        |
|---------------|--------|-------|-----------------------------------|
| `ktp_photo`   | file   | ✓     | Foto e-KTP (JPG/PNG/WebP, maks 5MB) |
| `selfie_photo`| file   | ✓     | Selfie sambil pegang KTP          |

**Response sukses (201):**
```json
{
  "success": true,
  "message": "Pengajuan KYC berhasil",
  "kycId": 7,
  "ktp_photo_url": "https://res.cloudinary.com/dk0la70lb/image/upload/v.../koopcare/kyc/abc123.jpg",
  "selfie_photo_url": "https://res.cloudinary.com/dk0la70lb/image/upload/v.../koopcare/kyc/def456.jpg"
}
```

**Response error:**
```json
{ "success": false, "error": "Foto KTP dan selfie wajib diisi" }
{ "success": false, "error": "Ukuran file terlalu besar. Maksimal 5MB per foto." }
{ "success": false, "error": "Format file tidak didukung. Gunakan JPG, PNG, atau WebP." }
{ "success": false, "error": "Anda sudah memiliki pengajuan KYC yang sedang diproses" }
```

---

## 2. Implementasi Backend

### File: `src/config/cloudinary.js`

Konfigurasi Cloudinary dan multer storage. Foto disimpan di folder `koopcare/kyc` di Cloudinary dengan transformasi otomatis (resize maks 1200px, quality auto).

```js
// Env vars yang dibutuhkan:
CLOUDINARY_CLOUD_NAME=dk0la70lb
CLOUDINARY_API_KEY=965794481262445
CLOUDINARY_API_SECRET=<secret>
```

### File: `src/routes/v1/mobileRoutes.js`

Middleware `uploadKyc.fields(...)` dipasang sebelum controller `submitKyc`:

```js
router.post(
    '/kyc/submit',
    uploadKyc.fields([
        { name: 'ktp_photo', maxCount: 1 },
        { name: 'selfie_photo', maxCount: 1 },
    ]),
    mobileController.submitKyc
);
```

### File: `src/controllers/mobileController.js`

Controller membaca URL hasil upload dari `req.files`:

```js
const ktp_photo_url    = req.files?.ktp_photo?.[0]?.path;
const selfie_photo_url = req.files?.selfie_photo?.[0]?.path;
```

URL ini langsung disimpan ke kolom `ktp_photo_url` dan `selfie_photo_url` di tabel `kyc_submissions`.

---

## 3. Cara Pakai dari Flutter

### Menggunakan `http` package

```dart
import 'package:http/http.dart' as http;

Future<void> submitKyc(String token, File ktpFile, File selfieFile) async {
  final uri = Uri.parse('https://your-api.railway.app/api/v1/mobile/kyc/submit');

  final request = http.MultipartRequest('POST', uri)
    ..headers['Authorization'] = 'Bearer $token'
    ..files.add(await http.MultipartFile.fromPath('ktp_photo', ktpFile.path))
    ..files.add(await http.MultipartFile.fromPath('selfie_photo', selfieFile.path));

  final response = await request.send();
  final body = await response.stream.bytesToString();
  print(body); // { "success": true, "kycId": 7, ... }
}
```

### Menggunakan `dio` package

```dart
import 'package:dio/dio.dart';

Future<void> submitKyc(String token, String ktpPath, String selfiePath) async {
  final dio = Dio();

  final formData = FormData.fromMap({
    'ktp_photo':    await MultipartFile.fromFile(ktpPath,    filename: 'ktp.jpg'),
    'selfie_photo': await MultipartFile.fromFile(selfiePath, filename: 'selfie.jpg'),
  });

  final response = await dio.post(
    'https://your-api.railway.app/api/v1/mobile/kyc/submit',
    data: formData,
    options: Options(headers: {'Authorization': 'Bearer $token'}),
  );

  print(response.data);
}
```

> **Penting:** Jangan gunakan `base64` — kirim langsung sebagai file binary via `multipart/form-data`.

---

## 4. Tampilan di Web Admin

Web admin mengambil detail KYC via:

```
GET /api/v1/kyc/:id
Authorization: Bearer <token_admin>
```

Response menyertakan `ktp_photo_url` dan `selfie_photo_url` berupa URL Cloudinary. Komponen `KycDetailModal.jsx` langsung menampilkan foto dengan:

```jsx
<img src={submission.ktp_photo_url}    alt="e-KTP" />
<img src={submission.selfie_photo_url} alt="Selfie KTP" />
```

Admin bisa klik foto untuk preview fullscreen, lalu memilih **Setujui** atau **Tolak** dengan catatan.

---

## 5. Struktur Tabel `kyc_submissions`

Kolom yang relevan:

| Kolom              | Tipe         | Keterangan                          |
|--------------------|--------------|-------------------------------------|
| `ktp_photo_url`    | VARCHAR(500) | URL foto KTP di Cloudinary          |
| `selfie_photo_url` | VARCHAR(500) | URL foto selfie di Cloudinary       |
| `status`           | ENUM         | `PENDING` / `APPROVED` / `REJECTED` |
| `reviewed_by`      | INT          | ID admin yang mereview              |
| `reviewed_at`      | DATETIME     | Waktu review                        |
| `notes`            | TEXT         | Catatan penolakan (jika ditolak)    |

---

## 6. Cloudinary Storage

Foto tersimpan di:
- **Cloud name:** `dk0la70lb`
- **Folder:** `koopcare/kyc/`
- **Format:** otomatis dioptimasi (quality auto, maks lebar 1200px)
- **URL format:** `https://res.cloudinary.com/dk0la70lb/image/upload/v<timestamp>/koopcare/kyc/<public_id>.<ext>`

---

## 7. Batasan & Validasi

| Aturan              | Nilai                    |
|---------------------|--------------------------|
| Ukuran maks per file | 5 MB                    |
| Format yang diterima | JPG, JPEG, PNG, WebP    |
| Jumlah file per submit | 1 KTP + 1 selfie      |
| Pengajuan bersamaan  | Tidak boleh ada 2 PENDING sekaligus |
