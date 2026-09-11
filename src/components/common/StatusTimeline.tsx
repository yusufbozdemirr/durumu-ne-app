import React from 'react';
import { VehicleStatus, StatusHistoryEntry } from '../../types';
import { STATUS_LIST } from '../../utils/statusConstants';
import { Check, Clock, Circle } from 'lucide-react';

interface StatusTimelineProps {
  currentStatus: VehicleStatus;
  history: StatusHistoryEntry[];
  className?: string;
  isCustomerView?: boolean;
}

export const StatusTimeline: React.FC<StatusTimelineProps> = ({
  currentStatus,
  history,
  className = '',
  isCustomerView = false,
}) => {
  const steps = STATUS_LIST;

  // Find index of current status
  const currentIndex = steps.findIndex((s) => s.key === currentStatus);
  const activeStepIndex = currentIndex === -1 ? 0 : currentIndex;

  return (
    <div className={`space-y-0 ${className}`}>
      {steps.map((step, idx) => {
        const isCompleted = idx < activeStepIndex;
        const isCurrent = idx === activeStepIndex;

        // Match latest history entry for this status if available
        const historyEntry = [...history].reverse().find((h) => h.status === step.key);

        let formattedTime = '';
        if (historyEntry?.timestamp) {
          try {
            const dateObj = new Date(historyEntry.timestamp);
            formattedTime = !isNaN(dateObj.getTime())
              ? dateObj.toLocaleDateString('tr-TR', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : '';
          } catch {
            formattedTime = '';
          }
        }

        return (
          <div key={step.key} className="relative flex items-start group">
            {/* Connecting Vertical Line */}
            {idx !== steps.length - 1 && (
              <div
                className={`absolute left-4 top-8 -bottom-1 w-0.5 -ml-px transition-colors duration-200 ${
                  isCompleted ? 'bg-emerald-600' : isCurrent ? 'bg-emerald-200' : 'bg-slate-200'
                }`}
                aria-hidden="true"
              />
            )}

            {/* Step Node Icon */}
            <div className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full shrink-0">
              {isCompleted ? (
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                  <Check className="w-4 h-4 stroke-[2.5]" />
                </div>
              ) : isCurrent ? (
                <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 ring-4 ring-emerald-50 text-emerald-700">
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-600 animate-pulse" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-slate-50 border-2 border-slate-200 text-slate-300 flex items-center justify-center">
                  <Circle className="w-3.5 h-3.5 fill-transparent text-slate-300" />
                </div>
              )}
            </div>

            {/* Content info */}
            <div className="ml-4 pb-7 flex-1">
              <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1">
                <p
                  className={`text-sm tracking-tight ${
                    isCurrent
                      ? 'font-bold text-emerald-900 flex items-center gap-2'
                      : isCompleted
                      ? 'font-semibold text-slate-800'
                      : 'font-medium text-slate-400'
                  }`}
                >
                  {step.label}
                  {isCurrent && (
                    <span className="inline-flex items-center text-[11px] font-medium bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      Mevcut Aşama
                    </span>
                  )}
                </p>

                {formattedTime && (
                  <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {formattedTime}
                  </span>
                )}
              </div>

              {/* Note or description */}
              {historyEntry?.note ? (
                <div
                  className={`mt-1.5 text-xs rounded-lg p-2.5 ${
                    isCurrent
                      ? 'bg-emerald-50/70 border border-emerald-100 text-emerald-900'
                      : isCompleted
                      ? 'bg-slate-50 border border-slate-100 text-slate-600'
                      : 'text-slate-400'
                  }`}
                >
                  <p className="leading-relaxed">{historyEntry.note}</p>
                  {!isCustomerView && historyEntry.updatedBy && (
                    <span className="block mt-1 text-[10px] text-slate-400 font-medium">
                      Güncelleyen: {historyEntry.updatedBy}
                    </span>
                  )}
                </div>
              ) : (
                <p className="mt-0.5 text-xs text-slate-400 leading-normal">
                  {step.description}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
