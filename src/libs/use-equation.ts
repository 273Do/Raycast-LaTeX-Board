import { Color, LocalStorage } from "@raycast/api";

export type EquationObj = {
  id: string;
  title: string;
  latex: string;
  tags: Color[];
  favorite: boolean;
};

/**
 * A hook for managing Equations.
 *
 * @returns
 *   - fetchEquations: Function to fetch the list of equations.
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
      await LocalStorage.setItem("equations", JSON.stringify(demoEquations));
      return [];
    }

    return JSON.parse(equations);
  };

  /**
   * delete an equation by its ID.
   */
  const deleteEquation = async (id: string): Promise<void> => {
    const equations = await fetchEquations();
    const updatedEquations = equations.filter((eq) => eq.id !== id);

    await LocalStorage.setItem("equations", JSON.stringify(updatedEquations));
  };

  /**
   * delete all equations.
   */
  const deleteAllEquations = async (): Promise<void> => {
    await LocalStorage.removeItem("equations");
  };

  return { fetchEquations, deleteEquation, deleteAllEquations };
};

const demoEquations: EquationObj[] = [
  {
    id: "0",
    title: "Quadratic Formula",
    latex: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}",
    tags: [Color.Blue],
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
