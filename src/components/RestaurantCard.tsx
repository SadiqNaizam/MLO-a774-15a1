import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Star, Clock } from 'lucide-react'; // Icons for rating and delivery time

interface RestaurantCardProps {
  id: string;
  name: string;
  imageUrl: string;
  cuisine: string; // e.g., "Italian", "Mexican"
  rating: number; // e.g., 4.5
  deliveryTime: string; // e.g., "20-30 min"
  onClick: (id: string) => void;
  className?: string;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  id,
  name,
  imageUrl,
  cuisine,
  rating,
  deliveryTime,
  onClick,
  className,
}) => {
  console.log("Rendering RestaurantCard:", name);

  return (
    <Card
      className={cn("w-full max-w-sm overflow-hidden transition-shadow duration-300 hover:shadow-lg cursor-pointer", className)}
      onClick={() => onClick(id)}
    >
      <CardHeader className="p-0">
        <AspectRatio ratio={16 / 9}>
          <img
            src={imageUrl || '/placeholder.svg'}
            alt={name}
            className="object-cover w-full h-full"
            onError={(e) => (e.currentTarget.src = '/placeholder.svg')}
          />
        </AspectRatio>
      </CardHeader>
      <CardContent className="p-4 space-y-2">
        <CardTitle className="text-lg font-semibold truncate">{name}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">{cuisine}</CardDescription>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span>{rating.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{deliveryTime}</span>
          </div>
        </div>
      </CardContent>
      {/* CardFooter could be used for promotions or quick actions if needed later */}
      {/* <CardFooter className="p-4 pt-0">
        <Button variant="outline" size="sm" className="w-full">View Menu</Button>
      </CardFooter> */}
    </Card>
  );
};

export default RestaurantCard;