type Props = {
  message: string;
};

export function FormErrorBanner({ message }: Props) {
  return (
    <p
      className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
      role="alert"
    >
      {message}
    </p>
  );
}
