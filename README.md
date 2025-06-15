# App Starter Project with Webpack

Proyek ini adalah setup dasar untuk aplikasi web yang menggunakan webpack untuk proses bundling, Babel untuk transpile JavaScript, serta mendukung proses build dan serving aplikasi.

## Table of Contents

- [Getting Started](#getting-started)
- [Scripts](#scripts)
- [Project Structure](#project-structure)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (disarankan versi 12 atau lebih tinggi)
- [npm](https://www.npmjs.com/) (Node package manager)

### Installation

1. Download starter project [di sini](https://raw.githubusercontent.com/dicodingacademy/a219-web-intermediate-labs/099-shared-files/starter-project-with-webpack.zip).
2. Lakukan unzip file.
3. Pasang seluruh dependencies dengan perintah berikut.
   ```shell
   npm install
   ```

## Scripts

- Build for Production:

  ```shell
  npm run build
  ```

  Script ini menjalankan webpack dalam mode production menggunakan konfigurasi `webpack.prod.js` dan menghasilkan sejumlah file build ke direktori `dist`.

- Start Development Server:

  ```shell
  npm run start-dev
  ```

  Script ini menjalankan server pengembangan webpack dengan fitur live reload dan mode development sesuai konfigurasi di`webpack.dev.js`.

- Serve:
  ```shell
  npm run serve
  ```
  Script ini menggunakan [`http-server`](https://www.npmjs.com/package/http-server) untuk menyajikan konten dari direktori `dist`.

## Project Structure

Proyek starter ini dirancang agar kode tetap modular dan terorganisir.

├── node_modules/
├── src/
│ ├── public/
│ │ └── images
│ │ | └── favicon.png
│ │ | └── icon.png
│ │ | └── logo.png
│ ├── scripts/
│ │ └── componentes/
│ │ | └── navbar/
│ │ | | └── navbar.js
│ │ | └── review-card/
│ │ | | └── review-card.js
│ │ └── data/
│ │ | └── api.js
│ │ | └── idb.js
│ │ | └── repository.js
│ │ └── pages/
│ │ | └── about/
│ │ | | └── about-page.js
│ │ | └── add/
│ │ | | └── add-page.js
│ │ | | └── add-presenter.js
│ │ | └── detail/
│ │ | | └── detail-page.js
│ │ | | └── detail-presenter.js
│ │ | └── home/
│ │ | | └── home-page.js
│ │ | | └── home-presenter.js
│ │ | └── login/
│ │ | | └── login-page.js
│ │ | | └── login-presenter.js
│ │ └── app.js
│ │ └── routes/
│ │ | └── routes.js
│ │ | └── url-parser.js
│ │ └── utils/
│ │ | └── camera.js
│ │ | └── map.js
│ │ | └── notification.js
│ │ | └── view-transition.js
│ │ └── config.js
│ │ └── main.js
│ ├── styles/
│ │ └── pages/
│ │ | └── login.css
│ │ └── register/
│ │ | └── register.css
│ │ └── styles.css
│ └── index.html
│ └── manifest.json
│ └── service-worker.js
├── .gitignore
├── package-lock.json
├── package.json
├── README.md
├── STUDENT.txt
├── webpack.common.js
├── webpack.dev.js
└── webpack.prod.js

## Project Submission

Untuk mempermudah penilaian submission yang dikirim, Anda perlu memahami ketentuan-ketentuan berikut dalam mengerjakan tugas ini.

1. Memanfaatkan Satu API sebagai Sumber Data
   Anda WAJIB mengambil satu API sebagai sumber datanya. Pemilihan ini juga akan menentukan topik aplikasi yang akan Anda kembangkan. Oleh karena itu, silakan manfaatkan API yang telah kami sediakan.

https://story-api.dicoding.dev/v1/#/

2. Menggunakan Arsitektur Single-Page Application
   Aplikasi yang Anda buat harus mengadopsi arsitektur Single-Page Application (SPA) seperti yang kami contohkan pada proyek latihan. Berikut adalah ketentuan yang WAJIB diterapkan.

- Menggunakan teknik hash (#) dalam menangani routing di browser.
- Menerapkan pola model-view-presenter (MVP) dalam pengelolaan data ke user interface.

3. Menampilkan Data
   Aplikasi memiliki halaman yang menampilkan data dari API. Berikut adalah beberapa ketentuan yang WAJIB diterapkan.

- Data ditampilkan dalam bentuk daftar dan bersumber dari API pilihan Anda.
- Pada setiap item daftarnya, tampilkan minimal satu data gambar dan tiga data teks.
- Tambahkan peta digital untuk menunjukkan lokasi data.
- Pastikan peta memiliki marker dan menampilkan popup saat diklik.
  Hal yang perlu dicatat adalah SERTAKAN API key dari map service yang digunakan dalam STUDENT.txt jika memang aplikasi Anda membutuhkannya. Bila tidak memiliki berkas tersebut, silakan buat baru dalam root project, ya.

4. Memiliki Fitur Tambah Data Baru
   Selain menampilkan data ke halaman, aplikasi WAJIB punya kemampuan menambahkan data baru ke API. Tentunya, ini berpotensi membutuhkan halaman baru untuk menampilkan formulir. Pastikan halaman tersebut berisi kolom-kolom input yang dibutuhkan untuk mendapatkan data dari user.

Meskipun masing-masing API memiliki kebutuhan yang berbeda, ada kemiripan data. Berikut adalah beberapa ketentuan WAJIBNYA.

- Mengambil data gambar dengan kamera. Pastikan stream yang dibuat telah nonaktif jika tidak diperlukan lagi.
- Gunakan peta digital dan event klik untuk mengambil data latitude dan longitude. Anda diperkenankan memanfaatkan library apa pun selain yang diajarkan di kelas.

5. Menerapkan Aksesibilitas sesuai dengan Standar
   Ada beberapa aspek dalam meningkatkan aksesibilitas aplikasi. Perhatikan ketentuan-ketentuan WAJIBNYA.

- Menerapkan skip to content.
- Memiliki teks alternatif pada konten-konten gambar yang esensial.
- Pastikan setiap form control, seperti <input>, berasosiasi dengan <label> agar mudah diakses.
- Menggunakan semantic element dalam menyusun struktur halaman dan landmarking HTML.

6. Merancang Transisi Halaman yang Halus
   Untuk pengalaman pengguna yang makin baik, aplikasi Anda WAJIB mengimplementasikan gaya transisi halaman secara halus menggunakan View Transition API.

7. Menerapkan Push Notification
   Salah satu background execution dalam aplikasi web adalah push notification. Anda wajib menerapkan push notification dari API yang telah kami sediakan. Jadi, silakan simak kembali dokumentasi REST API yang Anda gunakan sebelumnya untuk mendapatkan informasi VAPID keys public.

8. Mengadopsi PWA (Installable & Offline)
   Aplikasi mengadopsi progressive web apps (PWA) dengan ketentuan WAJIB berikut.

- Mengadopsi arsitektur Application Shell: memisahkan bagian konten statis dan dinamis.
- Aplikasi dapat dipasang ke Homescreen: ditandai dengan munculnya icon add to homescreen pada browser.
- Aplikasi dapat diakses dalam keadaan offline tanpa ada bagian UI yang gagal ditampilkan.

9. Manfaatkan IndexedDB untuk Menyimpan Data
   Dalam submission, Anda HARUS menerapkan IndexedDB API sehingga dapat menambah pengalaman offline. Aplikasi WAJIB menyediakan cara untuk

- menyimpan,
- menampilkan, dan
- menghapus data yang tersimpan.
  Anda bebas menyimpan data dalam bentuk dan konteks apa pun selama itu relevan dengan aplikasi. Sebagai gambaran, Anda bisa menyimpan data yang berasal dari API dan menampilkannya ke suatu halaman sebagaimana kami contohkan dalam latihan kelas.

10. Distribusikan secara Publik
    Aplikasi harus didistribusikan atau di-deploy sehingga dapat diakses secara publik. Berikut adalah ketentuan WAJIB yang perlu Anda ikuti. Memanfaatkan salah satu dari platform berikut.

- GitHub Pages
- Netlify
- Firebase Hosting
  Melampirkan URL hasil deployment dalam STUDENT.txt. Jika tidak, submission Anda kami tolak.
