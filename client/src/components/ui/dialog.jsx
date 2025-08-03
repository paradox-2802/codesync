import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { VisuallyHidden } from "./VisuallyHidden"; // adjust path

export function Dialog({ children, ...props }) {
  return <DialogPrimitive.Root {...props}>{children}</DialogPrimitive.Root>;
}

export const DialogTrigger = React.forwardRef(({ children, ...props }, ref) => (
  <DialogPrimitive.Trigger ref={ref} {...props}>
    {children}
  </DialogPrimitive.Trigger>
));
DialogTrigger.displayName = DialogPrimitive.Trigger.displayName;

export const DialogTitle = React.forwardRef(
  ({ className = "", ...props }, ref) => (
    <DialogPrimitive.Title
      ref={ref}
      className={`text-lg font-semibold ${className}`}
      {...props}
    />
  )
);
DialogTitle.displayName = DialogPrimitive.Title.displayName;

export const DialogDescription = React.forwardRef(
  ({ className = "", ...props }, ref) => (
    <DialogPrimitive.Description
      ref={ref}
      className={`text-sm text-gray-600 ${className}`}
      {...props}
    />
  )
);
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export const DialogContent = React.forwardRef(
  (
    {
      title,
      hideTitle = false,
      children,
      className = "",
      overlayClassName = "",
      closeClassName = "",
    },
    ref
  ) => {
    return (
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={`fixed inset-0 bg-black/70 z-40 ${overlayClassName}`}
        />
        <DialogPrimitive.Content
          ref={ref}
          className={`fixed top-1/2 left-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg ${className}`}
        >
          {title && (
            <DialogTitle className={hideTitle ? undefined : "mb-2"}>
              {hideTitle ? <VisuallyHidden>{title}</VisuallyHidden> : title}
            </DialogTitle>
          )}
          {children}
          <DialogPrimitive.Close
            className={`absolute top-4 right-4 text-gray-500 hover:text-gray-700 ${closeClassName}`}
          >
            <X className="h-5 w-5" />
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    );
  }
);
DialogContent.displayName = DialogPrimitive.Content.displayName;
