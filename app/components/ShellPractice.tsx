import { FC, useRef, useState } from "react";

interface ShellPracticeProps {
  // Record of <instruction, correctCommand>
  commands: Record<string, string>;
}

// This component will be used to practice shell commands.
// It will display an instruction and an input field to type the command.
// It will also display a button to check if the command is correct.
// It will display a message if the command is correct or not.
// It will display a button to go to the next instruction.
// Once all instructions are completed, it will display a "completed message"
export const ShellPractice: FC<ShellPracticeProps> = (props) => {
  const [lines, setLines] = useState<string[]>([]);
  const [instructionIndex, setInstructionIndex] = useState(0);
  const instructions = Object.entries(props.commands);
  const [instruction, correctCommand] = instructions[instructionIndex] ?? [];
  const complete = instructionIndex > instructions.length - 1;
  const promptRef = useRef<HTMLInputElement>(null);

  return (
    <div style={{ paddingTop: "1rem" }}>
      {lines.map((line, index) => (
        <div
          key={`${line}-${index}`}
          style={{
            backgroundColor: "black",
            color: "white",
            fontFamily: "monospace",
            padding: "0.5rem",
          }}
        >
          <code key={index}>{line}</code>
        </div>
      ))}

      {complete ? (
        <p>
          🎉 All done! You&apos;re a shell master!{" "}
          <button
            onClick={() => {
              setLines([]);
              setInstructionIndex(0);
              promptRef.current?.focus();
            }}
          >
            🔄 Run again
          </button>
        </p>
      ) : (
        <>
          <form
            autoComplete="off"
            onSubmit={(event) => {
              event.preventDefault();
              const prompt = promptRef.current!;
              const line = String(prompt.value).trim();
              if (line === correctCommand) {
                setInstructionIndex(
                  Math.min(instructions.length, instructionIndex + 1),
                );
                setLines([...lines, `$: ${line}`, ">> ✅ Correct!"]);
              } else {
                setLines([...lines, `$: ${line}`, ">> 🤔 try again"]);
              }
              prompt.value = "";
            }}
          >
            <span
              style={{
                backgroundColor: "black",
                color: "white",
                border: "none",
                fontFamily: "monospace",
                fontSize: "1rem",
                padding: "0.5rem",
                width: "100%",
                display: "flex",
                alignItems: "center",
              }}
            >
              <code>$:&nbsp;</code>
              <input
                ref={promptRef}
                type="text"
                style={{
                  backgroundColor: "black",
                  color: "white",
                  border: "none",
                  fontFamily: "monospace",
                  fontSize: "1rem",
                  width: "100%",
                  outline: "none", // Add this line to remove focus outline
                }}
              />
            </span>
          </form>
          <p>{instruction}</p>
        </>
      )}
    </div>
  );
};
