// Convex Auth Configuration
// Configures Email OTP and Anonymous authentication providers

export const authConfig = {
  providers: [
    {
      id: 'email-otp',
      name: 'Email OTP',
    },
    {
      id: 'anonymous',
      name: 'Guest / Anonymous',
    },
  ],
};
