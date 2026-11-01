import { createFileRoute } from "@tanstack/react-router";
import { LessonPlayer } from "@/components/lesson-player";
import { findLesson } from "@/lib/curriculum";

export const Route = createFileRoute("/lesson/$lessonId")({
  head: ({ params }) => {
    const found = findLesson(params.lessonId);
    return { meta: [{ title: found ? `Banjoür — ${found.lesson.title}` : "Banjoür — Lesson" }] };
  },
  component: LessonRoute,
});

function LessonRoute() {
  const { lessonId } = Route.useParams();
  return <LessonPlayer key={lessonId} lessonId={lessonId} />;
}
