
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [passwordHash, setPasswordHash] = useState('');
  const [role, setRole] = useState('Student');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // Determine isActive based on the role
    const isActive = role === 'Admin' ? true : false;

    try {
      // Post request to the backend API
      await axios.post('http://localhost:5295/api/Auth/register', {
        name: name,
        email: email,
        passwordHash: passwordHash,
        role: role,
        isActive: isActive, // Adding the isActive field
      });

      // On success
      setSuccess('Registration successful! Awaiting admin approval.');
      setError('');

      // Navigate to the homepage after 2 seconds
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      // Log the error details for better debugging
      if (err.response) {
        console.error('Error response:', err.response.data);
        console.error('Status:', err.response.status);
        console.error('Headers:', err.response.headers);

        // Extract the error messages from the response
        const errorMessages = err.response.data.errors 
          ? Object.values(err.response.data.errors).flat().join(' ') 
          : 'Registration failed. Please try again.';
        setError(errorMessages);
      } else {
        // General error message for other cases
        setError('Network error occurred. Please try again later.');
      }
      setSuccess('');
    }
  };

  // Inline CSS styling
  const styles = {
    container: {
      maxWidth: '400px',
      margin: '0 auto',
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9',
      textAlign: 'center',
    },
    inputField: {
      width: '100%',
      padding: '10px',
      margin: '10px 0',
    },
    button: {
      width: '100%',
      padding: '10px',
      backgroundColor: '#4CAF50',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
    },
    errorText: {
      color: 'red',
      fontWeight: 'bold',
      marginTop: '10px',
    },
    successText: {
      color: 'green',
      fontWeight: 'bold',
      marginTop: '10px',
    },
  };

  return (
    <div style={styles.container}>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={styles.inputField}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.inputField}
        />
        <input
          type="password"
          placeholder="Password"
          value={passwordHash}
          onChange={(e) => setPasswordHash(e.target.value)}
          required
          style={styles.inputField}
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={styles.inputField}
        >
          <option value="Student">Student</option>
         
          <option value="Professor">Professor</option>
        </select>
        {error && <p style={styles.errorText}>{error}</p>}
        {success && <p style={styles.successText}>{success}</p>}
        <button type="submit" style={styles.button}>
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
