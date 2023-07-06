import dayjs from "dayjs";

export const transformDate = (val: string): { date: string; time: string } => {
  return {
    date: dayjs(val).format("MM/DD/YY"),
    time: dayjs(val).format("HH:mm:ss"),
  };
};
