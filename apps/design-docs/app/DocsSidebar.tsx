import Link from "next/link";
import { docsNavigation } from "./docs-navigation";

export function DocsSidebar() {
  return (
    <aside className="docs-sidebar">
      <nav aria-label="문서 목차">
        <ul className="docs-nav-list">
          {docsNavigation.map((section) => (
            <li
              className={section.children || section.groups ? "docs-nav-section" : undefined}
              key={section.href}
            >
              <Link className="docs-nav-heading" href={section.href}>
                {section.label}
              </Link>
              {section.groups ? (
                <ul className="docs-nav-groups">
                  {section.groups.map((group) => (
                    <li className="docs-nav-group" key={group.label}>
                      <span className="docs-nav-group-heading">{group.label}</span>
                      <ul className="docs-nav-group-items">
                        {group.children.map((item) => (
                          <li key={item.href}>
                            <Link href={item.href}>{item.label}</Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              ) : section.children ? (
                <ul className="docs-nav-children">
                  {section.children.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href}>{item.label}</Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
