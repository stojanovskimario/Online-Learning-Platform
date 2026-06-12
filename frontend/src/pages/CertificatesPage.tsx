import { useState } from 'react'
import AppLayout from '@/components/AppLayout'
import { useCertificates } from '@/hooks/useCertificates'
import { downloadCertificateApi } from '@/api/certificate.api'
import { GraduationCap, Award } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Certificate } from '@/types/certificate.types'

const formatDate = (iso?: string) => {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })
}

const CertificatesPage = () => {
  const { data: certificates, isLoading } = useCertificates()
  const [downloadingId, setDownloadingId] = useState<number | null>(null)

  const handleDownload = async (cert: Certificate) => {
    try {
      setDownloadingId(cert.id)
      const blob = await downloadCertificateApi(cert.id)
      const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }))
      const a = document.createElement('a')
      a.href = url
      const safeTitle = cert.courseTitle.replace(/[^a-z0-9\- ]/gi, '')
      a.download = `certificate-${safeTitle}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      // swallow or show toast — keep simple for now
      console.error('Download failed', err)
    } finally {
      setDownloadingId(null)
    }
  }

  return (
    <AppLayout
      header={
        <header className="bg-[#13151f] border-b border-white/5 px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between flex-shrink-0">
          <div>
            <h1 className="text-lg font-semibold text-white">Certificates</h1>
            <p className="text-xs text-white/40">Your earned certificates</p>
          </div>
        </header>
      }
    >
      <div className="mx-auto max-w-6xl space-y-5">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="animate-pulse bg-white/5 rounded-xl h-32" />
            <div className="animate-pulse bg-white/5 rounded-xl h-32" />
            <div className="animate-pulse bg-white/5 rounded-xl h-32" />
          </div>
        ) : (!certificates || certificates.length === 0) ? (
          <div className="rounded-xl border border-white/5 bg-[#13151f] p-10 text-center">
            <div className="flex flex-col items-center gap-4">
              <GraduationCap size={48} className="text-white/20" />
              <p className="text-white/60 text-lg">No certificates yet. Complete a course to earn your first certificate!</p>
              <Link to="/courses" className="rounded-lg bg-blue-500 px-4 py-2 text-white">Browse Courses</Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {certificates.map((cert) => (
              <div key={cert.id} className="bg-white/5 border border-white/5 rounded-xl p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-white font-semibold text-lg">{cert.courseTitle}</div>
                    <div className="text-xs text-white/40 mt-1">{formatDate(cert.issuedAt)}</div>
                  </div>
                  <div className="text-white/40">
                    <Award size={20} />
                  </div>
                </div>

                <div className="mt-4 text-white/60 text-sm">Awarded to {cert.studentName}</div>

                <div className="mt-6 flex items-center justify-between">
                  <div className="text-xs text-white/30 font-mono break-all">{cert.verificationCode}</div>
                  <button
                    onClick={() => handleDownload(cert)}
                    disabled={downloadingId === cert.id}
                    className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1.5 rounded-lg disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {downloadingId === cert.id ? (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    ) : null}
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  )
}

export default CertificatesPage

