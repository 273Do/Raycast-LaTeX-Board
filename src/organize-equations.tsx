import { Action, ActionPanel, Color, Grid, Icon } from "@raycast/api";
import { useCachedPromise } from "@raycast/utils";
import { ORGANIZE_GRID_COLUMNS } from "./core/constants";
import { useState } from "react";
import { groupByTags } from "./libs/group-by-tag";
import { useLatex } from "./libs/use-latex";
import { useEquation } from "./libs/use-equation";

export default function Command() {
  const [selectedTag, setSelectedTag] = useState<string>("all");

  const { displayLatexURL } = useLatex();

  const { fetchEquations, deleteEquation, deleteAllEquations } = useEquation();

  // Fetch equations with caching
  const { data: equations = [], isLoading, revalidate } = useCachedPromise(fetchEquations);

  const groupedEquations = groupByTags(equations);

  const filteredGroups =
    selectedTag === "all"
      ? groupedEquations
      : selectedTag === "favorite"
        ? { Favorite: equations.filter((eq) => eq.favorite) }
        : { [selectedTag]: groupedEquations[selectedTag] || [] };

  const handleDelete = async (id: string) => {
    await deleteEquation(id);
    revalidate();
  };

  const handleDeleteAll = async () => {
    await deleteAllEquations();
    revalidate();
  };

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
                  <Action
                    icon={Icon.Pencil}
                    title="Edit Equation"
                    shortcut={{ modifiers: ["cmd"], key: "e" }}
                    onAction={() => console.log("Edit Equation")}
                  />
                  <Action
                    icon={Icon.Duplicate}
                    title="Duplicate Equation"
                    shortcut={{ modifiers: ["cmd"], key: "d" }}
                    onAction={() => console.log("Duplicate Equation")}
                  />
                  <Action
                    icon={Icon.Heart}
                    title="Favorite"
                    shortcut={{ modifiers: ["cmd"], key: "f" }}
                    onAction={() => console.log("Favorite")}
                  />
                  <Action
                    icon={Icon.Download}
                    title="Export Image"
                    shortcut={{ modifiers: ["cmd"], key: "l" }}
                    onAction={() => console.log("Export Image")}
                  />
                  <ActionPanel.Section>
                    <Action
                      icon={Icon.Trash}
                      title="Delete Equation"
                      style={Action.Style.Destructive}
                      shortcut={{ modifiers: ["cmd"], key: "x" }}
                      onAction={() => handleDelete(eq.id)}
                    />
                    <Action
                      icon={Icon.Trash}
                      title="Delete All Equations"
                      style={Action.Style.Destructive}
                      shortcut={{ modifiers: ["cmd", "shift"], key: "x" }}
                      onAction={handleDeleteAll}
                    />
                  </ActionPanel.Section>
                </ActionPanel>
              }
            />
          ))}
        </Grid.Section>
      ))}
    </Grid>
  );
}
