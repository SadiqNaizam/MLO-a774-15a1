import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { ShoppingCart, Eye } from 'lucide-react'; // Icons
import { cn } from '@/lib/utils';

interface MenuItemCardProps {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  onAddToCart: (item: { id: string; name: string; price: number }) => void; // Pass item details for cart
  onViewDetails?: (id: string) => void; // Optional: to open a dialog/sheet for customization
  className?: string;
  compact?: boolean; // For a smaller version, e.g., in cart
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({
  id,
  name,
  description,
  price,
  imageUrl,
  onAddToCart,
  onViewDetails,
  className,
  compact = false,
}) => {
  console.log("Rendering MenuItemCard:", name, "Compact:", compact);

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Prevent card click if button is inside clickable area
    onAddToCart({ id, name, price });
    // Consider using toast here: toast({ title: `${name} added to cart!` });
  };

  const handleViewDetails = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (onViewDetails) {
      onViewDetails(id);
    }
  };

  if (compact) {
    return (
      <Card className={cn("w-full flex items-center p-3 gap-3", className)}>
        {imageUrl && (
          <div className="w-16 h-16 flex-shrink-0 rounded overflow-hidden">
            <img
              src={imageUrl || '/placeholder.svg'}
              alt={name}
              className="object-cover w-full h-full"
              onError={(e) => (e.currentTarget.src = '/placeholder.svg')}
            />
          </div>
        )}
        <div className="flex-grow overflow-hidden">
          <h3 className="text-sm font-semibold truncate">{name}</h3>
          <p className="text-sm font-bold text-primary">${price.toFixed(2)}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleAddToCart}
          aria-label="Add to cart"
        >
          <ShoppingCart className="w-5 h-5" />
        </Button>
      </Card>
    );
  }

  return (
    <Card
      className={cn("w-full max-w-xs overflow-hidden transition-shadow duration-300 hover:shadow-lg", className)}
      onClick={() => onViewDetails && onViewDetails(id)} // Make card clickable if onViewDetails is provided
    >
      {imageUrl && (
        <CardHeader className="p-0">
          <AspectRatio ratio={4 / 3}>
            <img
              src={imageUrl || '/placeholder.svg'}
              alt={name}
              className="object-cover w-full h-full"
              onError={(e) => (e.currentTarget.src = '/placeholder.svg')}
            />
          </AspectRatio>
        </CardHeader>
      )}
      <CardContent className="p-4 space-y-1">
        <CardTitle className="text-md font-semibold truncate">{name}</CardTitle>
        {description && (
          <CardDescription className="text-xs text-muted-foreground line-clamp-2">
            {description}
          </CardDescription>
        )}
        <p className="text-lg font-bold text-primary">${price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        {onViewDetails && (
          <Button variant="outline" size="sm" className="flex-1" onClick={handleViewDetails}>
            <Eye className="w-4 h-4 mr-2" />
            Details
          </Button>
        )}
        <Button size="sm" className="flex-1" onClick={handleAddToCart}>
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MenuItemCard;