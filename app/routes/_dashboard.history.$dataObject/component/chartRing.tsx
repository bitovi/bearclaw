import Box from "@mui/material/Box";
import type { ReactNode } from "react";
import { Cell, PieChart, Pie, ResponsiveContainer } from "recharts";

type Props = {
  data: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  children?: ReactNode;
};

export function ChartRing({ children, data }: Props) {
  return (
    <Box position="relative" minWidth="176px">
      <Box
        position="absolute"
        width="100%"
        height="100%"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        {children}
      </Box>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart width={176} height={176}>
          <Pie
            data={data}
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={87}
            stroke="none"
          >
            {data.map((entry) => (
              <Cell key={`cell-${entry.name}`} fill={entry.color} />
            ))}
          </Pie>
          <Pie
            data={[{ value: 1 }]}
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={61}
            fill="rgba(255,255,255,0.25)"
            stroke="none"
          />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
}
