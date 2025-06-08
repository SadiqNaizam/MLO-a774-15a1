import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem } from "@/components/ui/navigation-menu";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import MenuItemCard from '@/components/MenuItemCard'; // For compact display or use table
import { Trash2, PlusCircle, MinusCircle, Utensils, ChevronLeft, Percent } from 'lucide-react';

type CartItem = { id: string; name: string; price: number; quantity: number; imageUrl?: string; description?: string; };

const initialCartItems: CartItem[] = [
  { id: 'm3', name: 'Margherita Pizza', price: 12.99, quantity: 1, imageUrl: 'https://source.unsplash.com/random/300x200?margherita,pizza', description: 'Classic pizza' },
  { id: 'm6', name: 'Tiramisu', price: 7.50, quantity: 2, imageUrl: 'https://source.unsplash.com/random/300x200?tiramisu', description: 'Coffee dessert' },
];

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  const [promoCode, setPromoCode] = useState('');
  const navigate = useNavigate();

  console.log('CartPage loaded');

  const updateQuantity = (id: string, change: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + change) } : item
      ).filter(item => item.quantity > 0) // Optionally remove if quantity becomes 0
    );
  };

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = cartItems.length > 0 ? 5.00 : 0; // Example fee
  const taxRate = 0.08; // Example tax rate
  const taxes = subtotal * taxRate;
  const total = subtotal + deliveryFee + taxes;

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
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
                <span>Your Cart</span>
              </a>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <img src="https://source.unsplash.com/random/300x300?empty,cart" alt="Empty cart" className="mx-auto mb-6 w-48 h-48 object-contain" />
            <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Looks like you haven't added anything to your cart yet.</p>
            <Button onClick={() => navigate('/')}>Start Shopping</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <section aria-labelledby="cart-items-heading" className="lg:col-span-2">
              <h2 id="cart-items-heading" className="text-2xl font-semibold mb-6">Shopping Cart ({cartItems.length} items)</h2>
              <ScrollArea className="h-[calc(100vh-350px)] pr-4"> {/* Adjust height */}
                <div className="space-y-4">
                  {cartItems.map(item => (
                    <Card key={item.id} className="overflow-hidden">
                      <CardContent className="p-4 flex items-center space-x-4">
                        <img src={item.imageUrl || 'https://via.placeholder.com/100'} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
                        <div className="flex-grow">
                          <h3 className="font-semibold">{item.name}</h3>
                          <p className="text-sm text-gray-500">{item.description}</p>
                          <p className="text-sm font-medium text-primary">${item.price.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, -1)}><MinusCircle className="h-4 w-4" /></Button>
                          <span>{item.quantity}</span>
                          <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, 1)}><PlusCircle className="h-4 w-4" /></Button>
                        </div>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
                              <Trash2 className="h-5 w-5" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remove Item?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to remove "{item.name}" from your cart?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => removeItem(item.id)} className="bg-red-600 hover:bg-red-700">Remove</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </CardContent>
                      {/* Example using MenuItemCard in compact mode instead of custom layout:
                       <MenuItemCard {...item} onAddToCart={() => {}} compact /> 
                       Then add quantity controls and remove button separately.
                      */}
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </section>

            <aside className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Promo Code</CardTitle>
                </CardHeader>
                <CardContent className="flex space-x-2">
                  <Input 
                    type="text" 
                    placeholder="Enter promo code" 
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)} 
                  />
                  <Button variant="outline">Apply</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Delivery Fee</span><span>${deliveryFee.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Taxes ({(taxRate*100).toFixed(0)}%)</span><span>${taxes.toFixed(2)}</span></div>
                  <hr className="my-2"/>
                  <div className="flex justify-between font-semibold text-lg"><span>Total</span><span>${total.toFixed(2)}</span></div>
                </CardContent>
                <CardFooter>
                  <Button size="lg" className="w-full" onClick={() => navigate('/checkout')}>
                    Proceed to Checkout
                  </Button>
                </CardFooter>
              </Card>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
};

export default CartPage;