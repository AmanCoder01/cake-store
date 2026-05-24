import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Input = ({ label, error, className, id, leftIcon, rightIcon, ...props }) => {
  return (
    <div className="w-full mb-4">
      {label && (
        <label htmlFor={id} className="block text-sm font-semibold text-text mb-1.5 ml-1">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-4 text-gray-400 flex items-center justify-center pointer-events-none z-10">
            {leftIcon}
          </div>
        )}
        <input
          id={id}
          className={twMerge(
            clsx(
              "w-full px-4 py-2.5 rounded-xl border-2 border-gray-100 bg-white text-text transition-all outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/10 disabled:bg-gray-50 disabled:cursor-not-allowed",
              leftIcon && "pl-12",
              rightIcon && "pr-12",
              error && "border-red-500 focus:border-red-500 focus:ring-red-500",
              className
            )
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-4 flex items-center justify-center z-10">
            {rightIcon}
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-500 ml-1">{error}</p>}
    </div>
  );
};

export default Input;
