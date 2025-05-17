// utils/getCronDescription.ts
"use client";
import cronstrue from "cronstrue";
import "cronstrue/locales/vi";
import "cronstrue/locales/en"; // hoặc các ngôn ngữ bạn cần

/**
 * Converts a cron expression to a human-readable description
 * in the user's current locale.
 *
 * @param cron - A standard 5-part cron expression (no seconds).
 * @param locale - A BCP 47 language tag (e.g., 'vi', 'en').
 */
export function getCronDescription(
  cron: string,
  locale: string = "vi"
): string {
  try {
    return cronstrue.toString(cron, {
      locale,
      use24HourTimeFormat: true,
    });
  } catch {
    return locale === "vi"
      ? "Chuỗi cron không hợp lệ"
      : "Invalid cron expression";
  }
}
