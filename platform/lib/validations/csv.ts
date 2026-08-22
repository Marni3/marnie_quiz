import { z } from "zod";
import Papa from "papaparse";

export const csvRowSchema = z.object({
  question: z.string().trim().min(1, "Question prompt cannot be empty"),
  choice_a: z.string().trim().min(1, "Choice A cannot be empty"),
  choice_b: z.string().trim().min(1, "Choice B cannot be empty"),
  choice_c: z.string().trim().min(1, "Choice C cannot be empty"),
  choice_d: z.string().trim().min(1, "Choice D cannot be empty"),
  correct_answer: z
    .string()
    .trim()
    .toLowerCase()
    .refine((val) => ["a", "b", "c", "d"].includes(val), {
      message: 'correct_answer must be one of: "a", "b", "c", or "d"',
    })
    .transform((val) => val as "a" | "b" | "c" | "d"),
  explanation: z
    .string()
    .trim()
    .optional()
    .nullable()
    .transform((val) => (val && val.length > 0 ? val : null)),
  image_url: z
    .string()
    .trim()
    .optional()
    .nullable()
    .transform((val) => (val && val.length > 0 ? val : null)),
  interactive_url: z
    .string()
    .trim()
    .optional()
    .nullable()
    .transform((val) => (val && val.length > 0 ? val : null)),
  subject_tag: z
    .string()
    .trim()
    .optional()
    .nullable()
    .transform((val) => (val && val.length > 0 ? val : null)),
  archetype: z
    .string()
    .trim()
    .optional()
    .nullable()
    .transform((val) => (val && val.length > 0 ? val.toLowerCase() : "standard")),
  micro_cluster: z
    .string()
    .trim()
    .optional()
    .nullable()
    .transform((val) => (val && val.length > 0 ? val : null)),
  is_anchor: z
    .union([z.boolean(), z.string()])
    .optional()
    .nullable()
    .transform((val) => {
      if (typeof val === "boolean") return val;
      if (typeof val === "string") {
        const lower = val.trim().toLowerCase();
        return lower === "true" || lower === "1" || lower === "yes";
      }
      return false;
    }),
});

export type ValidatedCsvRow = z.infer<typeof csvRowSchema>;

export interface CsvValidationResult {
  success: boolean;
  rows?: ValidatedCsvRow[];
  errors?: string[];
}

export function parseAndValidateCsv(csvText: string): CsvValidationResult {
  if (!csvText || !csvText.trim()) {
    return { success: false, errors: ["CSV content is empty."] };
  }

  const parsed = Papa.parse<Record<string, string>>(csvText, {
    header: true,
    skipEmptyLines: "greedy",
  });

  if (parsed.errors && parsed.errors.length > 0) {
    return {
      success: false,
      errors: parsed.errors.map((e) => `CSV syntax error: ${e.message}`),
    };
  }

  const fields = parsed.meta.fields || [];
  const required = [
    "question",
    "choice_a",
    "choice_b",
    "choice_c",
    "choice_d",
    "correct_answer",
  ];
  const missingHeaders = required.filter((r) => !fields.includes(r));

  if (missingHeaders.length > 0) {
    return {
      success: false,
      errors: [
        `Missing required column header(s): ${missingHeaders.map((h) => `"${h}"`).join(", ")}`,
      ],
    };
  }

  const validatedRows: ValidatedCsvRow[] = [];
  const rowErrors: string[] = [];

  parsed.data.forEach((row, idx) => {
    const rowNum = idx + 2; // header is row 1
    const result = csvRowSchema.safeParse(row);

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        rowErrors.push(`Row ${rowNum}: ${issue.message}`);
      });
    } else {
      validatedRows.push(result.data);
    }
  });

  if (rowErrors.length > 0) {
    return { success: false, errors: rowErrors };
  }

  if (validatedRows.length === 0) {
    return {
      success: false,
      errors: ["No question rows found in the CSV file."],
    };
  }

  return { success: true, rows: validatedRows };
}
