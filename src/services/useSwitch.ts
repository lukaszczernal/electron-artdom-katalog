import { useState } from "react";

const useSwitch = <T extends boolean>(initialValue: T | boolean = false) => {
  const [state, setState] = useState<T | boolean>(initialValue);

  const setValue = (payload?: T) => setState(payload || true);
  const setOn = () => setState(true);
  const setOff = () => setState(false);

  return {
    state,
    setOn,
    setOff,
    setValue,
  };
};

export default useSwitch;
