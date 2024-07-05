import React, { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  endAdornment?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ type = "text", className = "", endAdornment, ...props }, ref) => (
    <div className="relative">
      <input
        ref={ref}
        type={type}
        className={`shad-input ${className}`}
        {...props}
      />
      {endAdornment && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          {endAdornment}
        </div>
      )}
    </div>
  )
);

export default Input;
