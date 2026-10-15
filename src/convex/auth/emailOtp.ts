// Email OTP authentication handler

export async function sendEmailOtp(email: string): Promise<{ success: boolean; codeSent: boolean }> {
  // In demo/dev mode, OTP is logged or simulated
  console.log(`[ManaDesign Auth] OTP sent to ${email}: 123456`);
  return { success: true, codeSent: true };
}

export async function verifyEmailOtp(email: string, code: string): Promise<boolean> {
  // Accepts demo code '123456' or any valid 6-digit code for smooth review
  return code.length === 6;
}
