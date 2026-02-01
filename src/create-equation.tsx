import { Action, ActionPanel, List, useNavigation } from "@raycast/api";
import { useState } from "react";
import { useLatex } from "./libs/use-latex";
import AddMetadata from "./create-equation-metadata";

export default function CreateEquation() {
  const [latex, setLatex] = useState<string>("");
  const { push } = useNavigation();

  const { displayLatexURL } = useLatex();

  const imageUrl = latex ? displayLatexURL(latex) : "";

  return (
    <List searchBarPlaceholder="Enter LaTeX code..." onSearchTextChange={setLatex}>
      <List.EmptyView
        icon={latex ? imageUrl : undefined}
        title={latex ? "" : "Enter LaTeX Code"}
        description={latex ? undefined : "Type LaTeX code in the search bar to preview"}
        actions={
          <ActionPanel>
            <Action title="Push" onAction={() => push(<AddMetadata latex={latex} />)} />
          </ActionPanel>
        }
      />
    </List>
  );
}
