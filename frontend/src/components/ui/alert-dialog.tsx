import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}

export const AlertDialog = ({ open, onOpenChange, children }: AlertDialogProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative z-50">{children}</div>
    </div>
  );
};

interface AlertDialogContentProps {
  children: ReactNode;
  className?: string;
}

export const AlertDialogContent = ({ children, className }: AlertDialogContentProps) => {
  return (
    <div
      className={cn(
        'bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4',
        className
      )}
    >
      {children}
    </div>
  );
};

interface AlertDialogHeaderProps {
  children: ReactNode;
}

export const AlertDialogHeader = ({ children }: AlertDialogHeaderProps) => {
  return <div className="mb-4">{children}</div>;
};

interface AlertDialogTitleProps {
  children: ReactNode;
}

export const AlertDialogTitle = ({ children }: AlertDialogTitleProps) => {
  return <h2 className="text-xl font-semibold text-gray-900">{children}</h2>;
};

interface AlertDialogDescriptionProps {
  children: ReactNode;
}

export const AlertDialogDescription = ({ children }: AlertDialogDescriptionProps) => {
  return <p className="text-gray-600 mt-2">{children}</p>;
};

interface AlertDialogFooterProps {
  children: ReactNode;
}

export const AlertDialogFooter = ({ children }: AlertDialogFooterProps) => {
  return <div className="flex justify-end gap-3 mt-6">{children}</div>;
};

interface AlertDialogActionProps {
  children: ReactNode;
  onClick: () => void;
  variant?: 'default' | 'destructive';
}

export const AlertDialogAction = ({
  children,
  onClick,
  variant = 'default',
}: AlertDialogActionProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-4 py-2 rounded-lg font-medium transition-colors',
        variant === 'destructive'
          ? 'bg-red-600 text-white hover:bg-red-700'
          : 'bg-blue-600 text-white hover:bg-blue-700'
      )}
    >
      {children}
    </button>
  );
};

interface AlertDialogCancelProps {
  children: ReactNode;
  onClick: () => void;
}

export const AlertDialogCancel = ({ children, onClick }: AlertDialogCancelProps) => {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
    >
      {children}
    </button>
  );
};
