import { Action, ActionPanel, Color, Form, Icon, showToast, Toast, useNavigation } from "@raycast/api";
import { useForm, FormValidation } from "@raycast/utils";
import { useEquation } from "./libs/use-equation";
import OrganizeEquations from "./organize-equations";

export type EquationFormValues = Pick<Form.Values, "title" | "latex" | "tags">;

export default function AddMetadata({ latex }: { latex: string }) {
  const { createEquation } = useEquation();
  const { push } = useNavigation();

  const { handleSubmit, itemProps } = useForm<EquationFormValues>({
    onSubmit(values) {
      try {
        createEquation({ ...values, latex });

        showToast({
          style: Toast.Style.Success,
          title: "Equation Created",
        });

        push(<OrganizeEquations />);
      } catch (error) {
        showToast({
          style: Toast.Style.Failure,
          title: "Failed to Create Equation",
          message: String(error),
        });
      }
    },

    validation: {
      title: FormValidation.Required,
      tags: FormValidation.Required,
    },
  });

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Submit" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField title="Title" placeholder="Enter a title" {...itemProps.title} />
      <Form.TagPicker title="Tag" {...itemProps.tags}>
        {Object.entries(Color).map(([name, value]) => (
          <Form.TagPicker.Item key={name} value={name} title={name} icon={{ source: Icon.Circle, tintColor: value }} />
        ))}
      </Form.TagPicker>
      <Form.Separator />
      <Form.Description title="LaTeX" text={latex} />
    </Form>
  );
}
