import { Color } from "@raycast/api";
import { EquationObj } from "./use-equation";

export const groupByTag = (items: EquationObj[]): Record<string, EquationObj[]> => {
  return items.reduce(
    (acc, item) => {
      const tagName = Object.entries(Color).find(([, value]) => value === item.tag)?.[0] || "Other";

      if (!acc[tagName]) acc[tagName] = [];

      acc[tagName].push(item);

      return acc;
    },
    {} as Record<string, EquationObj[]>,
  );
};
