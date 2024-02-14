export type ExtractRecordValue<T> = T extends Record<string, infer U> ? U : never;
