import { useRef, useEffect } from 'react';
import { select } from 'd3-selection';
import type { Selection } from 'd3-selection';

/**
 * Custom hook for integrating D3.js with React
 * Handles the interaction between React's virtual DOM and D3's direct DOM manipulation
 *
 * @param renderFn - Function that receives the D3 selection and renders the chart
 * @param dependencies - Array of dependencies that trigger re-render
 * @returns Ref to attach to the SVG element
 */
export function useD3<T extends Element>(
  renderFn: (selection: Selection<T, unknown, null, undefined>) => void,
  dependencies: unknown[]
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (ref.current) {
      const selection = select(ref.current);
      renderFn(selection as Selection<T, unknown, null, undefined>);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return ref;
}

export default useD3;
