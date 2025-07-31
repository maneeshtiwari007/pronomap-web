'use client'
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet";
export function MobileFilterDrawer({ children, isOpenDialog, onClickCallBack }: { children: React.ReactNode, isOpenDialog: boolean, onClickCallBack?: () => void }) {
    const [open, setOpen] = useState(false);
    useEffect(() => {
        console.log('isOpen')
        console.log("did ", isOpenDialog)
        console.log('isOpen did')
        setOpen(isOpenDialog)
    }, [isOpenDialog]);
    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="outline" className="w-full flex items-center justify-center md:hidden">
                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                    Search Property
                </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-2xl">
                <SheetTitle asChild>
                    <VisuallyHidden>Property Filter</VisuallyHidden>
                </SheetTitle>
                {children}
                <SheetClose asChild>
                    <div className="col-span-1 lg:col-span-1">
                        <label className="block text-gray-700 text-sm font-medium mb-1 opacity-0">Search</label>
                        <Button
                            className="w-full bg-accent hover:bg-yellow-600 text-primary font-medium transition-colors"
                            onClick={() => { setOpen(false); onClickCallBack?.() }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="mr-2 h-4 w-4"
                            >
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.3-4.3" />
                            </svg>
                            Search
                        </Button>
                    </div>
                </SheetClose>
            </SheetContent>

        </Sheet>
        // <Dialog open={open} onOpenChange={setOpen}>
        //     <DialogTrigger asChild>
        //         <Button
        //             variant="outline"
        //             className="w-full flex items-center justify-center md:hidden rounded-xl"
        //             onClick={() => { console.log('isOpen'); setOpen(true) }}
        //         >
        //             <SlidersHorizontal className="w-4 h-4 mr-2" />
        //             Filters
        //         </Button>
        //     </DialogTrigger>

        //     <DialogContent
        //         className={clsx(
        //             "translate-y-[-30%] max-w-screen-sm w-full h-screen p-5 pt-6 overflow-y-auto rounded-t-3xl",
        //             (!open) ? 'animate-slide-out-down' : 'animate-slide-in-up'
        //         )}
        //         style={{ height: '80%' }}
        //         aria-description="Test">
        //         <VisuallyHidden>
        //             <DialogTitle>Filters</DialogTitle>
        //         </VisuallyHidden>
        //         {children}
        //     </DialogContent>
        // </Dialog>
    );
}


