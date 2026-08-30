import Card from '../Card'
import Reveal from '../Reveal'

export default function FeatureCard({ icon: Icon, title, description, delay = 0 }) {
  return (
    <Reveal delay={delay}>
      <Card className="h-full transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400">
          <Icon size={20} aria-hidden="true" />
        </div>
        <h3 className="font-semibold text-slate-900 dark:text-white">{title}</h3>
        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">{description}</p>
      </Card>
    </Reveal>
  )
}
