import {
    Toast,
    ToastDescription,
    ToastTitle,
    ToastAction,
    ToastClose,
  } from "@/components/ui/toast"
  import { useToast } from "@/hooks/use-toast"
  import { useAppSelector } from '@/store/hooks'
  
  export function Toaster() {
    const { toasts } = useToast()
    const isDarkMode = useAppSelector((state) => state.theme.isDarkMode)
  
    return (
      <>
        {toasts.map(({ id, title, description, action, ...props }) => (
          <Toast
            key={id}
            {...props}
            className={`relative ${
              isDarkMode
                ? "bg-black/70 text-white border border-orange-500 backdrop-blur-3xl"
                : "bg-gradient-to-br from-rose-500 to-amber-50 text-black border border-black"
            }`}
          >
            <div className="grid gap-1 pr-6"> {/* leave space for close button */}
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && <ToastDescription>{description}</ToastDescription>}
            </div>
            {action}
            <ToastClose
              className={`absolute right-2 top-2 p-1 rounded-md ${
                isDarkMode ? "text-white" : "text-black"
              } opacity-100`}
            />
          </Toast>
        ))}
      </>
    )
  }
  