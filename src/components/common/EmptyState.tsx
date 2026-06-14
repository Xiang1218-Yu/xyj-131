import { PackageOpen } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
}

export default function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center mb-6">
        <PackageOpen className="w-10 h-10 text-gold/50" />
      </div>
      <h3 className="font-display text-2xl text-parchment mb-3">{title}</h3>
      <p className="font-body text-lg text-gold-muted max-w-md mb-6">{description}</p>
      {action}
    </div>
  );
}
