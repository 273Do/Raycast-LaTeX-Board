import { environment } from "@raycast/api";
import { BASE_URL } from "../core/constants";

export const useLatex = () => {
  const displayLatexURL = (latex: string): string => {
    const textColor = environment.appearance === "dark" ? "White" : "Black";

    const encodeLatex = encodeURIComponent(`\\color{${textColor}}${latex}`);

    const url = `${BASE_URL}?${encodeLatex}`;

    return url;
  };

  return { displayLatexURL };
};
