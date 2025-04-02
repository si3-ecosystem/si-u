import type React from "react"

interface StatsCardProps {
    icon: React.ReactNode
    title: string
    value: string | number
    iconColor?: string
}

export function StatsCard({ icon, title, value, iconColor = "bg-yellow-100" }: StatsCardProps) {
    return (
        <div className="flex flex-1 items-start gap-3 rounded-lg bg-white p-4 shadow-sm">
            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${iconColor}`}>{icon}</div>
            <div className="flex flex-col">
                <p className="text-sm text-gray-500">{title}</p>
                <p className="text-2xl font-bold">{value}</p>
            </div>
        </div>
    )
}

export function StatsCardGrid({ children }: { children: React.ReactNode }) {
    return <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">{children}</div>
}

