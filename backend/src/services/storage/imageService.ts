import sharp from 'sharp'
import path from 'path'
import crypto from 'crypto'
import fs from 'fs'

const GALLERY_DIR = path.join(__dirname, '../../../uploads/gallery')
if (!fs.existsSync(GALLERY_DIR)) fs.mkdirSync(GALLERY_DIR, { recursive: true })

export async function processGalleryImage(buffer: Buffer) {
  const uuid = crypto.randomUUID()
  const filename = `${uuid}.webp`
  const thumbFilename = `thumb_${uuid}.webp`

  await sharp(buffer)
    .resize({ width: 1920, withoutEnlargement: true })
    .webp({ quality: 85 })
    .toFile(path.join(GALLERY_DIR, filename))

  await sharp(buffer)
    .resize({ width: 600, withoutEnlargement: true })
    .webp({ quality: 75 })
    .toFile(path.join(GALLERY_DIR, thumbFilename))

  return {
    url: `/uploads/gallery/${filename}`,
    thumbnailUrl: `/uploads/gallery/${thumbFilename}`,
  }
}

export function deleteGalleryFiles(url?: string | null, thumbnailUrl?: string | null) {
  for (const u of [url, thumbnailUrl]) {
    if (!u) continue
    fs.unlink(path.join(GALLERY_DIR, path.basename(u)), () => {})
  }
}
