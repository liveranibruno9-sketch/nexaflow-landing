const tools = [
  'Gmail', 'Google Drive', 'WhatsApp Business', 'Notion',
  'Airtable', 'HubSpot', 'Microsoft 365', 'Slack', 'Zapier',
]

export default function TrustBar() {
  return (
    <div className="bg-white border-y border-gray-100 py-6 px-6">
      <div className="max-w-5xl mx-auto">
        <p className="text-center text-xs text-gray-400 uppercase tracking-widest mb-4 font-medium">
          Si integra con gli strumenti che usi già
        </p>
        <div className="flex flex-wrap justify-center gap-x-7 gap-y-2 items-center">
          {tools.map((t) => (
            <span key={t} className="text-sm text-gray-400 font-medium">
              {t}
            </span>
          ))}
          <span className="text-sm text-gray-300 font-medium">+400 altri</span>
        </div>
      </div>
    </div>
  )
}
