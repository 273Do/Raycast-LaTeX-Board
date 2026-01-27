import { Action, ActionPanel, environment, Grid, Icon } from "@raycast/api";
import { BASE_URL } from "./core/constants";
import { templates } from "./core/templates";

const textColor = environment.appearance === "dark" ? "White" : "Black";

export default function Command() {
  return (
    <Grid inset={Grid.Inset.Small} columns={6} searchBarPlaceholder="Search LaTeX Templates">
      {Object.entries(templates).map(([category, equations]) => (
        <Grid.Section key={category} title={category}>
          {Object.entries(equations).map(([name, latex]) => (
            <Grid.Item
              key={name}
              content={`${BASE_URL}?\\color{${textColor}}${latex}`}
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
