const INFO = [
  { emoji: '🕐', label: 'Hours',        detail: 'Daily 9:00 AM — Late' },
  { emoji: '📍', label: 'Location',     detail: 'Inside Paradise Resort, Ras Sudr Beach, South Sinai' },
  { emoji: '📞', label: 'Reservations', detail: '+20 11 16407080 (WhatsApp)' },
]

export default function RestaurantInfoBar() {
  return (
    <div className="bg-white border-b border-gray-100 py-6 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
        {INFO.map(({ emoji, label, detail }) => (
          <div key={label} className="flex items-center gap-3 p-4 rounded-xl bg-gray-50">
            <span className="text-2xl">{emoji}</span>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[#1a9fd4]">{label}</div>
              <div className="text-sm text-gray-700 mt-0.5">{detail}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
