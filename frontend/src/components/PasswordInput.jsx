import { Eye, EyeOff, Lock } from 'lucide-react'
import { forwardRef, useState } from 'react'
import Input from './Input'

/** Password field with a show/hide toggle. Wraps Input so it inherits label/hint/error/a11y wiring. */
const PasswordInput = forwardRef(function PasswordInput({ id, ...props }, ref) {
  const [visible, setVisible] = useState(false)

  return (
    <Input
      ref={ref}
      id={id}
      type={visible ? 'text' : 'password'}
      leftIcon={Lock}
      rightElement={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
          className="rounded-md p-1.5 text-slate-400 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-slate-500 dark:hover:text-slate-300"
        >
          {visible ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
        </button>
      }
      {...props}
    />
  )
})

export default PasswordInput
