export type Unit = 'mm' | 'cm' | 'm' | 'in' | 'ft' | 'ftin' | 'mcm';

export const unitShortLabels: Record<Unit, string> = {
  mm: 'mm',
  cm: 'cm',
  m: 'm',
  in: 'in',
  ft: 'ft',
  ftin: 'ft|in',
  mcm: 'm|cm',
};

export function convertToInches(value: number, unit: Unit): number {
  switch (unit) {
    case 'mm': return value / 25.4;
    case 'cm': return value / 2.54;
    case 'm': return value * 39.3701;
    case 'in': return value;
    case 'ft': return value * 12;
    default: return value;
  }
}

export function convertToFeet(value: number, unit: Unit, extra: number = 0): number {
  switch (unit) {
    case 'mm': return value / 304.8;
    case 'cm': return value / 30.48;
    case 'm': return value * 3.28084;
    case 'in': return value / 12;
    case 'ft': return value;
    case 'ftin': return value + extra / 12;
    case 'mcm': return value + (extra / 100) * 3.28084;
    default: return value;
  }
}

export function calculateBoardFeet(
  thickness: number,
  thicknessUnit: Unit,
  width: number,
  widthUnit: Unit,
  widthExtra: number,
  length: number,
  lengthUnit: Unit,
  lengthExtra: number
): number {
  const tIn = convertToInches(thickness, thicknessUnit);
  const wIn = (widthUnit === 'ftin')
    ? convertToInches(width, 'ft') + convertToInches(widthExtra, 'in')
    : (widthUnit === 'mcm')
      ? convertToInches(width, 'm') + convertToInches(widthExtra, 'cm')
      : convertToInches(width, widthUnit);
  let lFt = 0;
  if (lengthUnit === 'ftin') lFt = convertToFeet(length, 'ftin', lengthExtra);
  else if (lengthUnit === 'mcm') lFt = convertToFeet(length, 'mcm', lengthExtra);
  else lFt = convertToFeet(length, lengthUnit);
  return (tIn * wIn * lFt) / 12;
}

