import { useEffect } from "react";

export const ClaimForm = ({}: {}) => {
  useEffect(() => {
    console.log("claim form rendered");
  }, []);
  return <div>This is the claim form!</div>;
};
