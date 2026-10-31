export type UnitKind = 'volume' | 'weight' | 'temperature'

export interface Unit {
  id: string
  label: string
  kind: UnitKind
  /** Size in the kind's base unit (ml for volume, g for weight). Unused for temperature. */
  factor: number
}

/** US customary measures, which is what most of the recipes use. */
export const UNITS: Unit[] = [
  { id: 'tsp', label: 'teaspoon (tsp)', kind: 'volume', factor: 4.92892 },
  { id: 'tbsp', label: 'tablespoon (tbsp)', kind: 'volume', factor: 14.7868 },
  { id: 'floz', label: 'fluid ounce (fl oz)', kind: 'volume', factor: 29.5735 },
  { id: 'cup', label: 'cup', kind: 'volume', factor: 236.588 },
  { id: 'pint', label: 'pint', kind: 'volume', factor: 473.176 },
  { id: 'quart', label: 'quart', kind: 'volume', factor: 946.353 },
  { id: 'gallon', label: 'gallon', kind: 'volume', factor: 3785.41 },
  { id: 'ml', label: 'milliliter (ml)', kind: 'volume', factor: 1 },
  { id: 'l', label: 'liter (l)', kind: 'volume', factor: 1000 },
  { id: 'g', label: 'gram (g)', kind: 'weight', factor: 1 },
  { id: 'kg', label: 'kilogram (kg)', kind: 'weight', factor: 1000 },
  { id: 'oz', label: 'ounce (oz)', kind: 'weight', factor: 28.3495 },
  { id: 'lb', label: 'pound (lb)', kind: 'weight', factor: 453.592 },
  { id: 'f', label: 'Fahrenheit (°F)', kind: 'temperature', factor: 1 },
  { id: 'c', label: 'Celsius (°C)', kind: 'temperature', factor: 1 },
]

export const KIND_LABELS: Record<UnitKind, string> = {
  volume: 'Volume',
  weight: 'Weight',
  temperature: 'Temperature',
}

export function unitById(id: string): Unit {
  const unit = UNITS.find((u) => u.id === id)
  if (!unit) throw new Error(`Unknown unit "${id}"`)
  return unit
}

/** Converts between two units of the same kind. Volume and weight are never mixed. */
export function convert(value: number, fromId: string, toId: string): number {
  const from = unitById(fromId)
  const to = unitById(toId)
  if (from.kind !== to.kind) throw new Error(`Cannot convert ${from.kind} to ${to.kind}`)
  if (from.kind === 'temperature') {
    if (from.id === to.id) return value
    return from.id === 'f' ? ((value - 32) * 5) / 9 : (value * 9) / 5 + 32
  }
  return (value * from.factor) / to.factor
}

/** Four significant figures is plenty for a kitchen. */
export function formatAmount(n: number): string {
  return String(Number(n.toPrecision(4)))
}
