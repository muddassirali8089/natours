// utils/emailTemplates.js
export const verificationEmailTemplate = (verificationURL) => {
  return `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #333;">Verify Your Email Address</h2>
  <p>Please click the button below to verify your email address:</p>
  
  <a href="${verificationURL}" 
     style="background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 15px 0;">
    Verify Email
  </a>
  
  <p>This link will expire in 10 minutes.</p>
</div>
  `;
};