export interface GuestbookEntryInput {
  name: string
  message: string
}

export type ValidationResult = { valid: true } | { valid: false; error: string }

const MAX_NAME_LENGTH = 50
const MAX_MESSAGE_LENGTH = 300

export function validateGuestbookEntry(input: GuestbookEntryInput): ValidationResult {
  if (!input.name?.trim() || !input.message?.trim()) {
    return { valid: false, error: 'name과 message는 필수입니다.' }
  }
  if (input.name.length > MAX_NAME_LENGTH) {
    return { valid: false, error: `name은 ${MAX_NAME_LENGTH}자를 넘을 수 없습니다.` }
  }
  if (input.message.length > MAX_MESSAGE_LENGTH) {
    return { valid: false, error: `message는 ${MAX_MESSAGE_LENGTH}자를 넘을 수 없습니다.` }
  }
  return { valid: true }
}
