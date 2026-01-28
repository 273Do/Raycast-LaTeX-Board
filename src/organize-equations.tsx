import { Action, ActionPanel, Color, Grid, Icon } from "@raycast/api";
import { ORGANIZE_GRID_COLUMNS } from "./core/constants";
import { useState } from "react";
import { groupByTag } from "./libs/group-by-tag";
import { useLatex } from "./libs/use-latex";

export type EquationObj = {
  id: string;
  title: string;
  latex: string;
  tag: Color;
  favorite: boolean;
};

const equations: EquationObj[] = [
  {
    id: "0",
    title: "Quadratic Formula",
    latex: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}",
    tag: Color.Blue,
    favorite: false,
  },
  { id: "1", title: "Euler's Identity", latex: "e^{i\\pi} + 1 = 0", tag: Color.Purple, favorite: true },
  { id: "2", title: "Pythagorean Theorem", latex: "a^2 + b^2 = c^2", tag: Color.Green, favorite: false },
  { id: "3", title: "Area of Circle", latex: "A = \\pi r^2", tag: Color.Red, favorite: false },
  {
    id: "4",
    title: "Derivative Definition",
    latex: "f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}",
    tag: Color.Orange,
    favorite: true,
  },
  { id: "5", title: "Integral of e^x", latex: "\\int e^x dx = e^x + C", tag: Color.Yellow, favorite: false },
  {
    id: "6",
    title: "Sum of Arithmetic Series",
    latex: "S_n = \\frac{n(a_1 + a_n)}{2}",
    tag: Color.Blue,
    favorite: true,
  },
  {
    id: "7",
    title: "Binomial Theorem",
    latex: "(a+b)^n = \\sum_{k=0}^{n} \\binom{n}{k} a^{n-k} b^k",
    tag: Color.Magenta,
    favorite: true,
  },
  { id: "8", title: "Law of Cosines", latex: "c^2 = a^2 + b^2 - 2ab\\cos C", tag: Color.Green, favorite: false },
  {
    id: "9",
    title: "Normal Distribution",
    latex: "f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}} e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}",
    tag: Color.Purple,
    favorite: true,
  },
  {
    id: "10",
    title: "Matrix Determinant 2x2",
    latex: "\\det \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} = ad - bc",
    tag: Color.Orange,
    favorite: false,
  },
  {
    id: "11",
    title: "Taylor Series",
    latex: "f(x) = \\sum_{n=0}^{\\infty} \\frac{f^{(n)}(a)}{n!}(x-a)^n",
    tag: Color.Red,
    favorite: true,
  },
  {
    id: "12",
    title: "Fourier Transform",
    latex: "\\hat{f}(\\xi) = \\int_{-\\infty}^{\\infty} f(x) e^{-2\\pi ix\\xi} dx",
    tag: Color.Blue,
    favorite: false,
  },
  {
    id: "13",
    title: "Schrödinger Equation",
    latex: "i\\hbar \\frac{\\partial}{\\partial t} \\Psi = \\hat{H} \\Psi",
    tag: Color.Magenta,
    favorite: true,
  },
];

export default function Command() {
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const { displayLatexURL } = useLatex();

  const groupedEquations = groupByTag(equations);

  const filteredGroups =
    selectedTag === "all"
      ? groupedEquations
      : selectedTag === "favorite"
        ? { Favorite: equations.filter((eq) => eq.favorite) }
        : { [selectedTag]: groupedEquations[selectedTag] || [] };

  return (
    <Grid
      inset={Grid.Inset.Small}
      columns={ORGANIZE_GRID_COLUMNS}
      searchBarPlaceholder="Search Equations"
      searchBarAccessory={
        <Grid.Dropdown tooltip="Filter by Tag" onChange={(v) => setSelectedTag(v)} value={selectedTag}>
          <Grid.Dropdown.Item key="all" title="All Tags" value="all" />
          <Grid.Dropdown.Item
            key="favorite"
            title="Favorite"
            value="favorite"
            icon={{ source: Icon.Heart, tintColor: Color.Magenta }}
          />
          {Object.keys(groupedEquations).map((tagName) => (
            <Grid.Dropdown.Item
              key={tagName}
              title={tagName}
              value={tagName}
              icon={{ source: Icon.Circle, tintColor: Color[tagName as keyof typeof Color] }}
            />
          ))}
        </Grid.Dropdown>
      }
    >
      {Object.entries(filteredGroups).map(([tagName, items]) => (
        <Grid.Section key={tagName} title={tagName}>
          {items.map((eq) => (
            <Grid.Item
              key={eq.title}
              content={displayLatexURL(eq.latex)}
              title={eq.title}
              accessory={eq.favorite ? { icon: { source: Icon.Heart, tintColor: Color.Magenta } } : undefined}
              actions={
                <ActionPanel>
                  <Action.CopyToClipboard title="Copy to Clipboard" content={eq.latex} />
                  <Action icon={Icon.Pencil} title="Edit Equation" onAction={() => console.log("Edit Equation")} />
                  <Action
                    icon={Icon.Duplicate}
                    title="Duplicate Equation"
                    onAction={() => console.log("Duplicate Equation")}
                  />
                  <Action icon={Icon.Heart} title="Favorite" onAction={() => console.log("Favorite")} />
                  <Action icon={Icon.Download} title="Export Image" onAction={() => console.log("Export Image")} />
                </ActionPanel>
              }
            />
          ))}
        </Grid.Section>
      ))}
    </Grid>
  );
}
