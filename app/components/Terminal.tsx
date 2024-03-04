import { FC, PropsWithChildren, useState } from "react";
import { useCopyToClipboard } from "./useCopyToClipboard";

export const Terminal: FC<
  PropsWithChildren<{ noCopy?: boolean; fadeOut: number }>
> = (props) => {
  let code = props.children;

  if (typeof code !== "string") {
    throw new Error("The children of a <Terminal> component must be a string.");
  }

  code = code.replace(/^\n+/, "");

  const [copied, setCopied] = useState(false);
  const [errored, setErrored] = useState(false);

  const [, copy] = useCopyToClipboard();

  return (
    <div
      style={{
        backgroundColor: "black",
        color: "white",
        marginTop: "1rem",
        marginLeft: "1rem",
        borderRadius: "0.5rem",
        maxWidth: "100%",

        position: "relative",
        display: "inline-block",
      }}
    >
      {props.noCopy !== true && (
        <button
          style={{
            backgroundColor: "white",
            color: "black",
            padding: ".25rem 1rem",
            borderRadius: "0.5rem",
            cursor: "pointer",
            position: "absolute",
            right: "0",
            top: "0",
            overflow: "visible",
            transform: "translateX(100%)",
          }}
          onClick={() => {
            copy(code)
              .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              })
              .catch(() => {
                setErrored(true);
                setTimeout(() => setErrored(false), 2000);
              });
          }}
        >
          {copied ? "✅" : errored ? "❌" : "📋"}
        </button>
      )}
      <pre
        style={{
          height: props.fadeOut ? `${props.fadeOut}rem` : "auto",
          overflow: props.fadeOut ? "hidden" : "auto",
          position: "relative",
        }}
      >
        <code>{code}</code>
      </pre>
      {props.fadeOut && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "5rem",
            background: `linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 50%)`,
          }}
        ></div>
      )}
    </div>
  );
};
