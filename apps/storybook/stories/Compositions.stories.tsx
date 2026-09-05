import type { Meta, StoryObj } from "@storybook/react-vite";
import CompositionListExample from "@kimgseok/design-examples/composition-list";
import CompositionFormExample from "@kimgseok/design-examples/composition-form";
import CompositionDetailExample from "@kimgseok/design-examples/composition-detail";

const meta = {
  title: "Compositions/Product flows",
  parameters: { layout: "padded" },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
export const List: Story = { render: () => <CompositionListExample /> };
export const FormRecovery: Story = { render: () => <CompositionFormExample /> };
export const DetailConfirmation: Story = {
  render: () => <CompositionDetailExample />,
};
