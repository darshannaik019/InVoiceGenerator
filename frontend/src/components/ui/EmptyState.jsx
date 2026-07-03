import React from 'react';
import { Plus } from 'lucide-react';
import Button from './Button';

const EmptyState = ({ title, description, icon: Icon, onAction, actionLabel }) => {
  return (
    <div className="py-20 flex flex-col items-center justify-center text-center px-4">
      <div className="bg-primary/10 p-6 rounded-full text-primary mb-4 animate-bounce">
        <Icon size={48} />
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-text-secondary mb-8 max-w-xs mx-auto">{description}</p>
      {onAction && actionLabel && (
        <Button variant="primary" icon={Plus} size="lg" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
