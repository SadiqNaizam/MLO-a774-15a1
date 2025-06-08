import React from 'react';
import { cn } from '@/lib/utils'; // For conditional classes
import { Button } from '@/components/ui/button'; // Using Button for clickability and styling base

interface CuisineCategoryChipProps {
  name: string;
  imageUrl?: string; // Optional image/icon for the chip
  isActive?: boolean;
  onClick: (name: string) => void;
  className?: string;
}

const CuisineCategoryChip: React.FC<CuisineCategoryChipProps> = ({
  name,
  imageUrl,
  isActive,
  onClick,
  className,
}) => {
  console.log("Rendering CuisineCategoryChip:", name, "Active:", isActive);

  return (
    <Button
      variant={isActive ? 'default' : 'outline'}
      size="sm"
      className={cn(
        "h-auto py-2 px-4 rounded-full shadow-sm transition-all duration-200 ease-in-out",
        "flex items-center gap-2",
        isActive ? "bg-primary text-primary-foreground hover:bg-primary/90" : "hover:bg-accent hover:text-accent-foreground",
        className
      )}
      onClick={() => onClick(name)}
    >
      {imageUrl && (
        <img src={imageUrl} alt={name} className="w-5 h-5 rounded-full object-cover" />
      )}
      <span className="text-sm font-medium">{name}</span>
    </Button>
  );
};

export default CuisineCategoryChip;