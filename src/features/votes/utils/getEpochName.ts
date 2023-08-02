import { Proposal } from "../hooks/useGroupedProposals";

/** This function ensures that the epoch month is based off the UTC month
 * in which the vote was made. It prevents a starting on 1st Month in the
 * morning in UTC being referred to as the previous month in the far west
 * (e.g. Hawaii).
 */
export function getEpochName(proposal: Proposal) {
  const startAsDate = new Date(proposal.start * 1000);
  // Set the month of the local date to the UTC month
  startAsDate.setMonth(startAsDate.getUTCMonth());
  startAsDate.setFullYear(startAsDate.getUTCFullYear());
  // Return just the month.
  return startAsDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });
}
