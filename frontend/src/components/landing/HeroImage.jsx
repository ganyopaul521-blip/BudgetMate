import dashboardTabletImage from '../../assets/images/dashboard-tablet.jpg'

/**
 * Hero background: the same real dashboard-on-a-tablet photo, now faded in
 * behind the hero copy (instead of framed as a foreground card) and masked
 * with a gradient so it reads as texture, not a competing focal point.
 */
export default function HeroImage() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <img
        src={dashboardTabletImage}
        alt=""
        width={736}
        height={1104}
        fetchPriority="high"
        className="absolute right-0 top-0 h-full w-full object-cover object-left opacity-40 sm:w-2/3 sm:object-right lg:w-1/2 dark:opacity-25"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-white via-white/70 to-white/10 dark:from-slate-950 dark:via-slate-950/70 dark:to-slate-950/10 sm:to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white dark:from-slate-950" />
    </div>
  )
}
