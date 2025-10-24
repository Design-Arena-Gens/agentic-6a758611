import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '80s Animation DNA Generator',
  description: 'Transform image prompts with 1980s animation aesthetics',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
