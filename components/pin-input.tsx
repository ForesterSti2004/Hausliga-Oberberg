"use client";

type PinInputProps = {
  "aria-label": string;
  value: number | null;
  onChange: (value: number | null) => void;
  placeholder?: string;
};

export function PinInput({ value, onChange, ...props }: PinInputProps) {
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const entered = input.value;
    if (!/^\d{0,3}$/.test(entered) || (entered !== "" && Number(entered) > 300)) {
      input.value = value === null ? "" : String(value);
      return;
    }

    onChange(entered === "" ? null : Number(entered));
    if (entered.length === 3) {
      const fields = Array.from(input.closest(".next-entry")?.querySelectorAll<HTMLInputElement>("[data-pin-entry]") ?? []);
      fields[fields.indexOf(input) + 1]?.focus();
    }
  }

  return <input {...props} data-pin-entry type="text" inputMode="numeric" pattern="[0-9]*" maxLength={3} value={value ?? ""} onChange={handleChange} />;
}
