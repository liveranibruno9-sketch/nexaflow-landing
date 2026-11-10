import { reindirizzaAWhatsApp } from '@/lib/link-social'

export const dynamic = 'force-dynamic'

export function GET() {
  return reindirizzaAWhatsApp('ig')
}
