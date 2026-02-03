import { Color, LocalStorage } from "@raycast/api";
import { EquationFormValues } from "../create-equation-metadata";
import { DUPLICATE_SUFFIX } from "../core/constants";

export type ColorKey = Exclude<keyof typeof Color, "Dynamic">;
export type ColorValue = (typeof Color)[ColorKey];

export type EquationObj = {
  id: string;
  title: string;
  latex: string;
  tags: ColorValue[];
  favorite: boolean;
};

/**
 * A hook for managing Equations.
 *
 * @returns
 *   - fetchEquations: Function to fetch the list of equations.
 *   - createEquation: Function to create a new equation.
 *   - duplicateEquation: Function to duplicate an equation by its ID.
 *   - editEquation: Function to edit an equation by its ID.
 *   - favoriteEquation: Function to favorite/unfavorite an equation by its ID.
 *   - deleteEquation: Function to delete an equation by its ID.
 *   - deleteAllEquations: Function to delete all equations.
 */
export const useEquation = () => {
  /**
   * fetch the list of equations from local storage.
   */
  const fetchEquations = async (): Promise<EquationObj[]> => {
    const equations = await LocalStorage.getItem<string>("equations");

    // データが存在しない場合のみ、デモデータで初期化
    if (!equations) {
      await saveEquationsToLocalStorage(demoEquations);
      return [];
    }

    return JSON.parse(equations);
  };

  /**
   * create a new equation and save it to local storage.
   * @param equation - The equation values.
   */
  const createEquation = async (equation: EquationFormValues): Promise<void> => {
    const equations = await fetchEquations();

    const { title, latex, tags } = equation;

    // Generate a random ID
    const newId = Date.now()
      .toString()
      .split("")
      .sort(() => 0.5 - Math.random())
      .join("");

    const newEquation: EquationObj = {
      id: newId,
      title,
      latex,
      tags,
      favorite: false,
    };

    const updatedEquations = [...equations, newEquation];

    await saveEquationsToLocalStorage(updatedEquations);
  };

  /**
   * duplicate an equation by its ID.
   * @param id - The ID of the equation to duplicate.
   */
  const duplicateEquation = async (id: string): Promise<void> => {
    const equations = await fetchEquations();

    const targetEquation = equations.find((eq) => eq.id === id) as EquationObj;

    // Generate a random ID
    const newId = Date.now()
      .toString()
      .split("")
      .sort(() => 0.5 - Math.random())
      .join("");

    const newEquation: EquationObj = {
      ...targetEquation,
      id: newId,
      title: `${targetEquation.title}${DUPLICATE_SUFFIX}`,
      favorite: false,
    };

    const updatedEquations = [...equations, newEquation];

    await saveEquationsToLocalStorage(updatedEquations);
  };

  /**
   * edit an equation by its ID.
   * @param id - The ID of the equation to edit.
   * @param equation - The new equation values.
   */
  const editEquation = async (id: string, equation: EquationFormValues): Promise<void> => {
    const equations = await fetchEquations();

    const targetEquation = equations.find((eq) => eq.id === id) as EquationObj;

    const { title, latex, tags } = equation;

    const newEquation: EquationObj = {
      ...targetEquation,
      title,
      latex,
      tags,
    };

    const updatedEquations = equations.map((eq) => (eq.id === id ? newEquation : eq));

    await saveEquationsToLocalStorage(updatedEquations);
  };

  /**
   * favorite an equation by its ID.
   * @param id - The ID of the equation to favorite.
   */
  const favoriteEquation = async (id: string): Promise<void> => {
    const equations = await fetchEquations();

    const targetEquation = equations.find((eq) => eq.id === id) as EquationObj;

    const newEquation: EquationObj = {
      ...targetEquation,
      favorite: !targetEquation.favorite,
    };

    const updatedEquations = equations.map((eq) => (eq.id === id ? newEquation : eq));

    await saveEquationsToLocalStorage(updatedEquations);
  };

  /**
   * delete an equation by its ID.
   * @param id - The ID of the equation to delete.
   */
  const deleteEquation = async (id: string): Promise<void> => {
    const equations = await fetchEquations();
    const updatedEquations = equations.filter((eq) => eq.id !== id);

    await saveEquationsToLocalStorage(updatedEquations);
  };

  /**
   * delete all equations.
   */
  const deleteAllEquations = async (): Promise<void> => {
    await LocalStorage.removeItem("equations");
  };

  return {
    fetchEquations,
    createEquation,
    duplicateEquation,
    editEquation,
    favoriteEquation,
    deleteEquation,
    deleteAllEquations,
  };
};

const saveEquationsToLocalStorage = async (equations: EquationObj[]) => {
  await LocalStorage.setItem("equations", JSON.stringify(equations));
};

const demoEquations: EquationObj[] = [
  {
    id: "0",
    title: "Quadratic Formula",
    latex: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}",
    tags: [Color.Blue, Color.Purple],
    favorite: false,
  },
  { id: "1", title: "Euler's Identity", latex: "e^{i\\pi} + 1 = 0", tags: [Color.Purple], favorite: true },
  { id: "2", title: "Pythagorean Theorem", latex: "a^2 + b^2 = c^2", tags: [Color.Green], favorite: false },
  { id: "3", title: "Area of Circle", latex: "A = \\pi r^2", tags: [Color.Red], favorite: false },
  {
    id: "4",
    title: "Derivative Definition",
    latex: "f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}",
    tags: [Color.Orange],
    favorite: true,
  },
  { id: "5", title: "Integral of e^x", latex: "\\int e^x dx = e^x + C", tags: [Color.Yellow], favorite: false },
  {
    id: "6",
    title: "Sum of Arithmetic Series",
    latex: "S_n = \\frac{n(a_1 + a_n)}{2}",
    tags: [Color.Blue],
    favorite: true,
  },
  {
    id: "7",
    title: "Binomial Theorem",
    latex: "(a+b)^n = \\sum_{k=0}^{n} \\binom{n}{k} a^{n-k} b^k",
    tags: [Color.Magenta],
    favorite: true,
  },
  { id: "8", title: "Law of Cosines", latex: "c^2 = a^2 + b^2 - 2ab\\cos C", tags: [Color.Green], favorite: false },
  {
    id: "9",
    title: "Normal Distribution",
    latex: "f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}} e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}",
    tags: [Color.Purple],
    favorite: true,
  },
  {
    id: "10",
    title: "Matrix Determinant 2x2",
    latex: "\\det \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} = ad - bc",
    tags: [Color.Orange],
    favorite: false,
  },
  {
    id: "11",
    title: "Taylor Series",
    latex: "f(x) = \\sum_{n=0}^{\\infty} \\frac{f^{(n)}(a)}{n!}(x-a)^n",
    tags: [Color.Red],
    favorite: true,
  },
  {
    id: "12",
    title: "Fourier Transform",
    latex: "\\hat{f}(\\xi) = \\int_{-\\infty}^{\\infty} f(x) e^{-2\\pi ix\\xi} dx",
    tags: [Color.Blue],
    favorite: false,
  },
  {
    id: "13",
    title: "Schrödinger Equation",
    latex: "i\\hbar \\frac{\\partial}{\\partial t} \\Psi = \\hat{H} \\Psi",
    tags: [Color.Magenta],
    favorite: true,
  },
  {
    id: "14",
    title: "Schrödinger Equation",
    latex: "i\\hbar \\frac{\\partial}{\\partial t} \\Psi = \\hat{H} \\Psi",
    tags: [Color.PrimaryText],
    favorite: true,
  },
];
