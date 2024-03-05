import { FC, useCallback, useState } from "react";
import { ReactTerminal, TerminalContextProvider } from "react-terminal";

interface Node {
  name: string;
  parent: Directory | null;
}

interface File extends Node {
  type: "file";
}

interface Directory extends Node {
  type: "directory";
  children: Array<File | Directory>;
}

function linkChildrenToParents(root: Directory) {
  root.children.forEach((child) => {
    child.parent = root;
    if (child.type === "directory") {
      linkChildrenToParents(child);
    }
  });
}

function createAbsolutePath(node: Node): string {
  if (!node.parent) {
    return `/${node.name}`;
  }
  return `${createAbsolutePath(node.parent)}/${node.name}`;
}

function findDirectoryByPath(root: Directory, path: string): Directory | null {
  if (createAbsolutePath(root) === path) {
    return root;
  }
  for (const child of root.children) {
    if (child.type === "directory") {
      const found = findDirectoryByPath(child, path);
      if (found) {
        return found;
      }
    }
  }
  return null;
}

// This function should resolve the path from the current working directory.
// It should handle the following cases:
// - Absolute paths
// - Relative paths
// - Paths with ".." (parent directory)
// - Paths with "." (current directory)
function resolvePathFromPwd(pwd: Directory, path: string): string | null {
  if (path.startsWith("/")) {
    return path;
  }

  const parts = path.split("/");

  for (const part of parts) {
    if (part === "") {
      continue;
    } else if (part === "..") {
      if (pwd.parent) {
        pwd = pwd.parent;
      } else {
        return null;
      }
    } else if (part === ".") {
      continue;
    } else {
      const found = pwd.children.find((child) => child.name === part);
      if (!found) {
        return null;
      }
      if (found.type === "directory") {
        pwd = found;
      }
    }
  }

  return createAbsolutePath(pwd);
}

export const NavigationPlayground: FC<{
  root: Directory;
  noTerminal: boolean;
  initialPwd?: string;
}> = (props) => {
  const initialPwd = props.initialPwd ?? `/${props.root.name}`;
  linkChildrenToParents(props.root);
  const [pwd, setPwd] = useState<Directory>(
    findDirectoryByPath(props.root, initialPwd) ?? props.root,
  );

  const pwdPath = createAbsolutePath(pwd);

  return (
    <div
      style={{
        background: "#f5f5f5",
        display: "inline-block",
        padding: "0.5rem",
      }}
    >
      <div style={{ height: props.noTerminal === true ? "auto" : "10rem" }}>
        {props.noTerminal === true || (
          <TerminalContextProvider>
            <ReactTerminal
              prompt="$"
              showControlBar={false}
              commands={{
                pwd: () => {
                  return pwdPath;
                },
                ls: (args: string) => {
                  if (args === "") {
                    args = ".";
                  }
                  const resolvedPath = resolvePathFromPwd(pwd, args);
                  if (!resolvedPath) {
                    return `ls: cannot access '${args}': No such file or directory`;
                  }
                  const dir = findDirectoryByPath(props.root, resolvedPath);
                  if (dir) {
                    return dir.children
                      .map((child) =>
                        child.type === "directory"
                          ? `${child.name}/`
                          : child.name,
                      )
                      .join(" ");
                  }
                  return `ls: cannot access '${args}': No such file or directory`;
                },
                cd: (args: string) => {
                  const resolvedPath = resolvePathFromPwd(pwd, args);
                  if (!resolvedPath) {
                    return `cd: no such file or directory: ${args}`;
                  }

                  const dir = findDirectoryByPath(props.root, resolvedPath);
                  if (dir) {
                    setPwd(dir);
                  } else {
                    return `cd: no such file or directory: ${args}`;
                  }
                },
              }}
            />
          </TerminalContextProvider>
        )}
      </div>
      <Directory dir={props.root} pwdPath={pwdPath} />
    </div>
  );
};

export const Directory: FC<{ dir: Directory; pwdPath: string }> = ({
  dir,
  pwdPath,
}) => {
  return (
    <>
      <div>
        <label
          title={createAbsolutePath(dir)}
          style={{
            fontWeight: pwdPath === createAbsolutePath(dir) ? "bold" : "normal",
            backgroundColor: pwdPath === createAbsolutePath(dir) ? "gold" : "",
          }}
        >
          📂 <code>{dir.name}</code>{" "}
          {pwdPath === createAbsolutePath(dir) && "⬅️"}
        </label>
        <ol style={{ padding: 0, margin: 0, listStyle: "none" }}>
          {dir.children.map((node, i) => {
            return (
              <li
                key={`${node.name}-${i}`}
                style={{ paddingLeft: "1rem", display: "flex" }}
              >
                ┗&nbsp;
                {node.type === "file" ? (
                  <File file={node} />
                ) : (
                  <Directory dir={node} pwdPath={pwdPath} />
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </>
  );
};

const File: FC<{ file: File }> = ({ file }) => {
  return (
    <div>
      <label title={createAbsolutePath(file)}>
        📄 <code>{file.name}</code>
      </label>
    </div>
  );
};
