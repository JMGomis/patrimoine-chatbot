import React, { useState } from 'react';
import Chat from './components/Chat';
import UserProfile from './components/UserProfile';
import styled from 'styled-components';

const AppContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

const Sidebar = styled.div`
  width: 300px;
  padding: 20px;
  background-color: #343a40;
  color: white;
`;

const MainContent = styled.div`
  flex: 1;
  padding: 20px;
`;

const LoginButton = styled.button`
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 20px;

  &:hover {
    background-color: #218838;
  }
`;

const App = () => {
  const [userId, setUserId] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  const handleLogin = (user) => {
    setUserId(user);
    // Mock profile data - in a real app, this would come from your backend
    const profiles = {
      'user1': { age: 35, income: 75000, riskTolerance: 'moderate', goals: ['retirement', 'buy house'] },
      'user2': { age: 28, income: 50000, riskTolerance: 'aggressive', goals: ['start business'] }
    };
    setUserProfile(profiles[user] || { age: 40, income: 60000, riskTolerance: 'neutral', goals: [] });
  };

  return (
    <AppContainer>
      <Sidebar>
        <h2>Gestion de Patrimoine</h2>
        {userId ? (
          <>
            <p>Connecté en tant que <strong>{userId}</strong></p>
            <UserProfile profile={userProfile} />
          </>
        ) : (
          <>
            <p>Veuillez vous connecter</p>
            <LoginButton onClick={() => handleLogin('user1')}>Connexion User 1</LoginButton>
            <LoginButton onClick={() => handleLogin('user2')}>Connexion User 2</LoginButton>
          </>
        )}
      </Sidebar>
      <MainContent>
        {userId ? (
          <Chat userId={userId} />
        ) : (
          <div>
            <h2>Bienvenue sur votre gestionnaire de patrimoine intelligent</h2>
            <p>Veuillez vous connecter pour commencer.</p>
          </div>
        )}
      </MainContent>
    </AppContainer>
  );
};

export default App;