import { cn } from "../utils/cn";

export const SkeletonBrowser: React.FC<{
  children?: React.ReactNode;
  className?: string;
}> = ({ className, children }) => (
  <div
    className={cn(
      "relative h-[400px] w-full rounded-lg border bg-white text-sm text-neutral-950 shadow-lg shadow-gray-200 dots-gray-300 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400 dark:shadow-none dark:dots-neutral-800",
      className,
    )}
  >
    <div
      className={
        "flex w-full items-center justify-between rounded-t-lg border-b border-inherit bg-inherit px-4 py-2"
      }
    >
      <div className={"flex gap-2"}>
        <div
          className={"h-3 w-3 rounded-full bg-neutral-300 dark:bg-neutral-800"}
        />
        <div
          className={"h-3 w-3 rounded-full bg-neutral-300 dark:bg-neutral-800"}
        />
        <div
          className={"h-3 w-3 rounded-full bg-neutral-300 dark:bg-neutral-800"}
        />
      </div>
      <div
        className={
          "min-w-1/3 flex w-fit gap-2 rounded-md border border-inherit px-1.5 py-1 font-sans"
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          strokeWidth="2"
          className={"w-4 max-w-5 stroke-neutral-300 dark:stroke-neutral-700"}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <span className={"flex items-center justify-center text-sm"}>
          yourwebsite.com/admin/sales
        </span>
      </div>
      <div />
    </div>
    <div className={"absolute left-0 top-0 h-full w-full pt-12"}>
      {children}
    </div>
  </div>
);
