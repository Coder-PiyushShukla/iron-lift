"use client"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { BookOpen, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { glossaryTerms } from "@/lib/glossary-data"

export default function LearnPage() {
    return (
        <div className="min-h-screen bg-background p-6 flex justify-center">
            <div className="w-full max-w-3xl space-y-8">


                <div className="flex items-center gap-4 mb-8">
                    <Link href="/dashboard">
                        <button className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition">
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <BookOpen className="text-primary" /> Iron Knowledge
                        </h1>
                        <p className="text-gray-400">Master the terminology to master your body.</p>
                    </div>
                </div>


                <div className="bg-black/40 border border-white/10 rounded-xl p-6 backdrop-blur-md">
                    <Accordion type="single" collapsible className="w-full">
                        {glossaryTerms.map((item, index) => (
                            <AccordionItem key={index} value={`item-${index}`} className="border-white/10">
                                <AccordionTrigger className="text-white hover:text-primary hover:no-underline text-lg font-medium">
                                    {item.term}
                                </AccordionTrigger>
                                <AccordionContent className="text-gray-400 text-base leading-relaxed whitespace-pre-line">
                                    {item.definition}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>

            </div>
        </div>
    )
}