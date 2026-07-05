// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface JsonLdProps { data: Record<string, any>; }

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
