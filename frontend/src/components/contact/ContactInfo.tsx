import { Phone, MessageCircle, Mail, MapPin } from 'lucide-react'

const cards = [
  {
    icon: Phone,
    title: 'Call Us',
    detail: '+20 11 16407080',
    sub: 'Available daily 9AM – 9PM',
    href: 'tel:+201116407080',
    color: 'text-brand-primary',
    bg: 'bg-sky-50',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp',
    detail: '+20 11 16407080',
    sub: 'Fastest way to reach us',
    href: 'https://wa.me/201116407080',
    color: 'text-[#25d366]',
    bg: 'bg-green-50',
  },
  {
    icon: Mail,
    title: 'Email',
    detail: 'Ahmedyehya47@gmail.com',
    sub: 'We reply within 24 hours',
    href: 'mailto:Ahmedyehya47@gmail.com',
    color: 'text-[#e84a2e]',
    bg: 'bg-red-50',
  },
  {
    icon: MapPin,
    title: 'Find Us',
    detail: 'Ras Sudr, South Sinai',
    sub: 'On the beach road, Ras Sudr',
    href: 'https://maps.app.goo.gl/2wMvsj449P4FDDRe8',
    color: 'text-brand-dark',
    bg: 'bg-slate-50',
  },
]

export default function ContactInfo() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-display font-bold text-2xl text-brand-dark mb-2">
        Contact Details
      </h2>
      {cards.map(({ icon: Icon, title, detail, sub, href, color, bg }) => (
        <a
          key={title}
          href={href}
          target={href.startsWith('http') ? '_blank' : undefined}
          rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
          className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 bg-white hover:shadow-md hover:-translate-y-0.5 transition-all group"
        >
          <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center flex-none`}>
            <Icon size={20} className={color} />
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-sm text-brand-dark group-hover:text-brand-primary transition-colors">{title}</div>
            <div className="text-brand-dark font-medium text-sm truncate">{detail}</div>
            <div className="text-xs text-gray-400 mt-0.5">{sub}</div>
          </div>
        </a>
      ))}
    </div>
  )
}
