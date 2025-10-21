"use client"

import {Button} from "@/components/ui/button"

export function QuickActions() {
  return (
    <div className='rounded-lg border bg-card p-4 sm:p-6'>
      <h3 className='mb-3 text-base font-semibold sm:mb-4 sm:text-lg'>
        Quick Actions
      </h3>
      <div className='space-y-2 sm:space-y-3'>
        <Button
          className='h-11 w-full justify-start text-sm sm:h-10 sm:text-base'
          onClick={() => console.log("Create user")}
        >
          Create New User
        </Button>
        <Button
          variant='outline'
          className='h-11 w-full justify-start text-sm sm:h-10 sm:text-base'
          onClick={() => console.log("Export data")}
        >
          Export Data
        </Button>
        <Button
          variant='outline'
          className='h-11 w-full justify-start text-sm sm:h-10 sm:text-base'
          onClick={() => console.log("View reports")}
        >
          View Reports
        </Button>
      </div>
    </div>
  )
}
