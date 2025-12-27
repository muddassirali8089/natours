// Create a shared CSS template function
export const getPageStyles = () => `
  <style>
    /* Modern Reset & Base Styles */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      line-height: 1.6;
      color: #333;
    }
    
    /* Main Container */
    .auth-container {
      background: white;
      border-radius: 16px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      padding: 40px;
      width: 100%;
      max-width: 480px;
      position: relative;
      overflow: hidden;
    }
    
    /* Header with Logo */
    .auth-header {
      text-align: center;
        margin:0px;
      position: relative;
    }
    
    .logo {
      font-size: 32px;
      font-weight: 700;
      color: #55c57a;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }
    
    .logo-icon {
      font-size: 36px;
    }
    
    .auth-title {
      font-size: 24px;
      font-weight: 600;
      color: #2d3436;
      margin-bottom: 8px;
    }
    
    .auth-subtitle {
      color: #636e72;
      font-size: 15px;
      margin: 0px;
    }
    
    /* Status Messages */
    .status-message {
      padding: 16px;
      border-radius: 10px;
      margin-bottom: 24px;
      display: flex;
      align-items: center;
      gap: 12px;
      animation: slideIn 0.3s ease;
    }
    
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .status-message.error {
      background: linear-gradient(135deg, #ffe6e6 0%, #ffcccc 100%);
      border-left: 4px solid #ff4757;
      color: #d63031;
    }
    
    .status-message.success {
      background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
      border-left: 4px solid #00b894;
      color: #155724;
    }
    
    .status-message.warning {
      background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
      border-left: 4px solid #fdcb6e;
      color: #856404;
    }
    
    .status-icon {
      font-size: 24px;
      flex-shrink: 0;
    }
    
    /* Form Styles */
    .auth-form {
      margin-top: 24px;
    }
    
    .form-group {
      margin-bottom: 24px;
    }
    
    .form-label {
      display: block;
      font-weight: 500;
      margin-bottom: 8px;
      color: #2d3436;
      font-size: 15px;
    }
    
    .form-input {
      width: 100%;
      padding: 14px 16px;
      border: 2px solid #dfe6e9;
      border-radius: 10px;
      font-size: 16px;
      transition: all 0.3s ease;
      background: #f8f9fa;
    }
    
    .form-input:focus {
      outline: none;
      border-color: #55c57a;
      background: white;
      box-shadow: 0 0 0 3px rgba(85, 197, 122, 0.1);
    }
    
    .form-input::placeholder {
      color: #b2bec3;
    }
    
    .form-help {
      display: block;
      font-size: 13px;
      color: #636e72;
      margin-top: 6px;
    }
    
    /* Button Styles */
    .auth-button {
      width: 100%;
      padding: 16px;
      background: linear-gradient(135deg, #55c57a 0%, #2e864b 100%);
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      margin-top: 8px;
    }
    
    .auth-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(85, 197, 122, 0.3);
    }
    
    .auth-button:active {
      transform: translateY(0);
    }
    
    .auth-button:disabled {
      background: #b2bec3;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }
    
    /* Footer */
    .auth-footer {
      margin-top: 32px;
      padding-top: 20px;
      border-top: 1px solid #dfe6e9;
      text-align: center;
      color: #636e72;
      font-size: 14px;
    }
    
    .auth-footer a {
      color: #55c57a;
      text-decoration: none;
      font-weight: 500;
    }
    
    .auth-footer a:hover {
      text-decoration: underline;
    }
    
    /* Responsive */
    @media (max-width: 480px) {
      .auth-container {
        padding: 24px;
        border-radius: 12px;
      }
      
      .auth-title {
        font-size: 20px;
      }
      
      .form-input {
        padding: 12px 14px;
      }
      
      .auth-button {
        padding: 14px;
      }
    }
    
    /* Success Page Specific */
    .success-container {
      text-align: center;
    
    }
    
    .success-icon {
      font-size: 64px;
      color: #00b894;
      
      animation: bounce 1s ease;
    }
    
    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
      40% {transform: translateY(-20px);}
      60% {transform: translateY(-10px);}
    }
    
    .success-title {
      font-size: 28px;
      color: #00b894;
      margin-bottom: 16px;
      font-weight: 600;
    }
    
    .success-message {
      color: #636e72;
      font-size: 16px;
      margin-bottom: 32px;
      max-width: 320px;
      margin-left: auto;
      margin-right: auto;
    }
    
    /* Error Page Specific */
    .error-container {
      text-align: center;
    }
    
    .error-icon {
      font-size: 48px;
      color: #ff4757;
    }
    
    .error-title {
      font-size: 28px;
      color: #ff4757;
      margin-bottom: 16px;
      font-weight: 600;
    }
    
    .error-message {
      color: #636e72;
      font-size: 16px;
      margin-bottom: 32px;
      max-width: 320px;
      margin-left: auto;
      margin-right: auto;
    }
  </style>
`;