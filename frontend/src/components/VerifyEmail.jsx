// VerifyEmail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const VerifyEmail = () => {
  const { token } = useParams();

  console.log(token);
  
  const navigate = useNavigate();
  const [message, setMessage] = useState('Verifying your email...');
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Make PATCH request to your backend
        const response = await axios.patch(
          `${process.env.VITE_API_URL}/users/verify-email/${token}`
        );

        setIsSuccess(true);
        setMessage('Email verified successfully! Redirecting to login...');
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);

      } catch (error) {
        setIsSuccess(false);
        setMessage(
          error.response?.data?.message || 
          'Verification failed. The link may have expired.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      verifyEmail();
    }
  }, [token, navigate]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      padding: '20px'
    }}>
      <div style={{ 
        textAlign: 'center',
        padding: '40px',
        border: `2px solid ${isSuccess ? 'green' : isLoading ? 'blue' : 'red'}`,
        borderRadius: '10px',
        maxWidth: '500px'
      }}>
        {isLoading ? (
          <div>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
            <h2>Verifying Your Email</h2>
            <p>{message}</p>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>
              {isSuccess ? '✅' : '❌'}
            </div>
            <h2>{isSuccess ? 'Verification Successful!' : 'Verification Failed'}</h2>
            <p>{message}</p>
            {!isSuccess && (
              <button 
                onClick={() => navigate('/resend-verification')}
                style={{
                  background: '#4F46E5',
                  color: 'white',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  marginTop: '20px'
                }}
              >
                Resend Verification Email
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;