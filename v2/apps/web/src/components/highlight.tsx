/** Renders *starred* words of a heading in the gold italic accent, so staff can choose the emphasis in the admin. */
export function Highlight({ text, className = "text-gold italic" }: { text: string; className?: string }) {
  return (
    <>
      {text.split(/(\*[^*]+\*)/g).map((part, index) =>
        part.startsWith("*") && part.endsWith("*") && part.length > 2 ? (
          <em key={index} className={className}>
            {part.slice(1, -1)}
          </em>
        ) : (
          part
        ),
      )}
    </>
  );
}

export const stripStars = (text: string) => text.replace(/\*([^*]+)\*/g, "$1");
