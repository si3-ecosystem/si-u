import { Session } from "@/types/session";

interface SessionCurriculumProps {
  curriculum: Session["curriculum"];
}

export default function SessionCurriculum({
  curriculum,
}: SessionCurriculumProps) {
  return (
    <div className="bg-white">
      <h2 className="text-xl font-medium text-black">Course Curriculum</h2>
      <ul className="mt-6 space-y-4">
        {curriculum?.map((module, index) => (
          <li
            key={index}
            className="flex items-center rounded-lg border border-[#11244033] px-4 py-3"
          >
            <span
              className={`w-6 h-6 rounded-full mr-3 flex items-center justify-center ${
                module.completed
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {module.completed ? "✓" : "○"}
            </span>
            <span className="text-gray-800">{module.moduleTitle}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
