import { useState, type FC } from "react";
import { Edit3, RefreshCw } from "lucide-react";
import { ManualAqiForm } from "@/components/landing/manual-aqi-form";

export interface AqiCardErrorProps {
  error: string;
  onRetry?: () => void;
  onManualSubmit?: (aqi: number) => void;
}

export const AqiCardError: FC<AqiCardErrorProps> = ({
  error,
  onRetry,
  onManualSubmit,
}) => {
  const [showManualInput, setShowManualInput] = useState(false);

  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center">
      <p className="text-sm font-medium text-ink/90">{error}</p>
      <p className="mt-1 text-xs text-ink-muted">
        Could not retrieve data for this city.
      </p>
      {!showManualInput ? (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-white/10 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-white/15"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Retry</span>
            </button>
          )}
          {onManualSubmit && (
            <button
              type="button"
              onClick={() => setShowManualInput(true)}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-white/10 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-white/15"
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span>Enter AQI yourself</span>
            </button>
          )}
        </div>
      ) : (
        <ManualAqiForm
          onSubmit={(val) => {
            setShowManualInput(false);
            onManualSubmit?.(val);
          }}
          onCancel={() => setShowManualInput(false)}
        />
      )}
    </div>
  );
};
