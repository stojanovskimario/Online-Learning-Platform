import axiosClient from './axiosClient'
import type { Certificate } from '@/types/certificate.types'

export const getCertificatesApi = () =>
  axiosClient.get<Certificate[]>('/api/certificates').then((res) => res.data)

export const downloadCertificateApi = (id: number) =>
  axiosClient
    .get(`/api/certificates/${id}/download`, {
      responseType: 'blob',
    })
    .then((res) => res.data)

