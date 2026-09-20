import accraSkyline from '../../assets/images/accra-skyline.jpg'

/**
 * A subtle, recurring Ghanaian-identity accent: the same Independence Arch
 * photo, corner-cropped and faded, reused sparingly across a few landing
 * sections rather than as one continuous full-page background.
 */
export default function SectionSkyline({ side = 'right' }) {
  if (side === 'left') {
    return (
      <div className="pointer-events-none absolute inset-y-0 left-0 w-full max-w-lg overflow-hidden" aria-hidden="true">
        <img src={accraSkyline} alt="" className="absolute inset-y-0 left-0 h-full w-full object-cover object-center opacity-[0.55] dark:opacity-[0.4]" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white dark:to-slate-950" />
      </div>
    )
  }

  return (
    <div className="pointer-events-none absolute inset-y-0 right-0 w-full max-w-lg overflow-hidden" aria-hidden="true">
      <img src={accraSkyline} alt="" className="absolute inset-y-0 right-0 h-full w-full object-cover object-center opacity-[0.55] dark:opacity-[0.4]" />
      <div className="absolute inset-0 bg-gradient-to-l from-transparent to-white dark:to-slate-950" />
    </div>
  )
}
