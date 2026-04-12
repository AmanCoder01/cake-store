import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Card = ({ children, className, ...props }) => {
  return (
    <div className={twMerge(clsx("card", className))} {...props}>
      {children}
    </div>
  );
};

export default Card;
