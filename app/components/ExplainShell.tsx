import { FC, Fragment, useEffect, useRef, useState } from "react";
import { useResizeObserver } from "usehooks-ts";

const colors = [
  "red",
  "green",
  "blue",
  "orange",
  "purple",
  "pink",
  "cyan",
  "magenta",
  "brown",
  "gray",
  "black",
  "white",
  "silver",
  "gold",
  "teal",
  "lime",
  "aqua",
  "olive",
  "maroon",
  "navy",
  "indigo",
  "slate",
  "turquoise",
  "violet",
  "crimson",
  "sienna",
  "skyblue",
  "darkgreen",
  "lightpink",
];

export const ExplainShell: FC<{
  parts: Record<string, React.ReactElement>;
  fixedFocusIndex?: number;
}> = ({ parts, fixedFocusIndex }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const partsRef = useRef<HTMLDivElement>(null);

  const partCount = Object.keys(parts).length;

  const [lines, setLines] = useState<string[][]>([]);
  const containerSize = useResizeObserver({ ref: containerRef });
  const [_focusIndex, setFocusIndex] = useState(-1);

  const focusIndex = fixedFocusIndex ?? _focusIndex;

  useEffect(() => {
    if (!containerRef.current || !partsRef.current) {
      return;
    }
    const partSpans = partsRef.current.querySelectorAll(".part");
    const descriptions = containerRef.current.querySelectorAll(".description");

    const partLines: string[][] = [];

    const containerRect = containerRef.current.getBoundingClientRect();
    Object.keys(parts).forEach((word, partIndex) => {
      if (parts[word] === null) {
        partLines.push([]);
        return;
      }
      const lines: string[] = [];
      const partSpan = partSpans[partIndex] as HTMLSpanElement;
      const partSpanRect = partSpan.getBoundingClientRect();

      const partSpanCenterX =
        partSpanRect.x + partSpanRect.width / 2 - containerRect.x;

      const partSpanLeft = partSpanRect.x - containerRect.x;
      const partSpanRight =
        partSpanRect.x + partSpanRect.width - containerRect.x;
      const partSpanBottom =
        partSpanRect.y + partSpanRect.height - containerRect.y;

      // This line underlines the part
      const line = `M ${partSpanLeft} ${partSpanBottom} L ${partSpanRight} ${partSpanBottom}`;

      // This line runs down from the center of the part running down to it's
      // clearance lane. The clearance lane is determined by the number of parts.
      // The first part has the longest clearance lane, the last part has the
      // shortest. Clearance lanes are according to a fixed height.
      const clearanceLane = (partCount - partIndex) * 10;
      const inverseClearanceLane = partIndex * 10;
      const step = `M ${partSpanCenterX} ${partSpanBottom} L ${partSpanCenterX} ${
        partSpanBottom + clearanceLane
      }`;

      const sweepRight = `M ${partSpanCenterX} ${
        partSpanBottom + clearanceLane
      } L ${containerRect.width - clearanceLane - 10} ${
        partSpanBottom + clearanceLane
      }`;

      const descriptionRect = descriptions[partIndex].getBoundingClientRect();
      const descriptionCenterY =
        descriptionRect.y + descriptionRect.height / 2 - containerRect.y;

      const plungeDown = `M ${containerRect.width - clearanceLane - 10} ${
        partSpanBottom + clearanceLane
      } L ${containerRect.width - clearanceLane - 10} ${descriptionCenterY}`;

      const jogLeft = `M ${
        containerRect.width - clearanceLane - 10
      } ${descriptionCenterY} L ${
        containerRect.width - clearanceLane - 10 - inverseClearanceLane - 10
      } ${descriptionCenterY}`;

      lines.push(line, step, sweepRight, plungeDown, jogLeft);
      partLines.push(lines);
    });

    setLines(partLines);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    containerSize.width,
    containerSize.height,
    partCount,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ...Object.entries(parts).flat(),
  ]);

  return (
    <div style={{ marginLeft: "2rem", marginTop: "2rem" }}>
      <div
        style={{ position: "relative", maxWidth: "40rem" }}
        ref={containerRef}
      >
        <div
          ref={partsRef}
          style={{
            fontSize: "1.1rem",
            fontFamily: "monospace",
            textAlign: "center",
            position: "relative",
            paddingBottom: partCount * 10 + 15 + "px",
            whiteSpace: "nowrap",
          }}
        >
          {Object.entries(parts).map(([word], index) => {
            const partKey = `part-${index}`;
            return (
              <Fragment key={partKey}>
                <span
                  className="part"
                  style={{
                    padding: 2,
                    borderBottom:
                      parts[word] === null
                        ? "initial"
                        : `1px solid ${colors[index]}`,
                    outline:
                      parts[word] === null
                        ? "initial"
                        : focusIndex === index
                        ? `4px solid ${colors[index]}`
                        : "transparent",
                  }}
                  onMouseEnter={() => {
                    setFocusIndex(index);
                  }}
                  onMouseLeave={() => {
                    setFocusIndex(-1);
                  }}
                >
                  {word}
                </span>
                {` `}
              </Fragment>
            );
          })}
        </div>

        <div style={{ paddingRight: partCount * 10 + 20 + "px" }}>
          {Object.entries(parts).map(([word, explanation], index) => {
            const partKey = `part-${index}`;
            const borderWidth = focusIndex === index ? "2px" : "1px";
            const borderColor = colors[index];
            return (
              <div
                key={partKey}
                className="description"
                style={{
                  padding: ".5rem",
                  outline: `${borderWidth} solid ${borderColor}`,
                  marginBottom: 10,
                  display: parts[word] === null ? "none" : "block",
                  backgroundColor:
                    focusIndex === index ? "rgba(0, 0, 0, 0.1)" : "initial",
                }}
                onMouseEnter={() => {
                  setFocusIndex(index);
                }}
                onMouseLeave={() => {
                  setFocusIndex(-1);
                }}
              >
                {explanation}
              </div>
            );
          })}
        </div>

        <svg
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            top: 0,
            left: 0,
            zIndex: -1,
          }}
        >
          {lines.map((line, svgIndex) => {
            return (
              <Fragment key={svgIndex}>
                {line.map((line, index) => {
                  return (
                    <path
                      onMouseMove={() => {
                        setFocusIndex(svgIndex);
                      }}
                      onMouseLeave={() => {
                        setFocusIndex(-1);
                      }}
                      key={`line-${index}`}
                      stroke={colors[svgIndex]}
                      strokeWidth={focusIndex === svgIndex ? 2 : 1}
                      opacity={focusIndex === svgIndex ? 1 : 0.25}
                      d={line}
                    />
                  );
                })}
              </Fragment>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
