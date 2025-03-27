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

interface BookingFormData {
  tripType: "one-way" | "round-trip"
  from: string
  to: string
  departingDate: Date | undefined
  returningDate: Date | undefined
  departureTime: string
  returnTime: string
  passengers: number
}

interface BookingFormProps {
  className?: string
  onSubmit?: (data: BookingFormData) => void
}

export function BookingForm({ className, onSubmit }: BookingFormProps) {
  const [formData, setFormData] = React.useState<BookingFormData>({
    tripType: "one-way",
    from: "",
    to: "",
    departingDate: undefined,
    returningDate: undefined,
    departureTime: "5:30 AM",
    returnTime: "5:30 AM",
    passengers: 2,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.(formData)
  }

  const inputStyles = "w-full sm:w-[196px] h-[40px] gap-4 border border-input px-3 py-2 rounded-md"
  const selectWrapperStyles = "relative after:content-[''] after:pointer-events-none after:absolute after:right-8 after:top-[50%] after:-translate-y-[50%] after:border-[4px] after:border-transparent after:border-t-[#71717A] after:mt-[2px]"

  const renderLabel = (text: string, required?: boolean) => (
    <Label className="font-medium text-sm leading-5 tracking-[0%] text-[#414651]">
      {text}
      {required && <span className="text-[#F6B600]">*</span>}
    </Label>
  );

  return (
    <div className="w-full sm:w-[518px] h-auto sm:h-[510px] border rounded-[20px] border-gray-200">
      <form onSubmit={handleSubmit} className={cn("h-full flex flex-col justify-between px-4 sm:px-8 py-6 sm:py-9", className)}>
        <div className="space-y-4">
          <RadioGroup
            defaultValue={formData.tripType}
            onValueChange={(value) => setFormData({ ...formData, tripType: value as "one-way" | "round-trip" })}
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

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              {renderLabel("From", true)}
              <div className={selectWrapperStyles}>
                <select
                  value={formData.from}
                  onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                  className={cn(inputStyles, "bg-background appearance-none text-sm")}
                >
                  <option value="">Select location</option>
                  <option value="Convoy (H Mart)">Convoy (H Mart)</option>
                </select>
              </div>
            </div>
            <div className="grid gap-2">
              {renderLabel("To", true)}
              <div className={selectWrapperStyles}>
                <select
                  value={formData.to}
                  onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                  className={cn(inputStyles, "bg-background appearance-none text-sm")}
                >
                  <option value="">Select location</option>
                  <option value="LAX">LAX</option>
                </select>
              </div>
            </div>
          </div>

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
                      !formData.departingDate && "text-muted-foreground"
                    )}
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
                      !formData.returningDate && "text-muted-foreground"
                    )}
                    disabled={formData.tripType === "one-way"}
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
                  className={cn(inputStyles, "bg-background appearance-none text-sm")}
                >
                  <option value="5:30 AM">5:30 AM</option>
                </select>
              </div>
            </div>
            <div className="grid gap-2">
              {renderLabel("Return Pick Up Time", true)}
              <div className={selectWrapperStyles}>
                <select
                  value={formData.returnTime}
                  onChange={(e) => setFormData({ ...formData, returnTime: e.target.value })}
                  className={cn(inputStyles, "bg-background appearance-none text-sm")}
                  disabled={formData.tripType === "one-way"}
                >
                  <option value="5:30 AM">5:30 AM</option>
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
              <span className="text-lg font-semibold">Price: 45 USD</span>
            </div>
          </div>
        </div>

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