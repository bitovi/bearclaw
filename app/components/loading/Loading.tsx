import CircularProgress from '@mui/material/CircularProgress';

type Props = React.ComponentProps<typeof CircularProgress>;

export function Loading(props: Props) {
  return (
    <CircularProgress {...props} />
  );
}
