export const getGroupNames = (userGroups, groups) => {
  return userGroups
    .map(
      (userGroup) =>
        groups.find((group) => group.id === userGroup.id)?.name || "Unknown"
    )
    .join(", ");
};
