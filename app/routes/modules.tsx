import { Link, Outlet, useLocation } from "@remix-run/react";

const modules = import.meta.glob("./modules.*([^page]).mdx", {
  eager: true,
});
const pages = import.meta.glob("./*.page.*.mdx", { eager: true });

const getModulePages = (name: string) => {
  return Object.fromEntries(
    Object.entries(pages).filter(([id]) => id.includes(name)),
  );
};

interface Frontmatter {
  title?: string;
  pageTitle?: React.ReactElement;
  description?: string;
}

const getFrontMatter = (module: unknown): Frontmatter => {
  if (
    module &&
    typeof module === "object" &&
    "frontmatter" in module &&
    typeof module.frontmatter === "object"
  ) {
    return module.frontmatter as Frontmatter;
  }
  return {};
};

const pathToRoute = (path: string) => {
  return path
    .replace(/\.\/(.*)\.mdx/, "/$1")
    .replace(/\./g, "/")
    .replace(/\/_index/, "")
    .replace(/(_\/)/g, "/")
    .replace(/_$/, "");
};

const getModuleFromPath = (path: string) => {
  const modulePart = path.match(/(\/modules\/[^/]+)/)?.[1] || "";
  const moduleKey = Object.keys(modules).find(
    (key) => pathToRoute(key) === modulePart,
  );
  if (moduleKey) {
    return modules[moduleKey];
  }
};

const getPageFromPath = (path: string) => {
  const pageKey = Object.keys(pages).find((key) => pathToRoute(key) === path);
  if (pageKey) {
    return pages[pageKey];
  }
};

const getNextPagePauth = (path: string) => {
  const pageKeys = Object.keys(pages);
  const pageIndex = pageKeys.findIndex((key) => pathToRoute(key) === path);
  return pageKeys[pageIndex + 1];
};

const getPreviousPagePauth = (path: string) => {
  const pageKeys = Object.keys(pages);
  const pageIndex = pageKeys.findIndex((key) => pathToRoute(key) === path);
  return pageKeys[pageIndex - 1];
};

export default function Modules() {
  const location = useLocation();

  const currentPage = getPageFromPath(location.pathname);
  const currentPageMatter = getFrontMatter(currentPage);
  const nextPage = getNextPagePauth(location.pathname);
  const previousPage = getPreviousPagePauth(location.pathname);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "15rem 1fr",
        height: "100vh",
        width: "100vw",
        overflowX: "hidden",
      }}
    >
      <div id="table-of-contents" style={{}}>
        <ol
          style={{
            overflow: "auto",
            height: "100vh",
            position: "fixed",
            top: 0,
            backgroundColor: "#fcc",
            paddingRight: "1rem",
          }}
        >
          {Object.entries(modules).map(([id, module]) => {
            const frontmatter = getFrontMatter(module);
            return (
              <li key={id}>
                <Link to={pathToRoute(id)}>
                  {frontmatter.title ?? "[title missing]"}
                </Link>
                <ol>
                  {Object.entries(
                    getModulePages(id.match(/modules\.([^.])/)?.[1] ?? ""),
                  ).map(([id, module]) => {
                    const frontmatter = getFrontMatter(module);
                    return (
                      <li key={id}>
                        <Link to={pathToRoute(id)}>
                          {frontmatter.title ?? "[title missing]"}
                        </Link>
                      </li>
                    );
                  })}
                </ol>
              </li>
            );
          })}
        </ol>
      </div>
      <div id="page" style={{ paddingRight: "1rem", overflowX: "auto" }}>
        {currentPage?.pageTitle ? (
          <h1>
            <currentPage.pageTitle />
          </h1>
        ) : (
          <h1>{currentPageMatter.title}</h1>
        )}
        <Outlet />
        <nav
          style={{
            marginTop: "1rem",
            marginBottom: "4rem",
            display: "grid",
            gridGap: "1rem",
          }}
        >
          <hr style={{ width: "100%" }} />
          <div>
            {previousPage && (
              <Link to={pathToRoute(previousPage)}>Previous page</Link>
            )}
          </div>
          <div
            style={{
              overflowX: "auto",
            }}
          >
            {nextPage && <Link to={pathToRoute(nextPage)}>Next page</Link>}
          </div>
        </nav>
      </div>
    </div>
  );
}
