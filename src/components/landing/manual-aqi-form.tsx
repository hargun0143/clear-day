import { useState, type FC, type FormEvent } from "react";
import { validateManualAqi } from "@/utils/validate-manual-aqi";

export interface ManualAqiFormProps {
  onSubmit: (aqi: number) => void;
  onCancel?: () => void;
}

export const ManualAqiForm: FC<ManualAqiFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const [val, setVal] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const result = validateManualAqi(val);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setError(null);
    onSubmit(result.aqi);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-3 flex w-full max-w-xs flex-col items-center gap-2"
    >
      <div className="w-full text-left">
        <label
          htmlFor="manual-aqi-input"
          className="mb-1 block text-xs font-medium text-ink-muted"
        >
          Enter AQI value (0–500)
        </label>
        <div className="flex gap-2">
          <input
            id="manual-aqi-input"
            type="text"
            inputMode="numeric"
            value={val}
            onChange={(e) => {
              setVal(e.target.value);
              if (error) setError(null);
            }}
            placeholder="e.g. 150"
            className="flex-1 rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 text-sm text-ink placeholder:text-ink-muted/50 focus:border-teal focus:outline-none"
          />
          <button
            type="submit"
            className="cursor-pointer rounded-xl bg-teal px-3.5 py-1.5 text-xs font-semibold text-bg transition-opacity hover:opacity-90"
          >
            Apply
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="cursor-pointer rounded-xl border border-white/15 px-2.5 py-1.5 text-xs text-ink-muted hover:text-ink"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
      {error && <p className="self-start text-xs text-red-400">{error}</p>}
    </form>
  );
};
