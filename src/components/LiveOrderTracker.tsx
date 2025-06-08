import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CheckCircle, Package, Truck, Home, XCircle } from 'lucide-react'; // Icons for statuses
import { cn } from '@/lib/utils';

type OrderStatus = 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';

interface DriverInfo {
  name: string;
  avatarUrl?: string;
  vehicle?: string; // e.g., "Bike - AB 123 CD"
}

interface LiveOrderTrackerProps {
  orderId: string;
  currentStatus: OrderStatus;
  estimatedDeliveryTime?: string; // e.g., "5:30 PM - 5:45 PM" or "in 15 minutes"
  driverInfo?: DriverInfo;
  statusHistory?: { status: OrderStatus; timestamp: string }[]; // For showing a timeline
  className?: string;
}

const statusDetails: Record<OrderStatus, { label: string; icon: React.ElementType; progress: number; color: string }> = {
  confirmed: { label: "Order Confirmed", icon: CheckCircle, progress: 25, color: "text-blue-500" },
  preparing: { label: "Preparing Your Order", icon: Package, progress: 50, color: "text-yellow-500" },
  out_for_delivery: { label: "Out for Delivery", icon: Truck, progress: 75, color: "text-orange-500" },
  delivered: { label: "Delivered", icon: Home, progress: 100, color: "text-green-500" },
  cancelled: { label: "Order Cancelled", icon: XCircle, progress: 0, color: "text-red-500" },
};

const LiveOrderTracker: React.FC<LiveOrderTrackerProps> = ({
  orderId,
  currentStatus,
  estimatedDeliveryTime,
  driverInfo,
  // statusHistory, // Could be used to render a timeline later
  className,
}) => {
  console.log("Rendering LiveOrderTracker for Order ID:", orderId, "Status:", currentStatus);

  const currentStatusDetail = statusDetails[currentStatus];

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle>Order Tracking</CardTitle>
        <CardDescription>Order ID: {orderId}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Status Display */}
        <div className="text-center space-y-2">
          <currentStatusDetail.icon className={cn("w-12 h-12 mx-auto", currentStatusDetail.color)} />
          <h3 className={cn("text-xl font-semibold", currentStatusDetail.color)}>{currentStatusDetail.label}</h3>
          {estimatedDeliveryTime && currentStatus !== 'delivered' && currentStatus !== 'cancelled' && (
            <p className="text-muted-foreground">Estimated Delivery: {estimatedDeliveryTime}</p>
          )}
           {currentStatus === 'delivered' && (
            <p className="text-green-600">Your order has been delivered. Enjoy!</p>
          )}
           {currentStatus === 'cancelled' && (
            <p className="text-red-600">This order has been cancelled.</p>
          )}
        </div>

        {/* Progress Bar */}
        {currentStatus !== 'cancelled' && (
          <div>
            <Progress value={currentStatusDetail.progress} className="w-full h-3" />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Confirmed</span>
              <span>Preparing</span>
              <span>Out for Delivery</span>
              <span>Delivered</span>
            </div>
          </div>
        )}

        {/* Driver Info (if applicable) */}
        {currentStatus === 'out_for_delivery' && driverInfo && (
          <Card className="bg-muted/50">
            <CardContent className="p-4 flex items-center gap-3">
              <Avatar>
                <AvatarImage src={driverInfo.avatarUrl || '/placeholder.svg'} alt={driverInfo.name} />
                <AvatarFallback>{driverInfo.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{driverInfo.name} is on the way!</p>
                {driverInfo.vehicle && <p className="text-sm text-muted-foreground">{driverInfo.vehicle}</p>}
              </div>
              {/* Placeholder for map or call button */}
            </CardContent>
          </Card>
        )}

        {/* Placeholder for status history / map */}
        {/* <div className="text-center text-muted-foreground">
          [Map/Detailed Status Updates Placeholder]
        </div> */}
      </CardContent>
    </Card>
  );
};

export default LiveOrderTracker;