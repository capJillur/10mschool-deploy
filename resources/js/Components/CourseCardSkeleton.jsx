export default function CourseCardSkeleton() {
    return (
        <div className="card-surface overflow-hidden" aria-hidden="true">
            <div className="skeleton aspect-video w-full" />
            <div className="space-y-3 p-5">
                <div className="skeleton h-3 w-20 rounded" />
                <div className="skeleton h-4 w-full rounded" />
                <div className="skeleton h-4 w-3/4 rounded" />
                <div className="flex justify-between pt-3">
                    <div className="skeleton h-6 w-20 rounded" />
                    <div className="skeleton h-6 w-14 rounded-full" />
                </div>
            </div>
        </div>
    );
}
