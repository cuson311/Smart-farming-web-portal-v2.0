export const convertTimestamp = (timestamp) => {
  return new Date(timestamp).toISOString().replace("T", " ").slice(0, 19);
};
