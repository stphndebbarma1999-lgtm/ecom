"use client";

import { useState } from "react";

const inputClass =
  "border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 outline-none focus:border-neutral-900";

interface FieldDef {
  key: string;
  label: string;
  hint?: string;
}

interface Row {
  [key: string]: string;
}

/**
 * Manages a dynamic, add/remove-able list of slides (hero photos, banner
 * photos) as clearly labeled fields instead of a pipe-delimited textarea —
 * that format was error-prone (see the Shop by Categories fix). Rows are
 * uncontrolled inputs keyed by a stable id, so removing one doesn't corrupt
 * the values already typed into the others.
 */
export default function SlideListEditor({
  namePrefix,
  countFieldName,
  fields,
  initialRows,
  emptyRow,
  max = 6,
  addLabel = "+ Add Slide",
  rowGridClassName,
}: {
  namePrefix: string;
  countFieldName: string;
  fields: FieldDef[];
  initialRows: Row[];
  emptyRow: Row;
  max?: number;
  addLabel?: string;
  rowGridClassName: string;
}) {
  const [rows, setRows] = useState<(Row & { _id: string })[]>(() =>
    initialRows.map((r) => ({ ...r, _id: crypto.randomUUID() }))
  );

  const add = () => {
    setRows((r) => (r.length >= max ? r : [...r, { ...emptyRow, _id: crypto.randomUUID() }]));
  };
  const remove = (id: string) => setRows((r) => r.filter((row) => row._id !== id));

  return (
    <div className="flex flex-col gap-4">
      <input type="hidden" name={countFieldName} value={rows.length} />

      {rows.length === 0 && (
        <p className="text-xs text-neutral-400">No slides yet — click &quot;{addLabel}&quot; below.</p>
      )}

      {rows.map((row, i) => (
        <div
          key={row._id}
          className={`grid grid-cols-1 items-end gap-3 border border-neutral-200 p-4 ${rowGridClassName}`}
        >
          {fields.map((f) => (
            <label key={f.key} className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-neutral-700">{f.label}</span>
              <input name={`${namePrefix}_${i}_${f.key}`} defaultValue={row[f.key]} className={inputClass} />
              {f.hint && <span className="text-xs text-neutral-400">{f.hint}</span>}
            </label>
          ))}
          <button
            type="button"
            onClick={() => remove(row._id)}
            className="h-fit w-fit text-xs font-medium text-red-600 hover:text-red-700"
          >
            Remove
          </button>
        </div>
      ))}

      {rows.length < max && (
        <button
          type="button"
          onClick={add}
          className="inline-flex w-fit items-center gap-1 border border-dashed border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:border-neutral-900 hover:text-neutral-900"
        >
          {addLabel}
        </button>
      )}
    </div>
  );
}
