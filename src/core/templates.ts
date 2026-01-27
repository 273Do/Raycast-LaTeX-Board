import accents from "../../assets/formula_data/accents.json";
import brackets from "../../assets/formula_data/brackets.json";
import complexNumbers from "../../assets/formula_data/complex_numbers.json";
import derivatives from "../../assets/formula_data/derivatives.json";
import displayFormats from "../../assets/formula_data/display_formats.json";
import fontsSizes from "../../assets/formula_data/fonts_sizes.json";
import fractions from "../../assets/formula_data/fractions.json";
import greekLowercase from "../../assets/formula_data/greek_lowercase.json";
import greekUppercase from "../../assets/formula_data/greek_uppercase.json";
import integrals from "../../assets/formula_data/integrals.json";
import limits from "../../assets/formula_data/limits.json";
import logic from "../../assets/formula_data/logic.json";
import matrices from "../../assets/formula_data/matrices.json";
import operators from "../../assets/formula_data/operators.json";
import permutationsCombinations from "../../assets/formula_data/permutations_combinations.json";
import powersExponentsLogarithms from "../../assets/formula_data/powers_exponents_logarithms.json";
import sets from "../../assets/formula_data/sets.json";
import spacing from "../../assets/formula_data/spacing.json";
import specialCharacters from "../../assets/formula_data/special_characters.json";
import summationProduct from "../../assets/formula_data/summation_product.json";
import trigonometry from "../../assets/formula_data/trigonometry.json";
import vectors from "../../assets/formula_data/vectors.json";

type FormulaTemplatesObj = Record<string, Record<string, string>>;

export const templates: FormulaTemplatesObj = {
  // Basic structures
  ...fractions,
  ...powersExponentsLogarithms,
  ...brackets,

  // Calculus
  ...summationProduct,
  ...limits,
  ...derivatives,
  ...integrals,

  // Functions
  ...trigonometry,

  // Linear algebra
  ...vectors,
  ...matrices,

  // Other math
  ...sets,
  ...logic,
  ...complexNumbers,
  ...permutationsCombinations,

  // Formatting & styling
  ...accents,
  ...displayFormats,
  ...fontsSizes,
  ...spacing,
  ...specialCharacters,

  // Basic symbols
  ...operators,

  // Greek letters
  ...greekLowercase,
  ...greekUppercase,
};
