export default {
  name: 'authForm',
  type: 'document',
  title: 'AuthenticationForms',
  fields: [
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
      name: 'createAccount',
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
      name: 'joinMessage',
      title: 'Join form message',
      type: 'string',
    },
    {
      name: 'joinAcceptTermsLabel',
      title: 'Join form accept terms label',
      type: 'array',
      of: [{type: 'block'}],
    },
  ],
}
