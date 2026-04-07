/**
 * Shared form constants — single source of truth for both
 * UploadReport.jsx and FacultyReports.jsx (EditModal).
 * Update here and both forms stay in sync automatically.
 */

export const DEPARTMENTS = [
  'FY B. Tech.',
  'Computer Engineering (CE)',
  'Information Technology (IT)',
  'Electronics and Telecommunication Engineering (ENTC)',
  'Artificial Intelligence and Data Science (AIDS)',
  'Electronics and Computer Engineering (ECE)',
];

/**
 * Generates academic year options from 1992-93 up to the
 * next academic year relative to the current calendar year.
 * e.g. if today is 2026 → last option is "2026-27".
 * Runs at module load time so it's always up to date.
 */
function generateAcademicYears() {
  const startYear = 1992;
  const currentYear = new Date().getFullYear();
  // Include the year that starts in the current calendar year (e.g. 2026 → "2026-27")
  const endYear = currentYear;
  const years = [];
  for (let y = endYear; y >= startYear; y--) {
    years.push(`${y}-${String(y + 1).slice(-2)}`);
  }
  return years; // descending — most recent first
}

export const ACADEMIC_YEARS = generateAcademicYears();
