import React from "react";

export const useEffectReady = () => {
  const [enabled, setEnabled] = React.useState(false);

  React.useEffect(() => {
    setEnabled(true);

    return () => {
      setEnabled(false);
    };
  }, []);

  return enabled;
};
