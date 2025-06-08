import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem } from "@/components/ui/navigation-menu";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import LiveOrderTracker from '@/components/LiveOrderTracker';
import type { OrderStatus, DriverInfo } from '@/components/LiveOrderTracker'; // Assuming types are exported
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // used within LiveOrderTracker, but can be used here too
import { Progress } from "@/components/ui/progress"; // used within LiveOrderTracker
import { Utensils, ChevronLeft, Phone } from 'lucide-react';

// Placeholder data
const initialOrderData = {
  orderId: 'ORD12345XYZ',
  currentStatus: 'confirmed' as OrderStatus,
  estimatedDeliveryTime: '6:15 PM - 6:30 PM',
  driverInfo: {
    name: 'John Doe',
    avatarUrl: 'https://source.unsplash.com/random/100x100?driver',
    vehicle: 'Bike - SGX 1234A'
  } as DriverInfo,
  statusHistory: [
    { status: 'confirmed' as OrderStatus, timestamp: new Date(Date.now() - 300000).toISOString() }, // 5 mins ago
  ]
};

const OrderTrackingPage = () => {
  const [orderData, setOrderData] = useState(initialOrderData);
  const navigate = useNavigate();

  console.log('OrderTrackingPage loaded');

  // Simulate order status updates
  useEffect(() => {
    const statuses: OrderStatus[] = ['preparing', 'out_for_delivery', 'delivered'];
    let currentStatusIndex = 0;

    const interval = setInterval(() => {
      currentStatusIndex++;
      if (currentStatusIndex < statuses.length) {
        const newStatus = statuses[currentStatusIndex];
        setOrderData(prevData => ({
          ...prevData,
          currentStatus: newStatus,
          statusHistory: [...(prevData.statusHistory || []), { status: newStatus, timestamp: new Date().toISOString() }],
          estimatedDeliveryTime: newStatus === 'out_for_delivery' ? 'In 10-15 minutes' : (newStatus === 'delivered' ? 'Delivered' : prevData.estimatedDeliveryTime)
        }));
      } else {
        clearInterval(interval);
      }
    }, 15000); // Update every 15 seconds

    return () => clearInterval(interval);
  }, []);


  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <NavigationMenu className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <NavigationMenuList>
             <NavigationMenuItem>
              <Button variant="ghost" onClick={() => navigate('/')} className="mr-2">
                <ChevronLeft className="h-5 w-5" /> Back to Home
              </Button>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <a href="/" className="flex items-center space-x-2 text-xl font-bold text-primary">
                <Utensils className="h-7 w-7" />
                <span>Order Tracking</span>
              </a>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="text-2xl">Your Order is on its Way!</CardTitle>
                    <CardDescription>Track your order #{orderData.orderId} in real-time.</CardDescription>
                </CardHeader>
                <CardContent>
                    <LiveOrderTracker
                        orderId={orderData.orderId}
                        currentStatus={orderData.currentStatus}
                        estimatedDeliveryTime={orderData.estimatedDeliveryTime}
                        driverInfo={orderData.currentStatus === 'out_for_delivery' ? orderData.driverInfo : undefined}
                        statusHistory={orderData.statusHistory}
                    />
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle>Need Help?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-gray-600">If you have any issues with your order, please contact support.</p>
                    <Button variant="outline" className="w-full">
                        <Phone className="mr-2 h-4 w-4" /> Contact Support
                    </Button>
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
};

export default OrderTrackingPage;