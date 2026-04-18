import { createContext, useCallback, useContext, useEffect, useRef, type ReactNode } from "react";
import { useInput, type Key } from "ink";

type InputHandler = (input: string, key: Key) => boolean | void;

interface SharedInputContextValue {
  register: (handler: InputHandler) => () => void;
}

const SharedInputContext = createContext<SharedInputContextValue>({
  register: () => () => {},
});

export function SharedInputProvider({ children }: { children: ReactNode }) {
  const handlers = useRef<InputHandler[]>([]);

  const register = useCallback((handler: InputHandler): () => void => {
    handlers.current.push(handler);
    return () => {
      const idx = handlers.current.indexOf(handler);
      if (idx >= 0) handlers.current.splice(idx, 1);
    };
  }, []);

  useInput((input, key) => {
    for (let i = handlers.current.length - 1; i >= 0; i--) {
      if (handlers.current[i]!(input, key) === true) break;
    }
  });

  return (
    <SharedInputContext.Provider value={{ register }}>
      {children}
    </SharedInputContext.Provider>
  );
}

export function useSharedInput(handler: InputHandler): void {
  const { register } = useContext(SharedInputContext);
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    return register((input, key) => handlerRef.current(input, key));
  }, [register]);
}
