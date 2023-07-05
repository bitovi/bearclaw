export default {
  name: 'authForm',
  type: 'document',
  title: 'AuthenticationForms',
  fields: [
    {
      name: 'needHelp',
      title: 'Need Help?',
      type: 'array',
      of: [{type: 'block'}],
    },
    {
      name: 'loginSubHeader',
      title: 'Login Subheader',
      type: 'string',
    },
    {
      name: 'joinSubHeader',
      title: 'Join Subheader',
      type: 'string',
    },
    {
      name: 'email',
      title: 'Email label',
      type: 'string',
    },
    {
      name: 'password',
      title: 'Password label',
      type: 'string',
    },
    {
      name: 'rememberMe',
      title: 'Remember me label',
      type: 'string',
    },
    {
      name: 'createAccountButton',
      title: 'Create account button',
      type: 'string',
    },
    {
      name: 'login',
      title: 'Login button',
      type: 'string',
    },
    {
      name: 'noAccountMessage',
      title: "Don't have an account message",
      type: 'string',
    },
    {
      name: 'noAccountLoginLink',
      title: "Don't have an account sign up link",
      type: 'string',
    },
    {
      name: 'existingAccountMessage',
      title: 'Existing account message',
      type: 'string',
    },
    {
      name: 'existingAccountLoginLink',
      title: 'Existing account login link',
      type: 'string',
    },
    {
      name: 'forgotPasswordLink',
      title: 'Forgot password link',
      type: 'string',
    },
    {
      name: 'alreadyKnowPasswordMessage',
      title: 'Already know password message',
      type: 'string',
    },
    {
      name: 'alreadyKnowPasswordLink',
      title: 'Already know password login link',
      type: 'string',
    },
    {
      name: 'sendPasswordReset',
      title: 'Send password reset button',
      type: 'string',
    },
    {
      name: 'joinAcceptTermsLabel',
      title: 'Join form accept terms label',
      type: 'array',
      of: [{type: 'block'}],
    },
    {
      name: 'loginWithGithub',
      title: 'Login with Github',
      type: 'string',
    },
    {
      name: 'signUpWithGithub',
      title: 'Sign Up with Github',
      type: 'string',
    },
    {
      name: 'checkYourEmail',
      title: 'Please Check your email',
      type: 'string',
    },
    {
      name: 'verifyEmailInstructionPart1',
      title: "We've emailed ... to [email]",
      type: 'string',
    },
    {
      name: 'verifyEmailInstructionPart2',
      title: 'please enter the code...',
      type: 'string',
    },
    {
      name: 'verifyEmailButton',
      title: 'Verify Button CTA',
      type: 'string',
    },
    {
      name: 'dontHaveCode',
      title: "Don't Have a code?",
      type: 'string',
    },
    {
      name: 'resendCode',
      title: 'Resend Code Link',
      type: 'string',
    },
    {
      name: 'returnToSignInCTA',
      title: 'Return to Sign In CTA',
      type: 'string',
    },
  ],
}
