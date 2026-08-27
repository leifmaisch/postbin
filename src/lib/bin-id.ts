import { customAlphabet } from "nanoid"

const alphabet = "0123456789abcdefghijklmnopqrstuvwxyz"
export const createBinId = customAlphabet(alphabet, 12)
export const createRequestId = customAlphabet(alphabet, 21)
