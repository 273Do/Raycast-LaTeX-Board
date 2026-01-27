import { Grid } from "@raycast/api";
import { BASE_URL } from "./core/constants";
import { templates } from "./core/templates";

export default function Command() {
  return (
    <Grid inset={Grid.Inset.Small} columns={6} searchBarPlaceholder="Search LaTeX Templates">
      {Object.entries(templates).map(([category, formulas]) => (
        <Grid.Section key={category} title={category}>
          {Object.entries(formulas).map(([name, latex]) => (
            <Grid.Item key={name} content={`${BASE_URL}?\\color{White}${latex}`} title={name} />
          ))}
        </Grid.Section>
      ))}
    </Grid>
  );
}
