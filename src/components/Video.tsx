/** A video added by the admin: a YouTube link (embedded) or an uploaded file. */
export function youTubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/)
  return m ? m[1] : null
}

export function Video({ url }: { url: string }) {
  if (!/^https?:\/\//.test(url)) return null
  const yt = youTubeId(url)
  return (
    <div className="video">
      {yt
        ? <iframe src={`https://www.youtube-nocookie.com/embed/${yt}`} title="Video" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowFullScreen loading="lazy" />
        : <video src={url} controls preload="metadata" playsInline />}
    </div>
  )
}
