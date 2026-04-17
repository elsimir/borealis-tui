import { useStdout } from "ink";
import { useState, useEffect } from "react";

export function useDimensions() {
  const { stdout } = useStdout();

  const [dimensions, setDimensions] = useState({
    columns: stdout.columns,
    rows: stdout.rows,
  });

  useEffect(() => {
    function onResize() {
      setDimensions({ columns: stdout.columns, rows: stdout.rows });
    }
    stdout.on("resize", onResize);
    return () => {
      stdout.off("resize", onResize);
    };
  }, [stdout]);

  return dimensions;
}
