interface GalleryItem {
  id:           string
  url:          string
  caption:      string | null
  category:     string | null
}

interface Props {
  videos: GalleryItem[]
}

function getEmbedUrl(url: string) {
  // Convert youtube.com/watch?v=ID → youtube.com/embed/ID
  const ytWatch = url.match(/youtube\.com\/watch\?v=([\w-]+)/)
  if (ytWatch) return `https://www.youtube.com/embed/${ytWatch[1]}`
  // Convert youtu.be/ID → youtube.com/embed/ID
  const ytShort = url.match(/youtu\.be\/([\w-]+)/)
  if (ytShort) return `https://www.youtube.com/embed/${ytShort[1]}`
  // Already embed or vimeo — use as-is
  return url
}

export default function VideoGrid({ videos }: Props) {
  if (!videos.length) return null

  return (
    <section className="px-4 pb-16">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-outfit font-bold text-2xl text-brand-dark mb-6">Videos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map(video => (
            <div key={video.id} className="group rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <div className="relative aspect-video bg-brand-dark">
                <iframe
                  src={getEmbedUrl(video.url)}
                  title={video.caption ?? 'Video'}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                  loading="lazy"
                />
              </div>
              {video.caption && (
                <div className="px-4 py-3 bg-white">
                  <p className="text-sm text-gray-700 font-medium truncate">{video.caption}</p>
                  {video.category && (
                    <span className="text-xs text-brand-primary capitalize">{video.category}</span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
