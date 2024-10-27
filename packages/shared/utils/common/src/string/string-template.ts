/* -------------------------------------------------------------------------------------------------
 * STRING TEMPLATE UTILS
 * -----------------------------------------------------------------------------------------------*/

/**
 * Generates a tagging function for a given label and separator.
 */
/**
 * Generates a tag function for a given label and separator.
 * @param prefix The label to use.
 * @param separator The separator to use.
 * @returns The tag function - ex. `${label}${separator}${content}`
 *
 * @example
 * ```ts
 * // To create a tagging function for a prompt format:
 * const botTag = generateLabelTagFunction("{BOT}", ": ");
 * const example = botTag`Hello, how are you?`;
 * // Returns "{BOT}: Hello, how are you?"
 * ```
 */
export function generateLabelTagFunction(
  prefix: string,
  separator: string,
  suffix = "",
) {
  return (strings: TemplateStringsArray, ...values: unknown[]) => {
    const content = _formatContent(strings, ...values);
    return `${prefix}${separator}${content}${suffix}`;
  };
}

/**
 * Formats a template string with values.
 * @param strings The template string.
 * @param values The values to use.
 * @returns The formatted string.
 */
function _formatContent(
  strings: TemplateStringsArray,
  ...values: unknown[]
): string {
  // eslint-disable-next-line @typescript-eslint/restrict-plus-operands, @typescript-eslint/no-base-to-string
  return strings.reduce((acc, str, idx) => acc + str + (values[idx] || ""), "");
}
