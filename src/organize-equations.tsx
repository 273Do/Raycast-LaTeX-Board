import { Action, ActionPanel, Color, Grid, Icon, showToast, Toast, useNavigation } from "@raycast/api";
import { useCachedPromise } from "@raycast/utils";
import { ORGANIZE_GRID_COLUMNS } from "./core/constants";
import { useState } from "react";
import { groupByTags } from "./libs/group-by-tag";
import { useLatex } from "./libs/use-latex";
import { EquationObj, useEquation } from "./libs/use-equation";
import CreateEquation from "./create-equation";

export default function OrganizeEquations() {
  const [selectedTag, setSelectedTag] = useState<string>("all");

  const { displayLatexURL } = useLatex();
  const { push } = useNavigation();

  const { fetchEquations, duplicateEquation, favoriteEquation, deleteEquation, deleteAllEquations } = useEquation();

  // Fetch equations with caching
  const { data: equations = [], isLoading, revalidate } = useCachedPromise(fetchEquations);

  const groupedEquations = groupByTags(equations);

  const filteredGroups =
    selectedTag === "all"
      ? groupedEquations
      : selectedTag === "favorite"
        ? { Favorite: equations.filter((eq) => eq.favorite) }
        : { [selectedTag]: groupedEquations[selectedTag] || [] };

  const handleDuplicate = async (id: string) => {
    await action(duplicateEquation(id), "Equation Duplicated", "Failed to Duplicate Equation");
  };

  const handleFavorite = async (id: string) => {
    await action(favoriteEquation(id), "Equation Favorite", "Failed to Favorite Equation");
  };

  const handleEdit = async (equation: EquationObj) => {
    push(<CreateEquation equation={equation} />);
  };

  const handleDelete = async (id: string) => {
    await action(deleteEquation(id), "Equation Deleted", "Failed to Delete Equation");
  };

  const handleDeleteAll = async () => {
    await action(deleteAllEquations(), "All Equation Deleted", "Failed to Delete All Equations");
  };

  const action = async (actionPromise: Promise<void>, successTitle: string, failureTitle: string) => {
    try {
      await actionPromise;

      revalidate();

      showToast({
        style: Toast.Style.Success,
        title: successTitle,
      });
    } catch (error) {
      showToast({
        style: Toast.Style.Failure,
        title: failureTitle,
        message: String(error),
      });
    }
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
                    icon={Icon.Heart}
                    title={eq.favorite ? "Unfavorite Equation" : "Favorite Equation"}
                    shortcut={{ modifiers: ["cmd"], key: "f" }}
                    onAction={() => handleFavorite(eq.id)}
                  />
                  <Action
                    icon={Icon.Pencil}
                    title="Edit Equation"
                    shortcut={{ modifiers: ["cmd"], key: "e" }}
                    onAction={() => handleEdit(eq)}
                  />
                  <Action
                    icon={Icon.Duplicate}
                    title="Duplicate Equation"
                    shortcut={{ modifiers: ["cmd"], key: "d" }}
                    onAction={() => handleDuplicate(eq.id)}
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
