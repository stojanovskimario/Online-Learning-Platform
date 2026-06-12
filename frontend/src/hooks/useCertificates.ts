import { useQuery } from '@tanstack/react-query'
import { getCertificatesApi } from '@/api/certificate.api'

export const useCertificates = () => {
  return useQuery({
    queryKey: ['certificates'],
    queryFn: () => getCertificatesApi(),
  })
}

