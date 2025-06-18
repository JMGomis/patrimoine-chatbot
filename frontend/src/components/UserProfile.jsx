import React from 'react';
import styled from 'styled-components';

const ProfileContainer = styled.div`
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const ProfileItem = styled.div`
  margin-bottom: 10px;
`;

const UserProfile = ({ profile }) => {
  return (
    <ProfileContainer>
      <h3>Votre Profil</h3>
      <ProfileItem><strong>Âge:</strong> {profile.age}</ProfileItem>
      <ProfileItem><strong>Revenu annuel:</strong> {profile.income}€</ProfileItem>
      <ProfileItem><strong>Tolérance au risque:</strong> {profile.riskTolerance}</ProfileItem>
      <ProfileItem><strong>Objectifs:</strong> {profile.goals.join(', ') || 'Non spécifiés'}</ProfileItem>
    </ProfileContainer>
  );
};

export default UserProfile;