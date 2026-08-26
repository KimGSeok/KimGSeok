export function DocumentationPage({
  children,
  description,
  eyebrow,
  title,
}: Readonly<{
  children: React.ReactNode;
  description: string;
  eyebrow: string;
  title: string;
}>) {
  return (
    <main className="doc-page" id="main-content">
      <header className="doc-page-header">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </header>
      <div className="doc-page-sections">{children}</div>
    </main>
  );
}
