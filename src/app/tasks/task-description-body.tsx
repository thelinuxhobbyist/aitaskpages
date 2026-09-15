import { parseTaskRichText } from "@/lib/task-description";
import { cn } from "@/lib/utils";

export function TaskDescriptionBody({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const blocks = parseTaskRichText(text);
  if (blocks.length === 0) return null;

  return (
    <div
      className={cn(
        "text-[1.125rem] leading-[1.8] text-on-surface/90 md:text-[1.1875rem] md:leading-[1.85]",
        className
      )}
    >
      {blocks.map((block, index) => {
        if (block.type === "subhead") {
          return (
            <h3
              key={`subhead-${index}`}
              className="mt-9 font-heading text-lg font-semibold tracking-tight text-secondary first:mt-0 md:mt-11 md:text-xl"
            >
              {block.text}
            </h3>
          );
        }

        if (block.type === "list") {
          const List = block.ordered ? "ol" : "ul";
          return (
            <List
              key={`list-${index}`}
              className={cn(
                "mt-4 space-y-2.5 pl-5 first:mt-0 md:mt-5 md:space-y-3",
                block.ordered ? "list-decimal" : "list-disc"
              )}
            >
              {block.items.map((item, itemIndex) => (
                <li key={`${itemIndex}-${item.slice(0, 24)}`} className="pl-1.5">
                  {item}
                </li>
              ))}
            </List>
          );
        }

        return (
          <p
            key={`p-${index}`}
            className="mt-5 whitespace-pre-wrap first:mt-0 md:mt-6"
          >
            {block.text}
          </p>
        );
      })}
    </div>
  );
}
