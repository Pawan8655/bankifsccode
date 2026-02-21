import { Building2 } from 'lucide-react';

interface LoaderProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Loader({ text = 'Loading...', size = 'md' }: LoaderProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-16 w-16',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <div className="relative">
        <div className={`${sizeClasses[size]} rounded-full border-4 border-primary/20 border-t-primary animate-spin`} />
        <Building2 className={`${sizeClasses[size]} text-primary/30 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-50`} />
      </div>
      <p className={`${textSizeClasses[size]} text-muted-foreground animate-pulse`}>{text}</p>
    </div>
  );
}
