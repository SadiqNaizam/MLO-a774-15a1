import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import MenuItemCard from '@/components/MenuItemCard';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { Star, Clock, ShoppingCart, Utensils, ChevronLeft } from 'lucide-react';

// Placeholder data
const restaurantDetails = {
  name: "Luigi's Pizzeria",
  logoUrl: 'https://source.unsplash.com/random/100x100?pizzalogo',
  coverImageUrl: 'https://source.unsplash.com/random/1200x400?italian,restaurant,interior',
  rating: 4.5,
  deliveryTime: '25-35 min',
  cuisine: 'Italian',
  menu: {
    appetizers: [
      { id: 'm1', name: 'Garlic Bread', description: 'Toasted bread with garlic butter and herbs.', price: 6.99, imageUrl: 'https://source.unsplash.com/random/300x200?garlic,bread' },
      { id: 'm2', name: 'Caprese Salad', description: 'Fresh mozzarella, tomatoes, and basil.', price: 8.50, imageUrl: 'https://source.unsplash.com/random/300x200?caprese,salad' },
    ],
    main_courses: [
      { id: 'm3', name: 'Margherita Pizza', description: 'Classic pizza with tomato, mozzarella, and basil.', price: 12.99, imageUrl: 'https://source.unsplash.com/random/300x200?margherita,pizza' },
      { id: 'm4', name: 'Pepperoni Pizza', description: 'Pizza with spicy pepperoni and mozzarella.', price: 14.50, imageUrl: 'https://source.unsplash.com/random/300x200?pepperoni,pizza' },
      { id: 'm5', name: 'Spaghetti Carbonara', description: 'Pasta with creamy egg sauce, pancetta, and cheese.', price: 15.00, imageUrl: 'https://source.unsplash.com/random/300x200?carbonara' },
    ],
    desserts: [
      { id: 'm6', name: 'Tiramisu', description: 'Classic Italian coffee-flavored dessert.', price: 7.50, imageUrl: 'https://source.unsplash.com/random/300x200?tiramisu' },
    ]
  }
};

type MenuItem = { id: string; name: string; price: number; description?: string; imageUrl?: string };

const RestaurantMenuPage = () => {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false); // Example for alternate detail view
  const [cart, setCart] = useState<MenuItem[]>([]);
  const navigate = useNavigate();

  console.log('RestaurantMenuPage loaded');

  const handleAddToCart = (item: MenuItem) => {
    setCart(prevCart => [...prevCart, item]);
    // Here you would typically use a toast notification
    console.log(`${item.name} added to cart.`);
  };

  const handleViewDetailsDialog = (itemId: string) => {
    const item = Object.values(restaurantDetails.menu).flat().find(i => i.id === itemId);
    if (item) {
      setSelectedItem(item);
      setIsDialogOpen(true);
    }
  };
  
  // Example: using sheet for a different interaction or item type
  const handleViewDetailsSheet = (itemId: string) => {
    const item = Object.values(restaurantDetails.menu).flat().find(i => i.id === itemId);
    if (item) {
      setSelectedItem(item);
      setIsSheetOpen(true);
    }
  };


  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
       <header className="sticky top-0 z-50 bg-white shadow-sm">
        <NavigationMenu className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Button variant="ghost" onClick={() => navigate(-1)} className="mr-2">
                <ChevronLeft className="h-5 w-5" /> Back
              </Button>
            </NavigationMenuItem>
            <NavigationMenuItem>
               <a href="/" className="flex items-center space-x-2 text-xl font-bold text-primary">
                <Utensils className="h-7 w-7" />
                <span>FoodFleet</span>
              </a>
            </NavigationMenuItem>
          </NavigationMenuList>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Button variant="outline" onClick={() => navigate('/cart')}>
                <ShoppingCart className="h-5 w-5 mr-2" />
                Cart ({cart.length})
              </Button>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </header>

      <main className="flex-grow">
        <section aria-labelledby="restaurant-hero" className="relative h-48 md:h-64">
          <img src={restaurantDetails.coverImageUrl} alt={`${restaurantDetails.name} cover`} className="w-full h-full object-cover"/>
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute bottom-0 left-0 p-4 md:p-6 flex items-end space-x-4">
            <Avatar className="h-20 w-20 md:h-24 md:w-24 border-4 border-white shadow-lg">
              <AvatarImage src={restaurantDetails.logoUrl} alt={restaurantDetails.name} />
              <AvatarFallback>{restaurantDetails.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h1 id="restaurant-name" className="text-2xl md:text-3xl font-bold text-white shadow-sm">{restaurantDetails.name}</h1>
              <div className="flex items-center space-x-3 mt-1">
                <Badge variant="secondary" className="text-sm">
                  <Star className="w-4 h-4 mr-1 text-yellow-400 fill-yellow-400" /> {restaurantDetails.rating.toFixed(1)}
                </Badge>
                <Badge variant="secondary" className="text-sm">
                  <Clock className="w-4 h-4 mr-1" /> {restaurantDetails.deliveryTime}
                </Badge>
                <Badge variant="outline" className="text-sm text-white border-white">{restaurantDetails.cuisine}</Badge>
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="restaurant-menu" className="container mx-auto px-4 py-8">
          <Tabs defaultValue="main_courses" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="appetizers">Appetizers</TabsTrigger>
              <TabsTrigger value="main_courses">Main Courses</TabsTrigger>
              <TabsTrigger value="desserts">Desserts</TabsTrigger>
            </TabsList>
            
            <ScrollArea className="h-[calc(100vh-400px)]"> {/* Adjust height as needed */}
              <TabsContent value="appetizers">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {restaurantDetails.menu.appetizers.map(item => (
                    <MenuItemCard key={item.id} {...item} onAddToCart={handleAddToCart} onViewDetails={handleViewDetailsDialog} />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="main_courses">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {restaurantDetails.menu.main_courses.map(item => (
                    <MenuItemCard key={item.id} {...item} onAddToCart={handleAddToCart} onViewDetails={handleViewDetailsDialog} />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="desserts">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {restaurantDetails.menu.desserts.map(item => (
                    <MenuItemCard key={item.id} {...item} onAddToCart={handleAddToCart} onViewDetails={handleViewDetailsSheet} />
                  ))}
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </section>
      </main>

      {selectedItem && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{selectedItem.name}</DialogTitle>
              {selectedItem.imageUrl && <img src={selectedItem.imageUrl} alt={selectedItem.name} className="my-4 rounded-lg max-h-48 w-full object-cover" />}
              <DialogDescription>{selectedItem.description}</DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="text-lg font-semibold">Price: ${selectedItem.price.toFixed(2)}</p>
              {/* Add customization options here if needed */}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Close</Button>
              <Button onClick={() => { handleAddToCart(selectedItem); setIsDialogOpen(false); }}>
                <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
       {selectedItem && (
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>{selectedItem.name}</SheetTitle>
              {selectedItem.imageUrl && <img src={selectedItem.imageUrl} alt={selectedItem.name} className="my-4 rounded-lg max-h-48 w-full object-cover" />}
              <SheetDescription>{selectedItem.description}</SheetDescription>
            </SheetHeader>
            <div className="py-4">
              <p className="text-lg font-semibold">Price: ${selectedItem.price.toFixed(2)}</p>
              {/* Add customization options here for the sheet variant */}
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button variant="outline">Close</Button>
              </SheetClose>
              <SheetClose asChild>
                <Button onClick={() => handleAddToCart(selectedItem)}>
                  <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                </Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
};

export default RestaurantMenuPage;