import MenuItemCard from './MenuItemCard'

interface MenuItem {
  id: string
  name: string
  description?: string | null
  price: number | string
  imageUrl?: string | null
  tags: string[]
  isAvailable: boolean
  sortOrder: number
}

interface Props {
  name: string
  note?: string
  items: MenuItem[]
}

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export default function MenuSection({ name, note, items }: Props) {
  const sorted = [...items].sort((a, b) => a.sortOrder - b.sortOrder)

  return (
    <section id={slugify(name)} className="py-12 px-4 scroll-mt-28">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h2 className="font-outfit font-bold text-3xl text-[#022b3d] inline-block">
            {name}
          </h2>
          <div className="mt-1 h-1 w-16 rounded-full" style={{ backgroundColor: '#1a9fd4' }} />
          {note && (
            <p className="mt-2 text-sm italic text-gray-500">{note}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sorted.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  )
}
