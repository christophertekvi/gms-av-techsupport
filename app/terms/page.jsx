import Link from 'next/link'
import { FileText, ShieldAlert, ExternalLink, ArrowLeft, CheckCircle2, AlertTriangle, Mail } from 'lucide-react'

export const metadata = {
  title: 'Ketentuan Layanan (Terms of Service) | GMS Multimedia',
  description: 'Syarat dan Ketentuan Layanan penggunaan GMS AV Tech Support dan integrasi YouTube API Services.',
}

export default function TermsOfServicePage() {
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
          <FileText size={14} />
          Legal &amp; Service Terms
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ink-light dark:text-ink-dark mb-3">
          Ketentuan Layanan (Terms of Service)
        </h1>
        <p className="text-sm text-muted-light dark:text-muted-dark">
          Terakhir diperbarui: <span className="font-medium text-ink-light dark:text-ink-dark">{lastUpdated}</span>
        </p>
      </div>

      {/* Content */}
      <div className="space-y-8 text-sm leading-relaxed text-ink-light dark:text-ink-dark">
        {/* Section 1 */}
        <section className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg p-5 sm:p-6 shadow-sm">
          <h2 className="font-display text-lg font-semibold mb-2">1. Penerimaan Ketentuan</h2>
          <p className="text-muted-light dark:text-muted-dark mb-3">
            Selamat datang di <strong>GMS AV Tech Support</strong> (&quot;Aplikasi&quot;, &quot;Layanan&quot;). Dengan mengakses, menjelajahi, atau menggunakan platform dan fitur integrasi yang disediakan di dalam aplikasi ini, Anda menyatakan telah membaca, memahami, dan menyetujui untuk terikat secara hukum oleh Ketentuan Layanan ini.
          </p>
          <p className="text-muted-light dark:text-muted-dark">
            Jika Anda tidak menyetujui ketentuan ini, Anda tidak diperkenankan untuk mengakses atau menggunakan sistem dan fungsionalitas aplikasi ini.
          </p>
        </section>

        {/* Section 2: YouTube API Integration */}
        <section className="border-2 border-accent/40 rounded-lg p-5 sm:p-6 bg-accent-soft/30 dark:bg-accent-softDark/30">
          <div className="flex items-center gap-2 font-display text-lg font-semibold text-accent mb-3">
            <ExternalLink size={18} />
            <h2>2. Keterikatan dengan Layanan Pihak Ketiga &amp; YouTube API</h2>
          </div>
          <p className="text-ink-light dark:text-ink-dark mb-3">
            Aplikasi ini memanfaatkan <strong>YouTube API Services</strong> untuk mengelola jadwal siaran langsung (live broadcasts) dan memantau status streaming ibadah.
          </p>
          <div className="p-4 rounded border border-accent/20 bg-surface-light dark:bg-surface-dark mb-3 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent">Pemberitahuan Wajib:</p>
            <p className="text-xs text-muted-light dark:text-muted-dark leading-relaxed">
              Dengan menggunakan fitur yang terintegrasi dengan YouTube di dalam aplikasi ini, Anda secara eksplisit menyetujui dan tunduk pada:{' '}
              <a
                href="https://www.youtube.com/t/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline font-semibold inline-flex items-center gap-1"
              >
                Ketentuan Layanan YouTube (YouTube Terms of Service)
                <ExternalLink size={11} />
              </a>
              , serta kebijakan data{' '}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline font-semibold inline-flex items-center gap-1"
              >
                Kebijakan Privasi Google (Google Privacy Policy)
                <ExternalLink size={11} />
              </a>
              .
            </p>
          </div>
          <p className="text-xs text-muted-light dark:text-muted-dark">
            Pengguna dapat mencabut otorisasi akses akun Google kapan saja melalui pengaturan keamanan Google di{' '}
            <a
              href="https://myaccount.google.com/permissions"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline font-medium"
            >
              https://myaccount.google.com/permissions
            </a>
            .
          </p>
        </section>

        {/* Section 3: Allowed Use */}
        <section className="border border-border-light dark:border-border-dark rounded-lg p-5 sm:p-6 bg-surface-light dark:bg-surface-dark">
          <div className="flex items-center gap-2 font-display text-lg font-semibold mb-3">
            <CheckCircle2 size={18} className="text-tally-ok" />
            <h2>3. Penggunaan yang Diperbolehkan (Acceptable Use)</h2>
          </div>
          <p className="text-muted-light dark:text-muted-dark mb-3">
            Aplikasi ini ditujukan secara khusus untuk tim produksi Audio Visual, teknisi broadcast, operator sound &amp; multimedia, serta relawan pelayanan ibadah di lingkungan Gereja Mawar Sharon (GMS).
          </p>
          <p className="text-muted-light dark:text-muted-dark mb-2">Anda setuju untuk:</p>
          <ul className="list-disc list-inside space-y-1.5 text-muted-light dark:text-muted-dark ml-2 mb-4">
            <li>Menggunakan aplikasi semata-mata untuk tujuan operasional pelayanan dan penyiaran ibadah yang sah.</li>
            <li>Menjaga kerahasiaan kata sandi dan kredensial administratif yang diberikan kepada Anda.</li>
            <li>Mematuhi seluruh pedoman komunitas dan hak cipta media saat melakukan siaran live streaming.</li>
          </ul>

          <p className="text-muted-light dark:text-muted-dark mb-2">Anda dilarang keras untuk:</p>
          <ul className="list-disc list-inside space-y-1.5 text-muted-light dark:text-muted-dark ml-2">
            <li>Menyalahgunakan API token untuk mengakses data channel tanpa wewenang tertulis.</li>
            <li>Melakukan tindakan reverse engineering, dekompilasi, atau merusak infrastruktur sistem server.</li>
            <li>Mengunggah atau menyiarkan materi yang mengandung malware, konten berbahaya, atau melanggar hak cipta pihak ketiga.</li>
          </ul>
        </section>

        {/* Section 4: Admin & Security */}
        <section className="border border-border-light dark:border-border-dark rounded-lg p-5 sm:p-6 bg-surface-light dark:bg-surface-dark">
          <div className="flex items-center gap-2 font-display text-lg font-semibold mb-3">
            <ShieldAlert size={18} className="text-accent" />
            <h2>4. Hak Akses Administratif &amp; Keamanan</h2>
          </div>
          <p className="text-muted-light dark:text-muted-dark mb-3">
            Fitur administratif (termasuk pembuatan panduan baru, pengunggahan gambar, dan pengelolaan channel YouTube) dilindungi oleh kata sandi otentikasi. Administrator wajib menjaga kerahasiaan kredensial tersebut dan segera memberitahukan tim pengembang jika terjadi indikasi penyusupan akun atau kebocoran kredensial.
          </p>
        </section>

        {/* Section 5: Disclaimer */}
        <section className="border border-border-light dark:border-border-dark rounded-lg p-5 sm:p-6 bg-surface-light dark:bg-surface-dark">
          <div className="flex items-center gap-2 font-display text-lg font-semibold mb-3">
            <AlertTriangle size={18} className="text-tally-warning" />
            <h2>5. Penafian Jaminan (Disclaimer of Warranties)</h2>
          </div>
          <p className="text-muted-light dark:text-muted-dark mb-3">
            Layanan ini disediakan <strong>&quot;sebagaimana adanya&quot; (&quot;as is&quot;)</strong> dan <strong>&quot;sebagaimana tersedia&quot; (&quot;as available&quot;)</strong> tanpa jaminan apa pun, baik tersurat maupun tersirat.
          </p>
          <p className="text-muted-light dark:text-muted-dark">
            Kami berusaha semaksimal mungkin memastikan panduan teknis dan koneksi siaran YouTube akurat dan stabil. Namun, kami tidak menjamin bahwa layanan akan selalu bebas dari gangguan, kesalahan jaringan dari penyedia pihak ketiga (seperti YouTube/Google), atau downtime server hosting.
          </p>
        </section>

        {/* Section 6: Limitation of Liability */}
        <section className="border border-border-light dark:border-border-dark rounded-lg p-5 sm:p-6 bg-surface-light dark:bg-surface-dark">
          <h2 className="font-display text-lg font-semibold mb-3">6. Batasan Tanggung Jawab</h2>
          <p className="text-muted-light dark:text-muted-dark">
            Sepanjang diperbolehkan oleh hukum yang berlaku, tim pengembang dan organisasi gereja tidak bertanggung jawab atas kerugian langsung, tidak langsung, insidental, atau konsekuensial yang timbul dari ketidakmampuan menggunakan aplikasi, gangguan siaran streaming YouTube pihak ketiga, atau kehilangan data sementara selama siaran ibadah.
          </p>
        </section>

        {/* Section 7: Changes to Terms */}
        <section className="border border-border-light dark:border-border-dark rounded-lg p-5 sm:p-6 bg-surface-light dark:bg-surface-dark">
          <h2 className="font-display text-lg font-semibold mb-3">7. Perubahan Ketentuan</h2>
          <p className="text-muted-light dark:text-muted-dark">
            Kami dapat memperbarui atau merevisi Ketentuan Layanan ini sewaktu-waktu sejalan dengan pembaruan fitur teknis atau kebijakan pengembang Google / YouTube API. Versi terbaru akan selalu ditampilkan di halaman ini dengan tanggal pembaruan yang diperbarui.
          </p>
        </section>

        {/* Section 8: Contact */}
        <section className="border border-border-light dark:border-border-dark rounded-lg p-5 sm:p-6 bg-surface-light dark:bg-surface-dark">
          <div className="flex items-center gap-2 font-display text-lg font-semibold mb-3">
            <Mail size={18} className="text-accent" />
            <h2>8. Hubungi Kami</h2>
          </div>
          <p className="text-muted-light dark:text-muted-dark mb-3">
            Untuk pertanyaan atau konfirmasi seputar Ketentuan Layanan ini, silakan hubungi:
          </p>
          <div className="text-xs space-y-1 text-muted-light dark:text-muted-dark bg-bg-light dark:bg-bg-dark p-3.5 rounded border border-border-light dark:border-border-dark">
            <p><strong>Organisasi:</strong> GMS Multimedia &amp; AV Production Team</p>
            <p><strong>Aplikasi:</strong> GMS AV Tech Support</p>
            <p><strong>Email:</strong> <a href="mailto:multimedia@gms.church" className="text-accent hover:underline">multimedia@gms.church</a> / <a href="mailto:christophertekvi@gmail.com" className="text-accent hover:underline">christophertekvi@gmail.com</a></p>
            <p><strong>Homepage:</strong> <a href="https://gms-av-techsupport.vercel.app" className="text-accent hover:underline">https://gms-av-techsupport.vercel.app</a></p>
          </div>
        </section>
      </div>

      {/* Footer Nav */}
      <div className="mt-12 pt-6 border-t border-border-light dark:border-border-dark flex flex-wrap items-center justify-between text-xs text-muted-light dark:text-muted-dark gap-3">
        <div className="flex items-center gap-4">
          <Link href="/privacy" className="hover:text-accent underline transition-colors">
            Kebijakan Privasi (Privacy Policy)
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
