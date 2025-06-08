import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem } from "@/components/ui/navigation-menu";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Utensils, ChevronLeft, CreditCard, MapPin, ShieldCheck } from 'lucide-react';

const addressSchema = z.object({
  street: z.string().min(5, "Street address is too short"),
  city: z.string().min(2, "City name is too short"),
  zip: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code"),
  country: z.string().min(2, "Country is required"),
});

const paymentSchema = z.object({
  method: z.enum(["card", "paypal", "cod"], { required_error: "Payment method is required." }),
  cardNumber: z.string().optional(),
  expiryDate: z.string().optional(),
  cvv: z.string().optional(),
}).refine(data => {
    if (data.method === "card") {
        return data.cardNumber && data.cardNumber.match(/^\d{16}$/) &&
               data.expiryDate && data.expiryDate.match(/^(0[1-9]|1[0-2])\/\d{2}$/) &&
               data.cvv && data.cvv.match(/^\d{3,4}$/);
    }
    return true;
}, {
    message: "Invalid card details",
    path: ["cardNumber"], // Or a more general path
});


const checkoutSchema = z.object({
  deliveryAddress: addressSchema,
  useSavedAddress: z.boolean().optional(),
  savedAddressId: z.string().optional(),
  payment: paymentSchema,
  agreeToTerms: z.boolean().refine(val => val === true, "You must agree to terms and conditions"),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

// Placeholder data
const savedAddresses = [
  { id: 'addr1', label: 'Home - 123 Main St, Anytown', value: { street: '123 Main St', city: 'Anytown', zip: '12345', country: 'USA'} },
  { id: 'addr2', label: 'Work - 456 Office Ave, Anytown', value: { street: '456 Office Ave', city: 'Anytown', zip: '12345', country: 'USA'} },
];
const orderSummary = { subtotal: 19.49, delivery: 5.00, tax: 1.56, total: 26.05 };


const CheckoutPage = () => {
  const navigate = useNavigate();
  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      deliveryAddress: { street: '', city: '', zip: '', country: 'USA' },
      useSavedAddress: false,
      payment: { method: "card", cardNumber: '', expiryDate: '', cvv: ''},
      agreeToTerms: false,
    },
  });

  console.log('CheckoutPage loaded');

  const onSubmit = (data: CheckoutFormData) => {
    console.log('Checkout Data:', data);
    // Simulate order placement
    navigate('/order-tracking'); // Navigate to order tracking page on success
  };

  const selectedPaymentMethod = form.watch("payment.method");

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
                <ShieldCheck className="h-7 w-7" />
                <span>Secure Checkout</span>
              </a>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Accordion type="single" collapsible defaultValue="delivery" className="w-full">
                <AccordionItem value="delivery">
                  <AccordionTrigger className="text-xl font-semibold"><MapPin className="mr-2 h-6 w-6 inline"/>Delivery Address</AccordionTrigger>
                  <AccordionContent className="pt-4 space-y-4">
                    <FormField
                        control={form.control}
                        name="useSavedAddress"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                    <Checkbox checked={field.value} onCheckedChange={ (checked) => {
                                        field.onChange(checked);
                                        if(checked && savedAddresses.length > 0) {
                                            form.setValue("savedAddressId", savedAddresses[0].id);
                                            form.setValue("deliveryAddress", savedAddresses[0].value);
                                        } else {
                                            form.setValue("savedAddressId", undefined);
                                            form.setValue("deliveryAddress", { street: '', city: '', zip: '', country: 'USA' });
                                        }
                                    }} />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>Use a saved address</FormLabel>
                                </div>
                            </FormItem>
                        )}
                    />
                    {form.getValues("useSavedAddress") && (
                       <FormField
                            control={form.control}
                            name="savedAddressId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Select Address</FormLabel>
                                    <Select onValueChange={(value) => {
                                        field.onChange(value);
                                        const selected = savedAddresses.find(sa => sa.id === value);
                                        if(selected) form.setValue("deliveryAddress", selected.value);
                                    }} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger><SelectValue placeholder="Select a saved address" /></SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {savedAddresses.map(addr => (
                                                <SelectItem key={addr.id} value={addr.id}>{addr.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}
                     {!form.getValues("useSavedAddress") && (
                        <>
                            <FormField control={form.control} name="deliveryAddress.street" render={({ field }) => (
                                <FormItem><FormLabel>Street</FormLabel><FormControl><Input placeholder="123 Main St" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField control={form.control} name="deliveryAddress.city" render={({ field }) => (
                                    <FormItem><FormLabel>City</FormLabel><FormControl><Input placeholder="Anytown" {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                                <FormField control={form.control} name="deliveryAddress.zip" render={({ field }) => (
                                    <FormItem><FormLabel>ZIP Code</FormLabel><FormControl><Input placeholder="12345" {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                            </div>
                             <FormField control={form.control} name="deliveryAddress.country" render={({ field }) => (
                                <FormItem><FormLabel>Country</FormLabel><FormControl><Input placeholder="USA" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                        </>
                     )}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="payment">
                  <AccordionTrigger className="text-xl font-semibold"><CreditCard className="mr-2 h-6 w-6 inline"/>Payment Method</AccordionTrigger>
                  <AccordionContent className="pt-4">
                    <FormField
                      control={form.control}
                      name="payment.method"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormControl>
                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-2">
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl><RadioGroupItem value="card" /></FormControl>
                                <FormLabel className="font-normal">Credit/Debit Card</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl><RadioGroupItem value="paypal" /></FormControl>
                                <FormLabel className="font-normal">PayPal</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl><RadioGroupItem value="cod" /></FormControl>
                                <FormLabel className="font-normal">Cash on Delivery</FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {selectedPaymentMethod === 'card' && (
                      <div className="space-y-4 mt-4 p-4 border rounded-md">
                        <FormField control={form.control} name="payment.cardNumber" render={({ field }) => (
                            <FormItem><FormLabel>Card Number</FormLabel><FormControl><Input placeholder="•••• •••• •••• ••••" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="payment.expiryDate" render={({ field }) => (
                                <FormItem><FormLabel>Expiry (MM/YY)</FormLabel><FormControl><Input placeholder="MM/YY" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name="payment.cvv" render={({ field }) => (
                                <FormItem><FormLabel>CVV</FormLabel><FormControl><Input placeholder="•••" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                        </div>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <aside className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                  <CardDescription>Review your items before placing order.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                   {/* Items could be listed here, simplified for brevity */}
                  <div className="flex justify-between"><span>Subtotal</span><span>${orderSummary.subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Delivery</span><span>${orderSummary.delivery.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Tax</span><span>${orderSummary.tax.toFixed(2)}</span></div>
                  <hr className="my-2"/>
                  <div className="flex justify-between font-bold text-xl"><span>Total</span><span>${orderSummary.total.toFixed(2)}</span></div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                   <FormField
                        control={form.control}
                        name="agreeToTerms"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel className="text-sm">I agree to the <a href="/terms" target="_blank" className="underline text-primary">terms and conditions</a>.</FormLabel>
                                    <FormMessage />
                                </div>
                            </FormItem>
                        )}
                    />
                  <Button type="submit" size="lg" className="w-full">Place Order</Button>
                </CardFooter>
              </Card>
            </aside>
          </form>
        </Form>
      </main>
    </div>
  );
};

export default CheckoutPage;