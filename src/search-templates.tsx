import { Action, ActionPanel, Grid, Icon } from "@raycast/api";
import { SEARCH_GRID_COLUMNS } from "./core/constants";
import { templates } from "./core/templates";
import { useState } from "react";
import { useLatex } from "./libs/use-latex";

export default function Command() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { displayLatexURL } = useLatex();

  const filteredTemplates = Object.entries(templates).filter(
    ([cat]) => selectedCategory === "all" || cat === selectedCategory,
  );

  return (
    <Grid
      inset={Grid.Inset.Small}
      columns={SEARCH_GRID_COLUMNS}
      searchBarPlaceholder="Search LaTeX Templates"
      searchBarAccessory={
        <Grid.Dropdown tooltip="Equation Category" onChange={(v) => setSelectedCategory(v)} value={selectedCategory}>
          <Grid.Dropdown.Item key="all" title="All Categories" value="all" />
          {Object.keys(templates).map((cat) => (
            <Grid.Dropdown.Item key={cat} title={cat} value={cat} />
          ))}
        </Grid.Dropdown>
      }
    >
      {filteredTemplates.map(([category, equations]) => (
        <Grid.Section key={category} title={category}>
          {Object.entries(equations).map(([name, latex]) => (
            <Grid.Item
              key={name}
              content={displayLatexURL(latex)}
              title={name}
              actions={
                <ActionPanel>
                  <Action.CopyToClipboard title="Copy to Clipboard" content={latex} />
                  <Action
                    icon={Icon.PlusCircle}
                    title="Create New Equation from Template"
                    onAction={() => console.log("Create New Equation from Template")}
                  />
                  <Action
                    icon={Icon.Download}
                    title="Export Image"
                    onAction={() => console.log("Export ImagDEFAULT_ICON")}
                  />
                </ActionPanel>
              }
            />
          ))}
        </Grid.Section>
      ))}
    </Grid>
  );
}
