import type { Meta, StoryObj } from "@storybook/react";
import dayjs from "dayjs";

import Table from "./Table";

const fixture_InvoiceTable = () => {
  let data = [];
  for (let i = 0; i < 6; i++) {
    data.push({
      Invoice_ID: `${i}-invoice`,
      Date: dayjs(new Date()).format("MMMM DD, YYYY"),
      Invoice_amount: `$${i}`,
    });
  }
  return data;
};

const meta = {
  title: "Components/Table",
  component: Table<any>,
  tags: ["component", "table"],
} satisfies Meta<typeof Table<any>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const _Table: Story = {
  render: (args) => <Table {...args} />,
  args: {
    tableTitle: "Invoices",
    tableData: fixture_InvoiceTable(),
    headers: ["Invoice Id", "Date", "Invoice Amount"],
    search: true,
    searchFields: [
      { value: "dataObject", label: "Data Object" },
      { value: "filename", label: "Filename" },
    ],
  },
};
