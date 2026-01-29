import { Action, ActionPanel, Color, Grid, Icon } from "@raycast/api";
import { useCachedPromise } from "@raycast/utils";
import { ORGANIZE_GRID_COLUMNS } from "./core/constants";
import { useState } from "react";
import { groupByTag } from "./libs/group-by-tag";
import { useLatex } from "./libs/use-latex";
import { useEquation } from "./libs/use-equation";

export default function Command() {
  const [selectedTag, setSelectedTag] = useState<string>("all");

  const { displayLatexURL } = useLatex();

  const { fetchEquations } = useEquation();

  // Fetch equations with caching
  const { data: equations = [], isLoading } = useCachedPromise(fetchEquations);

  const groupedEquations = groupByTag(equations);

  const filteredGroups =
    selectedTag === "all"
      ? groupedEquations
      : selectedTag === "favorite"
        ? { Favorite: equations.filter((eq) => eq.favorite) }
        : { [selectedTag]: groupedEquations[selectedTag] || [] };

  return (
    <Grid
      isLoading={isLoading}
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
