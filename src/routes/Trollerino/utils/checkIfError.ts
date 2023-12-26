type PayloadWithError = {
  error?: string;
  message?: string;
};

export function checkIfError(payload: PayloadWithError) {
  if ("error" in payload) {
    throw new Error(payload.message);
  }
}
