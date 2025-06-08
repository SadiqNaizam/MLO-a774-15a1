import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import CuisineCategoryChip from '@/components/CuisineCategoryChip';
import RestaurantCard from '@/components/RestaurantCard';
import { Search, Utensils } from 'lucide-react';

// Placeholder data
const cuisineCategories = [
  { name: 'Pizza', imageUrl: 'https://source.unsplash.com/random/100x100?pizza' },
  { name: 'Burger', imageUrl: 'https://source.unsplash.com/random/100x100?burger' },
  { name: 'Sushi', imageUrl: 'https://source.unsplash.com/random/100x100?sushi' },
  { name: 'Italian', imageUrl: 'https://source.unsplash.com/random/100x100?pasta' },
  { name: 'Chinese', imageUrl: 'https://source.unsplash.com/random/100x100?chinese,food' },
  { name: 'Mexican', imageUrl: 'https://source.unsplash.com/random/100x100?mexican,food' },
  { name: 'Indian', imageUrl: 'https://source.unsplash.com/random/100x100?indian,food' },
];

const placeholderRestaurants = [
  { id: '1', name: 'Luigi\'s Pizzeria', imageUrl: 'https://source.unsplash.com/random/400x300?pizza,restaurant', cuisine: 'Italian', rating: 4.5, deliveryTime: '25-35 min' },
  { id: '2', name: 'Burger Queen', imageUrl: 'https://source.unsplash.com/random/400x300?burger,shop', cuisine: 'Fast Food', rating: 4.2, deliveryTime: '20-30 min' },
  { id: '3', name: 'Sushi Yama', imageUrl: 'https://source.unsplash.com/random/400x300?sushi,place', cuisine: 'Japanese', rating: 4.8, deliveryTime: '30-40 min' },
  { id: '4', name: 'Curry House', imageUrl: 'https://source.unsplash.com/random/400x300?indian,cuisine', cuisine: 'Indian', rating: 4.6, deliveryTime: '35-45 min' },
];

const HomePage = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  console.log('HomePage loaded');

  const handleCategoryClick = (name: string) => {
    setActiveCategory(name === activeCategory ? null : name);
    // Add filtering logic here if needed
  };

  const handleRestaurantClick = (id: string) => {
    navigate(`/restaurant-menu`); // Simplified to static route, ideally /restaurant/${id}
  };

  const filteredRestaurants = placeholderRestaurants.filter(restaurant =>
    (activeCategory ? restaurant.cuisine.toLowerCase().includes(activeCategory.toLowerCase()) : true) &&
    (searchTerm ? restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) : true)
  );

  // Simulate loading state for demonstration
  const [isLoading, setIsLoading] = useState(true);
  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);


  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <NavigationMenu className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <NavigationMenuList>
            <NavigationMenuItem>
              <a href="/" className="flex items-center space-x-2 text-xl font-bold text-primary">
                <Utensils className="h-7 w-7" />
                <span>FoodFleet</span>
              </a>
            </NavigationMenuItem>
            {/* Add other navigation items here if needed */}
          </NavigationMenuList>
          {/* Placeholder for user profile/cart icon if NavigationMenu doesn't handle it */}
        </NavigationMenu>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <section aria-labelledby="search-and-filter" className="mb-8">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="search"
              placeholder="Search for restaurants or dishes..."
              className="w-full pl-10 pr-4 py-3 text-lg rounded-lg shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <h2 id="cuisine-categories" className="text-xl font-semibold mb-3 text-gray-700">Or browse by cuisine:</h2>
          <ScrollArea className="w-full whitespace-nowrap pb-4">
            <div className="flex space-x-3">
              {cuisineCategories.map(category => (
                <CuisineCategoryChip
                  key={category.name}
                  name={category.name}
                  imageUrl={category.imageUrl}
                  isActive={activeCategory === category.name}
                  onClick={handleCategoryClick}
                />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </section>

        <section aria-labelledby="restaurant-listings">
          <h2 id="restaurant-listings-title" className="text-2xl font-bold mb-6 text-gray-800">
            {activeCategory ? `${activeCategory} Restaurants` : 'Featured Restaurants'}
          </h2>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="space-y-3">
                  <Skeleton className="h-[200px] w-full rounded-lg" />
                  <Skeleton className="h-6 w-3/4 rounded" />
                  <Skeleton className="h-4 w-1/2 rounded" />
                  <Skeleton className="h-4 w-1/4 rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredRestaurants.length > 0 ? (
                filteredRestaurants.map(resto => (
                  <RestaurantCard
                    key={resto.id}
                    id={resto.id}
                    name={resto.name}
                    imageUrl={resto.imageUrl}
                    cuisine={resto.cuisine}
                    rating={resto.rating}
                    deliveryTime={resto.deliveryTime}
                    onClick={handleRestaurantClick}
                  />
                ))
              ) : (
                <p className="col-span-full text-center text-gray-500">No restaurants found matching your criteria.</p>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default HomePage;