import { useCallback, useState } from "react";

export function useToggleState<T>(initialValue: T, alternateValue: T) {
  const [state, setState] = useState(initialValue);

  const toggle = useCallback(() => {
    setState((currentState) =>
      currentState === initialValue ? alternateValue : initialValue,
    );
  }, [initialValue, alternateValue]);

  return [state, toggle] as const;
}
