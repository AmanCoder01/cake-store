import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={twMerge('shimmer rounded-md bg-gray-200', className)}
      {...props}
    />
  );
};

export default Skeleton;
