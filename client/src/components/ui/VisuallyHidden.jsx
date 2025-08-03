import * as React from "react";

export function VisuallyHidden({
  as: Component = "span",
  children,
  className = "",
  style,
  ...props
}) {
  return (
    <Component
      className={`sr-only ${className}`}
      style={{
        position: "absolute",
        width: "1px",
        height: "1px",
        padding: 0,
        margin: "-1px",
        overflow: "hidden",
        clip: "rect(0, 0, 0, 0)",
        whiteSpace: "nowrap",
        border: 0,
        ...style,
      }}
      {...props}
    >
      {children}
    </Component>
  );
}
