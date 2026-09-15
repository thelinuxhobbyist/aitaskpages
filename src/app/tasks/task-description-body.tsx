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
    <div className={cn("space-y-4 text-[1.05rem] leading-[1.75] text-on-surface/90", className)}>
      {blocks.map((block, index) => {
        if (block.type === "subhead") {
          return (
            <h3
              key={`subhead-${index}`}
              className="pt-2 font-heading text-base font-semibold tracking-tight text-secondary first:pt-0"
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
                "space-y-2 pl-5 text-[1.05rem] leading-[1.7] text-on-surface/90",
                block.ordered ? "list-decimal" : "list-disc"
              )}
            >
              {block.items.map((item, itemIndex) => (
                <li key={`${itemIndex}-${item.slice(0, 24)}`} className="pl-1">
                  {item}
                </li>
              ))}
            </List>
          );
        }

        return (
          <p
            key={`p-${index}`}
            className="whitespace-pre-wrap"
          >
            {block.text}
          </p>
        );
      })}
    </div>
  );
}
