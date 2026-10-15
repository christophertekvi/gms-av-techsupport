import Link from 'next/link'
import { ShieldCheck, Lock, ExternalLink, ArrowLeft, RefreshCw, Trash2, Mail } from 'lucide-react'

export const metadata = {
  title: 'Kebijakan Privasi (Privacy Policy) | GMS Multimedia',
  description: 'Kebijakan Privasi dan Kepatuhan Penggunaan Google API / YouTube API Services untuk GMS AV Tech Support.',
}

export default function PrivacyPolicyPage() {
  const lastUpdated = '15 Oktober 2026'

  return (
    <main className="mx-auto max-w-4xl px-4 sm:px-6 py-12">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-light dark:text-muted-dark hover:text-accent transition-colors"
        >
          <ArrowLeft size={14} />
          Kembali ke Beranda
        </Link>
      </div>

      {/* Header */}
      <div className="border-b border-border-light dark:border-border-dark pb-8 mb-8">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium bg-accent-soft text-accent dark:bg-accent-softDark mb-3">
          <ShieldCheck size={14} />
          Google API &amp; OAuth Compliance
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ink-light dark:text-ink-dark mb-3">
          Kebijakan Privasi (Privacy Policy)
        </h1>
        <p className="text-sm text-muted-light dark:text-muted-dark">
          Terakhir diperbarui: <span className="font-medium text-ink-light dark:text-ink-dark">{lastUpdated}</span>
        </p>
      </div>

      {/* Content */}
      <div className="space-y-8 text-sm leading-relaxed text-ink-light dark:text-ink-dark">
        {/* Intro */}
        <section className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg p-5 sm:p-6 shadow-sm">
          <h2 className="font-display text-lg font-semibold mb-2">1. Pendahuluan</h2>
          <p className="text-muted-light dark:text-muted-dark mb-3">
            <strong>GMS AV Tech Support</strong> (&quot;kami&quot;, &quot;aplikasi kami&quot;) adalah platform operasional internal dan sistem dokumentasi teknis yang dikelola oleh tim Multimedia &amp; Produksi Audio Visual Gereja Mawar Sharon (GMS). Platform ini dirancang untuk memandu operator broadcast, sound engineer, dan tim multimedia dalam pemeliharaan perangkat serta manajemen teknis siaran langsung ibadah.
          </p>
          <p className="text-muted-light dark:text-muted-dark">
            Kami sangat menghormati privasi Anda dan berkomitmen untuk melindungi setiap informasi dan kredensial yang diproses melalui aplikasi kami. Kebijakan Privasi ini menjelaskan bagaimana data diakses, digunakan, disimpan, dan dilindungi saat menggunakan aplikasi kami serta integrasinya dengan Layanan Google dan YouTube.
          </p>
        </section>

        {/* YouTube API Services Terms */}
        <section className="border border-border-light dark:border-border-dark rounded-lg p-5 sm:p-6 bg-surface-light dark:bg-surface-dark">
          <div className="flex items-center gap-2 font-display text-lg font-semibold mb-3">
            <ExternalLink size={18} className="text-accent" />
            <h2>2. Kepatuhan Layanan API YouTube (YouTube API Services)</h2>
          </div>
          <p className="text-muted-light dark:text-muted-dark mb-3">
            Aplikasi kami memanfaatkan <strong>YouTube API Services</strong> untuk mengelola jadwal siaran langsung (live broadcasts) ibadah gereja secara otomatis dan memantau status siaran langsung teknis.
          </p>
          <p className="text-muted-light dark:text-muted-dark mb-3">
            Sesuai ketentuan pengembang YouTube API, dengan mengakses dan menggunakan fitur integrasi YouTube di aplikasi ini, pengguna menyetujui dan terikat oleh:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-muted-light dark:text-muted-dark ml-2 mb-4">
            <li>
              <a
                href="https://www.youtube.com/t/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline font-medium inline-flex items-center gap-1"
              >
                Ketentuan Layanan YouTube (YouTube Terms of Service)
                <ExternalLink size={12} />
              </a>
            </li>
            <li>
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline font-medium inline-flex items-center gap-1"
              >
                Kebijakan Privasi Google (Google Privacy Policy)
                <ExternalLink size={12} />
              </a>
            </li>
          </ul>
          <p className="text-xs text-muted-light dark:text-muted-dark bg-bg-light dark:bg-bg-dark p-3 rounded border border-border-light dark:border-border-dark">
            Informasi lebih lanjut tentang kepatuhan Google dapat dilihat pada Pedoman Ketentuan Pengembang YouTube API.
          </p>
        </section>

        {/* Data We Access */}
        <section className="border border-border-light dark:border-border-dark rounded-lg p-5 sm:p-6 bg-surface-light dark:bg-surface-dark">
          <h2 className="font-display text-lg font-semibold mb-3">3. Data yang Kami Akses dan Kumpulkan</h2>
          <p className="text-muted-light dark:text-muted-dark mb-3">
            Saat administrator menghubungkan akun YouTube resmi gereja melalui proses Google OAuth 2.0, aplikasi meminta izin (OAuth Scopes):
          </p>
          <div className="bg-bg-light dark:bg-bg-dark p-3 rounded font-mono text-xs text-accent mb-4 border border-border-light dark:border-border-dark break-all">
            https://www.googleapis.com/auth/youtube
          </div>
          <p className="text-muted-light dark:text-muted-dark mb-3">
            Melalui otorisasi tersebut, data yang diakses meliputi:
          </p>
          <div className="grid sm:grid-cols-2 gap-3 mb-4">
            <div className="p-3 rounded border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark">
              <h3 className="font-semibold text-xs uppercase tracking-wider text-accent mb-1">Informasi Channel</h3>
              <p className="text-xs text-muted-light dark:text-muted-dark">
                ID Channel, nama channel YouTube, dan foto profil thumbnail channel untuk memverifikasi channel yang terhubung.
              </p>
            </div>
            <div className="p-3 rounded border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark">
              <h3 className="font-semibold text-xs uppercase tracking-wider text-accent mb-1">Metadata Live Broadcast</h3>
              <p className="text-xs text-muted-light dark:text-muted-dark">
                Judul siaran ibadah, jadwal waktu tayang, status siaran (upcoming/live/complete), dan stream ingest endpoint.
              </p>
            </div>
            <div className="p-3 rounded border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark">
              <h3 className="font-semibold text-xs uppercase tracking-wider text-accent mb-1">Kredensial Otorisasi (Tokens)</h3>
              <p className="text-xs text-muted-light dark:text-muted-dark">
                OAuth Access Token dan Refresh Token yang diberikan oleh Google untuk memperbarui izin koneksi secara aman.
              </p>
            </div>
            <div className="p-3 rounded border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark">
              <h3 className="font-semibold text-xs uppercase tracking-wider text-accent mb-1">Data Non-Pribadi</h3>
              <p className="text-xs text-muted-light dark:text-muted-dark">
                Log teknis kesalahan koneksi sistem untuk tujuan debugging operasional broadcast.
              </p>
            </div>
          </div>
          <p className="text-muted-light dark:text-muted-dark">
            Kami <strong>tidak</strong> mengumpulkan atau mengakses data pribadi penonton, pesan obrolan langsung (live chat messages) publik yang tidak relevan, komentar pribadi, atau rincian pembayaran akun Google.
          </p>
        </section>

        {/* How We Use Data */}
        <section className="border border-border-light dark:border-border-dark rounded-lg p-5 sm:p-6 bg-surface-light dark:bg-surface-dark">
          <h2 className="font-display text-lg font-semibold mb-3">4. Bagaimana Kami Menggunakan Informasi Anda</h2>
          <p className="text-muted-light dark:text-muted-dark mb-3">
            Informasi yang diakses hanya digunakan untuk keperluan teknis operasional penyiaran gereja:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-muted-light dark:text-muted-dark ml-2">
            <li>Menampilkan jadwal siaran ibadah yang akan datang di panel admin tim multimedia.</li>
            <li>Menyiapkan dan menyinkronkan event siaran langsung (live stream broadcast) pada channel YouTube resmi.</li>
            <li>Memverifikasi kelancaran sinyal streaming teknis sebelum ibadah dimulai.</li>
            <li>Mencegah kesalahan pengaturan broadcast saat perpindahan jadwal ibadah antar-ruangan.</li>
          </ul>
        </section>

        {/* Google API Services User Data Policy / Limited Use */}
        <section className="border-2 border-accent/40 rounded-lg p-5 sm:p-6 bg-accent-soft/30 dark:bg-accent-softDark/30">
          <div className="flex items-center gap-2 font-display text-lg font-semibold text-accent mb-3">
            <Lock size={18} />
            <h2>5. Kebijakan Penggunaan Terbatas Google (Google Limited Use Disclosure)</h2>
          </div>
          <p className="text-ink-light dark:text-ink-dark mb-3">
            Penggunaan dan transfer informasi yang diterima oleh <strong>GMS AV Tech Support</strong> dari Google API ke aplikasi lain akan mematuhi{' '}
            <a
              href="https://developers.google.com/terms/api-services-user-data-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline font-medium inline-flex items-center gap-1"
            >
              Kebijakan Data Pengguna Layanan API Google (Google API Services User Data Policy)
              <ExternalLink size={12} />
            </a>
            , termasuk persyaratan <strong>Limited Use (Penggunaan Terbatas)</strong>.
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-light dark:text-muted-dark ml-2">
            <li>
              <strong>Tidak Dijual atau Dibagikan:</strong> Kami <em>tidak pernah</em> menjual, menyewakan, atau mendistribusikan data pengguna Google/YouTube kepada pihak ketiga atau pengiklan.
            </li>
            <li>
              <strong>Tidak untuk Iklan:</strong> Data pengguna dari Google API tidak pernah digunakan untuk menayangkan atau menargetkan iklan dalam bentuk apa pun.
            </li>
            <li>
              <strong>Tidak untuk Pelatihan AI Umum:</strong> Data pengguna tidak digunakan untuk melatih model kecerdasan buatan (AI) atau machine learning umum tanpa persetujuan eksplisit.
            </li>
            <li>
              <strong>Akses Manusia Terbatas:</strong> Tidak ada staf yang membaca data autentikasi Anda kecuali diwajibkan untuk alasan keamanan teknis atau investigasi bug yang diminta pengguna.
            </li>
          </ul>
        </section>

        {/* Data Storage & Security */}
        <section className="border border-border-light dark:border-border-dark rounded-lg p-5 sm:p-6 bg-surface-light dark:bg-surface-dark">
          <h2 className="font-display text-lg font-semibold mb-3">6. Penyimpanan dan Keamanan Data</h2>
          <p className="text-muted-light dark:text-muted-dark mb-3">
            Keamanan data merupakan prioritas utama kami:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-muted-light dark:text-muted-dark ml-2">
            <li>
              Kredensial token Google OAuth disimpan secara terisolasi di sisi server (environment variable dan file token lokal terproteksi) dan tidak diekspos ke klien publik.
            </li>
            <li>
              Semua komunikasi antara browser pengguna, server kami, dan Google API diamankan menggunakan enkripsi standar Transport Layer Security (HTTPS / TLS).
            </li>
            <li>
              Hanya administrator terotentikasi dengan hak akses resmi yang dapat mengakses pengaturan YouTube di panel admin.
            </li>
          </ul>
        </section>

        {/* Revocation and Deletion */}
        <section className="border border-border-light dark:border-border-dark rounded-lg p-5 sm:p-6 bg-surface-light dark:bg-surface-dark">
          <div className="flex items-center gap-2 font-display text-lg font-semibold mb-3">
            <Trash2 size={18} className="text-accent" />
            <h2>7. Retensi, Pencabutan Akses, dan Penghapusan Data</h2>
          </div>
          <p className="text-muted-light dark:text-muted-dark mb-3">
            Pengguna dan administrator memiliki kendali penuh atas data dan izin akses akun YouTube:
          </p>
          <div className="space-y-3">
            <div className="p-3 rounded border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark">
              <h3 className="font-semibold text-xs text-ink-light dark:text-ink-dark mb-1 flex items-center gap-1.5">
                <RefreshCw size={14} className="text-accent" />
                Pemutusan Koneksi Melalui Aplikasi
              </h3>
              <p className="text-xs text-muted-light dark:text-muted-dark">
                Administrator dapat memutuskan integrasi kapan saja di panel <code className="bg-surface-light dark:bg-surface-dark px-1 py-0.5 rounded border border-border-light dark:border-border-dark">/admin</code> dengan mengklik tombol <strong>&quot;Putuskan Koneksi Channel&quot;</strong>. Sistem akan segera menghapus seluruh token OAuth dan cache data profil dari server.
              </p>
            </div>

            <div className="p-3 rounded border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark">
              <h3 className="font-semibold text-xs text-ink-light dark:text-ink-dark mb-1 flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-accent" />
                Pencabutan Akses Langsung Melalui Akun Google
              </h3>
              <p className="text-xs text-muted-light dark:text-muted-dark mb-2">
                Anda juga dapat mencabut akses aplikasi kami secara langsung kapan saja melalui halaman pengaturan keamanan akun Google Anda:
              </p>
              <a
                href="https://myaccount.google.com/permissions"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-accent hover:underline font-medium inline-flex items-center gap-1"
              >
                https://myaccount.google.com/permissions (Google Third-Party Access)
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="border border-border-light dark:border-border-dark rounded-lg p-5 sm:p-6 bg-surface-light dark:bg-surface-dark">
          <div className="flex items-center gap-2 font-display text-lg font-semibold mb-3">
            <Mail size={18} className="text-accent" />
            <h2>8. Hubungi Kami</h2>
          </div>
          <p className="text-muted-light dark:text-muted-dark mb-3">
            Jika Anda memiliki pertanyaan mengenai Kebijakan Privasi ini, permintaan penghapusan data, atau informasi seputar integrasi teknis, silakan hubungi tim kami:
          </p>
          <div className="text-xs space-y-1 text-muted-light dark:text-muted-dark bg-bg-light dark:bg-bg-dark p-3.5 rounded border border-border-light dark:border-border-dark">
            <p><strong>Organisasi:</strong> GMS Multimedia &amp; AV Production Team</p>
            <p><strong>Aplikasi:</strong> GMS AV Tech Support</p>
            <p><strong>Email Kontak:</strong> <a href="mailto:multimedia@gms.church" className="text-accent hover:underline">multimedia@gms.church</a> / <a href="mailto:christophertekvi@gmail.com" className="text-accent hover:underline">christophertekvi@gmail.com</a></p>
            <p><strong>Website / Homepage:</strong> <a href="https://gms-av-techsupport.vercel.app" className="text-accent hover:underline">https://gms-av-techsupport.vercel.app</a></p>
          </div>
        </section>
      </div>

      {/* Footer Nav */}
      <div className="mt-12 pt-6 border-t border-border-light dark:border-border-dark flex flex-wrap items-center justify-between text-xs text-muted-light dark:text-muted-dark gap-3">
        <div className="flex items-center gap-4">
          <Link href="/terms" className="hover:text-accent underline transition-colors">
            Ketentuan Layanan (Terms of Service)
          </Link>
          <Link href="/" className="hover:text-accent transition-colors">
            Beranda
          </Link>
        </div>
        <span>&copy; {new Date().getFullYear()} GMS Multimedia</span>
      </div>
    </main>
  )
}
