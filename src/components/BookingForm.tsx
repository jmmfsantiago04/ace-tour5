"use client"

import * as React from "react"
import { format } from "date-fns"
import { ChevronDown } from "lucide-react"
import { Calendar } from "./ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { Label } from "./ui/label"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"
import { loadStripe } from '@stripe/stripe-js';
import { getBookingCountForRoute } from '@/app/actions/booking';

interface BookingFormData {
  tripType: "one-way" | "round-trip"
  from: string
  to: string
  departingDate: Date | undefined
  returningDate: Date | undefined
  departureTime: string
  returnTime: string
  passengers: number
  address: string
}

interface BookingFormProps {
  className?: string
  onSubmit?: (data: BookingFormData) => void
}

// Define the structure for destination prices
interface DestinationPrices {
  [destination: string]: number;
}

// Define the structure for the complete pricing map
interface PricingMap {
  [origin: string]: DestinationPrices;
}

// Pricing data structure based on the image
const PRICING_MAP: PricingMap = {
  "Convoy (H Mart)": {
    "Irvine (H Mart)": 40,
    "LAX (Terminal 3 \"Shared Rides\")": 59
  },
  "Mira Mesa (H Mart)": {
    "Irvine (H Mart)": 40,
    "LAX (Terminal 3 \"Shared Rides\")": 59
  },
  "Carmel Valley (Pavillions)": {
    "Irvine (H Mart)": 40,
    "LAX (Terminal 3 \"Shared Rides\")": 59
  },
  "Irvine (H Mart)": {
    "LAX (Terminal 3 \"Shared Rides\")": 35
  },
  "LAX (Terminal 3 \"Shared Rides\")": {
    "Irvine (H Mart)": 35,
    "Carmel Valley (Pavillions)": 59,
    "Mira Mesa (H Mart)": 59,
    "Convoy (H Mart)": 59
  },
  "LA Downtown (Door to Door)": {
    "Las Vegas (Strip Hotel)": 89
  },
  "LA Koreatown (Door to Door)": {
    "Las Vegas (Strip Hotel)": 89
  },
  "Las Vegas (Strip Hotel)": {
    "LA Downtown (Door to Door)": 89,
    "LA Koreatown (Door to Door)": 89
  }
}

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export function BookingForm({ className, onSubmit }: BookingFormProps) {
  const [formData, setFormData] = React.useState<BookingFormData>({
    tripType: "one-way",
    from: "",
    to: "",
    departingDate: undefined,
    returningDate: undefined,
    departureTime: "5:30 AM",
    returnTime: "5:30 AM",
    passengers: 1,
    address: "",
  })
  
  const [selectedRoute, setSelectedRoute] = React.useState("")
  const [availabilityInfo, setAvailabilityInfo] = React.useState<{
    departing?: { count: number; remainingSpots: number; maxSpots: number };
    returning?: { count: number; remainingSpots: number; maxSpots: number };
  }>({})

  // Add a function to check availability when date changes
  const checkAvailability = React.useCallback(async () => {
    if (!formData.from || !formData.to || !formData.departingDate) return;

    try {
      const departingResult = await getBookingCountForRoute(
        formData.from,
        formData.to,
        formData.departingDate
      );

      if (departingResult.success) {
        setAvailabilityInfo(prev => ({
          ...prev,
          departing: {
            count: departingResult.count,
            remainingSpots: departingResult.remainingSpots,
            maxSpots: departingResult.maxSpots
          }
        }));
      }

      if (formData.tripType === 'round-trip' && formData.returningDate) {
        const returningResult = await getBookingCountForRoute(
          formData.to,
          formData.from,
          formData.returningDate
        );

        if (returningResult.success) {
          setAvailabilityInfo(prev => ({
            ...prev,
            returning: {
              count: returningResult.count,
              remainingSpots: returningResult.remainingSpots,
              maxSpots: returningResult.maxSpots
            }
          }));
        }
      } else {
        // Clear returning info if not a round trip
        setAvailabilityInfo(prev => ({
          ...prev,
          returning: undefined
        }));
      }
    } catch (error) {
      console.error('Failed to check availability:', error);
    }
  }, [formData.from, formData.to, formData.departingDate, formData.returningDate, formData.tripType]);

  // Call checkAvailability when relevant form fields change
  React.useEffect(() => {
    checkAvailability();
  }, [formData.from, formData.to, formData.departingDate, formData.returningDate, checkAvailability]);

  // Calculate the current price based on selected locations
  const calculatePrice = React.useCallback(() => {
    if (!formData.from || !formData.to) return 0;
    
    let basePrice = 0;
    
    // Special case for San Diego to LAX route
    if (selectedRoute === "San Diego to LAX") {
      // If destination is LAX, use the normal LAX price
      if (formData.to === "LAX (Terminal 3 \"Shared Rides\")") {
        basePrice = formData.tripType === "round-trip" ? 
          ((59 * 2) * 0.85) : // 15% discount for round trip
          59;
      } else {
        // For all other destinations, use Irvine's price
        basePrice = formData.tripType === "round-trip" ? 
          ((40 * 2) * 0.85) : // 15% discount for round trip
          40;
      }
    } else {
      // Normal pricing logic for other routes
      const originPrices = PRICING_MAP[formData.from];
      if (!originPrices) return 0;

      const oneWayPrice = originPrices[formData.to] || 0;
      
      if (formData.tripType === "round-trip") {
        // For round trip, calculate return journey price
        const returnPrices = PRICING_MAP[formData.to];
        const returnPrice = returnPrices?.[formData.from] || oneWayPrice; // Use same price if return not found
        
        // Calculate total price with 15% discount
        const totalBeforeDiscount = oneWayPrice + returnPrice;
        basePrice = totalBeforeDiscount * 0.85;
      } else {
        basePrice = oneWayPrice;
      }
    }

    // Multiply by number of passengers
    return (basePrice * formData.passengers).toFixed(2);
  }, [formData.from, formData.to, formData.tripType, formData.passengers, selectedRoute]);

  // Define location groups
  const LOCATION_GROUPS = {
    "san_diego": [
      "Convoy (H Mart)",
      "Mira Mesa (H Mart)",
      "Carmel Valley (Pavillions)",
      "Irvine (H Mart)"
    ],
    "lax": ["LAX (Terminal 3 \"Shared Rides\")"],
    "la": ["LA Downtown (Door to Door)", "LA Koreatown (Door to Door)"],
    "vegas": ["Las Vegas (Strip Hotel)"]
  };

  // Get filtered locations based on selected route type
  const getFilteredLocations = React.useCallback(() => {
    // If LAX to SD route is selected
    if (selectedRoute === "LAX to San Diego") {
      return [
        "LAX (Terminal 3 \"Shared Rides\")",
        "Irvine (H Mart)",
        "Carmel Valley (Pavillions)",
        "Mira Mesa (H Mart)"
      ];
    }
    // If SD-LA route is selected
    if (selectedRoute === "San Diego to LAX" || selectedRoute === "") {
      return LOCATION_GROUPS.san_diego;
    }
    // If Vegas route is selected
    if (selectedRoute === "Los Angeles to Las Vegas") {
      return LOCATION_GROUPS.la;
    }
    if (selectedRoute === "Las Vegas to Los Angeles") {
      return LOCATION_GROUPS.vegas;
    }
    // Otherwise show all locations
    return Object.keys(PRICING_MAP);
  }, [selectedRoute]);

  // Get available destinations based on selected origin
  const getAvailableDestinations = React.useCallback(() => {
    if (!formData.from) return [];

    // Special handling for LAX to San Diego route
    if (selectedRoute === "LAX to San Diego") {
      const locations = [
        "LAX (Terminal 3 \"Shared Rides\")",
        "Irvine (H Mart)",
        "Carmel Valley (Pavillions)",
        "Mira Mesa (H Mart)",
        "Convoy (H Mart)"
      ];
      const currentIndex = locations.indexOf(formData.from);
      if (currentIndex >= 0) {
        // Return all locations that come after the current one
        return locations.slice(currentIndex + 1);
      }
      return [];
    }

    // If it's a San Diego location
    if (LOCATION_GROUPS.san_diego.includes(formData.from)) {
      const currentIndex = LOCATION_GROUPS.san_diego.indexOf(formData.from);
      
      // Show only locations that come after the current one in the sequence
      return [
        ...LOCATION_GROUPS.san_diego.slice(currentIndex + 1),
        ...LOCATION_GROUPS.lax
      ];
    }

    // For Vegas routes
    if (LOCATION_GROUPS.la.includes(formData.from)) {
      return LOCATION_GROUPS.vegas;
    }
    if (LOCATION_GROUPS.vegas.includes(formData.from)) {
      return LOCATION_GROUPS.la;
    }

    // Return only the valid destinations from the pricing map
    const originPrices = PRICING_MAP[formData.from];
    if (!originPrices) return [];
    return Object.keys(originPrices);
  }, [formData.from, selectedRoute]);

  // Helper function to check if address is required
  const isAddressRequired = React.useCallback(() => {
    return formData.from.includes("Door to Door") || formData.to.includes("Door to Door")
  }, [formData.from, formData.to])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('🔍 [BookingForm] Starting form submission with data:', {
      ...formData,
      price: calculatePrice()
    });

    // Validate address if required
    if (isAddressRequired() && !formData.address.trim()) {
      console.warn('🚫 [BookingForm] Address validation failed');
      alert("Please enter your complete street address for door-to-door service.")
      return
    }

    try {
      // Check booking count for the selected route and date
      const bookingCountResult = await getBookingCountForRoute(
        formData.from,
        formData.to,
        formData.departingDate!
      );

      if (!bookingCountResult.success) {
        console.error('❌ [BookingForm] Failed to check booking count');
        alert('Unable to process your booking at this time. Please try again later.');
        return;
      }

      if (bookingCountResult.count >= 30) {
        console.warn('🚫 [BookingForm] Route is fully booked');
        alert('We apologize, but this route is fully booked for the selected date. Please choose a different date or route.');
        return;
      }

      // If round trip, check return date booking count as well
      if (formData.tripType === 'round-trip' && formData.returningDate) {
        const returnBookingCountResult = await getBookingCountForRoute(
          formData.to,
          formData.from,
          formData.returningDate
        );

        if (!returnBookingCountResult.success) {
          console.error('❌ [BookingForm] Failed to check return booking count');
          alert('Unable to process your booking at this time. Please try again later.');
          return;
        }

        if (returnBookingCountResult.count >= 30) {
          console.warn('🚫 [BookingForm] Return route is fully booked');
          alert('We apologize, but the return route is fully booked for the selected date. Please choose a different return date.');
          return;
        }
      }

      // Get the current locale from the URL
      const locale = window.location.pathname.split('/')[1] || 'en';
      console.log('📍 [BookingForm] Detected locale:', locale);
      
      // Create Stripe Checkout Session
      console.log('🔄 [BookingForm] Sending request to create checkout session...');
      const response = await fetch(`/${locale}/api/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: calculatePrice(),
          returnUrl: `/${locale}/shuttle-service`,
        }),
      });

      if (!response.ok) {
        console.error('❌ [BookingForm] Checkout session creation failed:', {
          status: response.status,
          statusText: response.statusText
        });
        throw new Error('Network response was not ok');
      }

      const { url, sessionId } = await response.json();
      console.log('✅ [BookingForm] Checkout session created successfully:', { sessionId });

      if (!url) {
        console.error('❌ [BookingForm] No checkout URL received');
        throw new Error('No checkout URL received');
      }

      console.log('➡️ [BookingForm] Redirecting to Stripe checkout:', url);
      window.location.href = url;

      onSubmit?.(formData)
    } catch (error) {
      console.error('❌ [BookingForm] Error during form submission:', error);
      alert('Something went wrong. Please try again.');
    }
  }

  const inputStyles = "w-full sm:w-[196px] h-[40px] gap-4 border border-input px-3 py-2 rounded-md"
  const selectWrapperStyles = "relative after:content-[''] after:pointer-events-none after:absolute after:right-8 after:top-[50%] after:-translate-y-[50%] after:border-[4px] after:border-transparent after:border-t-[#71717A] after:mt-[2px]"

  const renderLabel = (text: string, required?: boolean) => (
    <Label className="font-medium text-sm leading-5 tracking-[0%] text-[#414651]">
      {text}
      {required && <span className="text-[#F6B600]">*</span>}
    </Label>
  );

  // Get available departure times based on location
  const getAvailableDepartureTimes = React.useCallback(() => {
    // For LAX to San Diego route
    if (selectedRoute === "LAX to San Diego") {
      switch (formData.from) {
        case "LAX (Terminal 3 \"Shared Rides\")":
          return [
            { value: "11:15 AM", label: "11:15 AM" },
            { value: "5:30 PM", label: "5:30 PM" }
          ];
        case "Irvine (H Mart)":
          return [
            { value: "12:30 PM", label: "12:30 PM" },
            { value: "7:00 PM", label: "7:00 PM" }
          ];
        case "Carmel Valley (Pavillions)":
          return [
            { value: "1:30 PM", label: "1:30 PM" },
            { value: "8:00 PM", label: "8:00 PM" }
          ];
        case "Mira Mesa (H Mart)":
          return [
            { value: "1:45 PM", label: "1:45 PM" },
            { value: "8:15 PM", label: "8:15 PM" }
          ];
      }
    }

    // For San Diego to LAX route
    if (selectedRoute === "San Diego to LAX") {
      switch (formData.from) {
        case "Convoy (H Mart)":
          return [
            { value: "5:30 AM", label: "5:30 AM" },
            { value: "4:30 PM", label: "4:30 PM" }
          ];
        case "Mira Mesa (H Mart)":
          return [
            { value: "5:50 AM", label: "5:50 AM" },
            { value: "4:50 PM", label: "4:50 PM" }
          ];
        case "Carmel Valley (Pavillions)":
          return [
            { value: "6:10 AM", label: "6:10 AM" },
            { value: "5:20 PM", label: "5:20 PM" }
          ];
        case "Irvine (H Mart)":
          return [
            { value: "7:20 AM", label: "7:20 AM" },
            { value: "6:45 PM", label: "6:45 PM" }
          ];
      }
    }

    // For Los Angeles to Las Vegas route
    if (selectedRoute === "Los Angeles to Las Vegas") {
      switch (formData.from) {
        case "LA Koreatown (Door to Door)":
          return [
            { value: "11:00 AM", label: "11:00 AM" }
          ];
        case "LA Downtown (Door to Door)":
          return [
            { value: "11:15 AM", label: "11:15 AM" }
          ];
      }
    }

    // For Las Vegas to Los Angeles route
    if (selectedRoute === "Las Vegas to Los Angeles") {
      switch (formData.from) {
        case "Las Vegas (Strip Hotel)":
          return [
            { value: "7:30 PM", label: "7:30 PM" }
          ];
      }
    }

    // Default case for other routes
    return [
      { value: "5:30 AM", label: "5:30 AM" }
    ];
  }, [formData.from, selectedRoute]);

  // Get available return times based on location
  const getAvailableReturnTimes = React.useCallback(() => {
    // For LAX to San Diego route
    if (selectedRoute === "LAX to San Diego") {
      switch (formData.from) {
        case "Mira Mesa (H Mart)":
          return [
            { value: "5:50 AM", label: "5:50 AM" },
            { value: "4:50 PM", label: "4:50 PM" }
          ];
        case "Carmel Valley (Pavillions)":
          return [
            { value: "6:10 AM", label: "6:10 AM" },
            { value: "5:20 PM", label: "5:20 PM" }
          ];
        case "Irvine (H Mart)":
          return [
            { value: "7:20 AM", label: "7:20 AM" },
            { value: "6:45 PM", label: "6:45 PM" }
          ];
        case "LAX (Terminal 3 \"Shared Rides\")":
          return [
            { value: "8:20 AM", label: "8:20 AM" },
            { value: "8:20 PM", label: "8:20 PM" }
          ];
      }
    }

    // For San Diego to LAX route
    if (selectedRoute === "San Diego to LAX") {
      switch (formData.from) {
        case "Irvine (H Mart)":
          return [
            { value: "12:30 PM", label: "12:30 PM" },
            { value: "7:00 PM", label: "7:00 PM" }
          ];
        case "Carmel Valley (Pavillions)":
          return [
            { value: "1:30 PM", label: "1:30 PM" },
            { value: "8:00 PM", label: "8:00 PM" }
          ];
        case "Mira Mesa (H Mart)":
          return [
            { value: "1:45 PM", label: "1:45 PM" },
            { value: "8:15 PM", label: "8:15 PM" }
          ];
        case "Convoy (H Mart)":
          return [
            { value: "2:00 PM", label: "2:00 PM" },
            { value: "8:30 PM", label: "8:30 PM" }
          ];
      }
    }

    // For Los Angeles to Las Vegas route
    if (selectedRoute === "Los Angeles to Las Vegas") {
      switch (formData.from) {
        case "LA Koreatown (Door to Door)":
          return [
            { value: "12:30 AM", label: "12:30 AM" }
          ];
        case "LA Downtown (Door to Door)":
          return [
            { value: "12:00 AM", label: "12:00 AM" }
          ];
      }
    }

    // For Las Vegas to Los Angeles route
    if (selectedRoute === "Las Vegas to Los Angeles") {
      switch (formData.from) {
        case "Las Vegas (Strip Hotel)":
          return [
            { value: "4:30 PM", label: "4:30 PM" }
          ];
      }
    }

    // Default case for other routes
    return [
      { value: "5:30 AM", label: "5:30 AM" }
    ];
  }, [formData.from, selectedRoute]);

  // Define preset routes
  const PRESET_ROUTES = {
    "": { from: "", to: "" },
    "San Diego to LAX": { from: "Convoy (H Mart)", to: "LAX (Terminal 3 \"Shared Rides\")" },
    "LAX to San Diego": { from: "LAX (Terminal 3 \"Shared Rides\")", to: "Convoy (H Mart)" },
    "Los Angeles to Las Vegas": { from: "LA Downtown (Door to Door)", to: "Las Vegas (Strip Hotel)" },
    "Las Vegas to Los Angeles": { from: "Las Vegas (Strip Hotel)", to: "LA Downtown (Door to Door)" }
  };

  return (
    <div className="w-full sm:w-[518px] min-h-[510px] h-fit border rounded-[20px] border-gray-200">
      <form onSubmit={handleSubmit} className={cn("h-full flex flex-col justify-between px-4 sm:px-8 py-6 sm:py-9", className)}>
        <div className="space-y-4 mb-6">
          <RadioGroup
            defaultValue={formData.tripType}
            onValueChange={(value) => setFormData({ 
              ...formData, 
              tripType: value as "one-way" | "round-trip",
              returningDate: value === "one-way" ? undefined : formData.returningDate // Reset returning date if one-way
            })}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="one-way" id="one-way" />
              <Label htmlFor="one-way" className="font-medium text-sm leading-5 tracking-[0%] text-[#414651]">One Way</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="round-trip" id="round-trip" />
              <Label htmlFor="round-trip" className="font-medium text-sm leading-5 tracking-[0%] text-[#414651]">Round Trip</Label>
            </div>
          </RadioGroup>

          <div className="grid gap-2">
            {renderLabel("Our Routes", true)}
            <div className={selectWrapperStyles}>
              <select
                value={selectedRoute}
                onChange={(e) => {
                  const route = PRESET_ROUTES[e.target.value as keyof typeof PRESET_ROUTES];
                  setSelectedRoute(e.target.value);
                  setFormData({ 
                    ...formData,
                    from: route.from,
                    to: route.to,
                    address: "" // Reset address when changing routes
                  });
                }}
                className={cn(inputStyles, "w-full sm:w-full bg-background appearance-none text-sm")}
              >
                <option value="">Select a route</option>
                <option value="San Diego to LAX">San Diego to LAX</option>
                <option value="LAX to San Diego">LAX to San Diego</option>
                <option value="Los Angeles to Las Vegas">Los Angeles to Las Vegas</option>
                <option value="Las Vegas to Los Angeles">Las Vegas to Los Angeles</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              {renderLabel("From", true)}
              <div className={selectWrapperStyles}>
                <select
                  value={formData.from}
                  onChange={(e) => {
                    const newFrom = e.target.value;
                    setFormData({ 
                      ...formData, 
                      from: newFrom,
                      to: "" // Reset destination when origin changes
                    });
                  }}
                  className={cn(
                    inputStyles, 
                    "bg-background appearance-none text-sm",
                    !selectedRoute && "cursor-not-allowed opacity-50"
                  )}
                  disabled={!selectedRoute}
                >
                  <option value="">Select location</option>
                  {selectedRoute && getFilteredLocations().map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid gap-2">
              {renderLabel("To", true)}
              <div className={selectWrapperStyles}>
                <select
                  value={formData.to}
                  onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                  className={cn(
                    inputStyles, 
                    "bg-background appearance-none text-sm",
                    !formData.from && "cursor-not-allowed opacity-50"
                  )}
                  disabled={!formData.from}
                >
                  <option value="">Select location</option>
                  {formData.from && getAvailableDestinations().map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {isAddressRequired() && (
            <div className="grid gap-2">
              {renderLabel("Street Address", true)}
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Enter your complete street address"
                className={cn(inputStyles, "w-full sm:w-full")}
                required
              />
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              {renderLabel("Departing", true)}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      inputStyles,
                      "justify-start text-left font-normal",
                      !formData.departingDate && "text-muted-foreground",
                      (!formData.from || !formData.to) && "cursor-not-allowed opacity-50"
                    )}
                    disabled={!formData.from || !formData.to}
                  >
                    {formData.departingDate ? (
                      format(formData.departingDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.departingDate}
                    onSelect={(date) => setFormData({ ...formData, departingDate: date })}
                    initialFocus
                    disabled={!formData.from || !formData.to}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid gap-2">
              {renderLabel("Returning", true)}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      inputStyles,
                      "justify-start text-left font-normal",
                      !formData.returningDate && "text-muted-foreground",
                      (formData.tripType === "one-way" || !formData.departingDate) && "cursor-not-allowed opacity-50"
                    )}
                    disabled={formData.tripType === "one-way" || !formData.departingDate}
                  >
                    {formData.returningDate ? (
                      format(formData.returningDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.returningDate}
                    onSelect={(date) => setFormData({ ...formData, returningDate: date })}
                    initialFocus
                    disabled={formData.tripType === "one-way" || !formData.departingDate}
                    fromDate={formData.departingDate}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              {renderLabel("Departure Pick Up Time", true)}
              <div className={selectWrapperStyles}>
                <select
                  value={formData.departureTime}
                  onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
                  className={cn(
                    inputStyles, 
                    "bg-background appearance-none text-sm",
                    !formData.departingDate && "cursor-not-allowed opacity-50"
                  )}
                  disabled={!formData.departingDate}
                >
                  {getAvailableDepartureTimes().map((time) => (
                    <option key={time.value} value={time.value}>
                      {time.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid gap-2">
              {renderLabel("Return Pick Up Time", true)}
              <div className={selectWrapperStyles}>
                <select
                  value={formData.returnTime}
                  onChange={(e) => setFormData({ ...formData, returnTime: e.target.value })}
                  className={cn(
                    inputStyles, 
                    "bg-background appearance-none text-sm",
                    (!formData.returningDate || formData.tripType === "one-way") && "cursor-not-allowed opacity-50"
                  )}
                  disabled={!formData.returningDate || formData.tripType === "one-way"}
                >
                  {getAvailableReturnTimes().map((time) => (
                    <option key={time.value} value={time.value}>
                      {time.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              {renderLabel("Passengers")}
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-9 h-9 text-[16px] p-2 px-1 rounded-md border"
                  onClick={() => setFormData({ ...formData, passengers: Math.max(1, formData.passengers - 1) })}
                >
                  -
                </Button>
                <span className="w-8 text-center">{formData.passengers}</span>
                <Button
                  type="button"
                  variant="outline"
                  className="w-9 h-9 text-[16px] p-2 px-1 rounded-md border"
                  onClick={() => setFormData({ ...formData, passengers: Math.min(10, formData.passengers + 1) })}
                >
                  +
                </Button>
              </div>
            </div>
            <div className="flex items-end">
              <span className="text-lg font-semibold">Price: {calculatePrice()} USD</span>
            </div>
          </div>
        </div>

        {/* Add availability display after the dates section */}
        {(availabilityInfo.departing || availabilityInfo.returning) && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium mb-2">Route Availability:</h3>
            {availabilityInfo.departing && (
              <div className="mb-2">
                <p className="text-sm">
                  Departing: {availabilityInfo.departing.remainingSpots} spots available
                  <span className="text-gray-500 ml-2">
                    ({availabilityInfo.departing.count}/{availabilityInfo.departing.maxSpots} booked)
                  </span>
                </p>
                <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all",
                      availabilityInfo.departing.remainingSpots <= 5 ? "bg-red-500" :
                      availabilityInfo.departing.remainingSpots <= 10 ? "bg-yellow-500" :
                      "bg-green-500"
                    )}
                    style={{ 
                      width: `${(availabilityInfo.departing.count / availabilityInfo.departing.maxSpots) * 100}%` 
                    }}
                  />
                </div>
              </div>
            )}
            {availabilityInfo.returning && (
              <div>
                <p className="text-sm">
                  Returning: {availabilityInfo.returning.remainingSpots} spots available
                  <span className="text-gray-500 ml-2">
                    ({availabilityInfo.returning.count}/{availabilityInfo.returning.maxSpots} booked)
                  </span>
                </p>
                <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all",
                      availabilityInfo.returning.remainingSpots <= 5 ? "bg-red-500" :
                      availabilityInfo.returning.remainingSpots <= 10 ? "bg-yellow-500" :
                      "bg-green-500"
                    )}
                    style={{ 
                      width: `${(availabilityInfo.returning.count / availabilityInfo.returning.maxSpots) * 100}%` 
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        <Button 
          type="submit" 
          className="group inline-flex w-full h-[48px] items-center justify-between rounded-[8px] bg-[#1976D2] py-[8px] pl-[20px] pr-[4px] text-white transition-all hover:bg-[#1565C0]"
        >
          <span className="text-base font-medium leading-6 tracking-[0]">
            Book Now
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
            <svg
              className="h-5 w-5 transform text-[#1976D2] transition-transform duration-200 group-hover:translate-x-1"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.83331 14.1667L14.1666 5.83334M14.1666 5.83334H6.66665M14.1666 5.83334V13.3333"
                stroke="currentColor"
                strokeWidth="1.67"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </Button>
      </form>
    </div>
  )
} 