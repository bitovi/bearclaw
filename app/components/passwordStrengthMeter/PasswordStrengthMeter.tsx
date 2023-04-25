export function getPasswordStrength(password: string) {
  let strength = 0;
  if (password.match(/[a-z]/g)) strength += 1;
  if (password.match(/[A-Z]/g)) strength += 1;
  if (password.match(/[0-9]/g)) strength += 1;
  if (password.match(/[^a-zA-Z\d]/g)) strength += 1;
  if (password.length >= 12) strength += 1;
  return strength;
}

export function PasswordStrengthMeter({ strength }: { strength: number }) {
  const barColor =
    strength === 1
      ? "bg-red-500"
      : strength === 2
      ? "bg-orange-500"
      : strength === 3
      ? "bg-yellow-500"
      : strength === 4
      ? "bg-lime-500"
      : strength === 5
      ? "bg-green-500"
      : "bg-gray-300";

  return (
    <div className="flex w-full gap-1">
      {Array(5)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded bg-gray-300 ${
              strength > i ? barColor : "gray-300"
            }`}
          />
        ))}
    </div>
  );
}
