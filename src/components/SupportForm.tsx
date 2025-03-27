"use client"

import * as React from "react"
import { useFormStatus } from "react-dom"
import { createSupportInquiry } from "@/app/actions/support"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

function SubmitButton() {
  const { pending } = useFormStatus()
  
  return (
    <Button 
      type="submit" 
      className="relative w-full h-[48px] rounded-[8px] bg-[#3B82F6] text-white text-xl font-medium leading-6 tracking-[0] cursor-pointer z-10 hover:bg-[#2563EB] flex items-center justify-between px-6"
      disabled={pending}
    >
      <span>{pending ? 'Sending...' : 'Send Inquiry'}</span>
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
        <svg
          className="h-5 w-5 transform text-[#3B82F6] transition-transform duration-200 group-hover:translate-x-1"
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
  )
}

export function SupportForm({ className }: { className?: string }) {
  const [state, formAction] = React.useActionState(createSupportInquiry, {
    message: null,
    errors: null,
  })

  React.useEffect(() => {
    if (state?.message) {
      toast.success(state.message)
    }
    if (state?.errors?.form) {
      toast.error(state.errors.form[0])
    }
  }, [state])

  return (
    <div className="relative w-full max-w-[560px] mx-auto px-4 sm:px-6 lg:px-0 h-auto sm:h-[634px] rounded-lg">
      <form action={formAction} className={cn("space-y-6", className)}>
        <div>
          <label htmlFor="inquiryType" className="text-base font-medium leading-6 tracking-[0] text-[#262626]">
            Inquiry Type
          </label>
          <div className="mt-[16px]">
            <select
              id="inquiryType"
              name="inquiryType"
              required
              className="w-full border border-[#E5E7EB] rounded-[22px] px-[16px] py-[24px] bg-white focus:border-transparent placeholder:text-[#D4D4D4] placeholder:text-base placeholder:font-medium placeholder:leading-6 placeholder:tracking-normal"
            >
              <option value="">-Select-</option>
              <option value="TRAVEL_CONSULTATION">Travel Consultation</option>
              <option value="SHUTTLE_SERVICE">Shuttle Service</option>
              <option value="MICE_SERVICE">MICE Service</option>
            </select>
            {state?.errors?.inquiryType && (
              <div className="text-red-500 text-sm mt-1">{state.errors.inquiryType[0]}</div>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="fullName" className="text-base font-medium leading-6 tracking-[0] text-[#262626]">
            Full Name
          </label>
          <div className="mt-[16px]">
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              placeholder="e.g Daisy Daisies"
              className="w-full border border-[#E5E7EB] rounded-[22px] px-[16px] py-[24px] bg-white focus:border-transparent placeholder:text-[#D4D4D4] placeholder:text-base placeholder:font-medium placeholder:leading-6 placeholder:tracking-normal"
            />
            {state?.errors?.fullName && (
              <div className="text-red-500 text-sm mt-1">{state.errors.fullName[0]}</div>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="email" className="text-base font-medium leading-6 tracking-[0] text-[#262626]">
            Email address
          </label>
          <div className="mt-[16px]">
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="e.g Daisy@gmail.com"
              className="w-full border border-[#E5E7EB] rounded-[22px] px-[16px] py-[24px] bg-white focus:border-transparent placeholder:text-[#D4D4D4] placeholder:text-base placeholder:font-medium placeholder:leading-6 placeholder:tracking-normal"
            />
            {state?.errors?.email && (
              <div className="text-red-500 text-sm mt-1">{state.errors.email[0]}</div>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="inquiry" className="text-base font-medium leading-6 tracking-[0] text-[#262626]">
            Your inquiry
          </label>
          <div className="mt-[16px]">
            <textarea
              id="inquiry"
              name="inquiry"
              required
              placeholder="Type your message..."
              className="w-full h-[150px] border border-[#E5E7EB] rounded-[22px] px-4 pt-[15px] pb-8 bg-white focus:border-transparent resize-none placeholder:text-[#D4D4D4] placeholder:text-base placeholder:font-medium placeholder:leading-6 placeholder:tracking-normal"
            />
            {state?.errors?.inquiry && (
              <div className="text-red-500 text-sm mt-1">{state.errors.inquiry[0]}</div>
            )}
          </div>
        </div>

        <SubmitButton />
      </form>
    </div>
  )
} 