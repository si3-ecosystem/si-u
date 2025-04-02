"use client"
import Image from "next/image"
import Link from "next/link"

interface CourseProgressProps {
    title: string
    progress: number
    avatarUrl: string
}

function CourseProgress({ title, progress, avatarUrl }: CourseProgressProps) {
    return (
        <div className="mb-4 flex items-center gap-3">
            <div className="h-10 w-10 overflow-hidden rounded-full">
                <Image
                    src={avatarUrl || "/placeholder.svg"}
                    alt="Course"
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                />
            </div>
            <div className="flex-1">
                <div className="flex justify-between">
                    <p className="mb-1 text-sm font-medium">{title}</p>
                    <p className="text-sm text-gray-500">{progress}%</p>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                    <div className="h-full rounded-full bg-purple-500" style={{ width: `${progress}%` }} />
                </div>
            </div>
        </div>
    )
}

interface LearningProgressProps {
    courses: CourseProgressProps[]
    onLearnMore?: () => void
}

export function LearningProgress({ courses, onLearnMore }: LearningProgressProps) {
    return (
        <div className="rounded-lg border bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Learning Progress</h3>
                <Link
                    href="#"
                    className="text-sm font-medium text-purple-500 hover:underline"
                    onClick={(e) => {
                        e.preventDefault()
                        onLearnMore?.()
                    }}
                >
                    Learn More
                </Link>
            </div>
            <div>
                {courses.map((course, index) => (
                    <CourseProgress key={index} title={course.title} progress={course.progress} avatarUrl={course.avatarUrl} />
                ))}
            </div>
        </div>
    )
}

