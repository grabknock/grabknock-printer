import React, {useContext, useEffect} from 'react';
import {View} from 'react-native';
import {IconButton, Text, useTheme} from 'react-native-paper';
import {AuthContext} from '../../auth/AuthContext';
import {QueryClient} from '@tanstack/react-query';

interface AppHeaderProps {
  backButton?: boolean;
  backButtonHandler?: () => void;
  title: string;
  logoutButton?: boolean;
  navigation: any;
}

function AppHeader({
  backButton = false,
  backButtonHandler,
  title,
  logoutButton = true,
  navigation,
}: AppHeaderProps) {
  const theme = useTheme();
  const {authData, userLogout: userLogoutContext} = useContext(AuthContext);
  const queryClient = new QueryClient();

  // Redirect the user to login page if th auth data is null
  // to do: must be a better way to do this
  useEffect(() => {
    if (navigation != null && authData == null) {
      queryClient.cancelQueries().then(() => navigation.navigate('Login'));
    }
  }, [navigation, authData]);

  const handleBackButton = () => {
    if (backButtonHandler != undefined) {
      backButtonHandler();
    }
    navigation.goBack();
  };

  const handleLogoutButton = () => {
    userLogoutContext();
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 12,
      }}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {backButton && (
          <IconButton
            icon="arrow-left-thick"
            style={{
              backgroundColor: '#E5E7EB',
              borderRadius: 6,
              marginRight: 15,
            }}
            iconColor={theme.colors.primary}
            size={26}
            onPress={() => handleBackButton()}
          />
        )}
        <View>
          <Text
            variant="headlineMedium"
            style={{color: theme.colors.primary, fontWeight: 700}}>
            {title}
          </Text>
        </View>
      </View>
      <View>
        {logoutButton && (
          <IconButton
            icon="power-standby"
            style={{backgroundColor: '#FFCDC3', borderRadius: 6}}
            iconColor="#EA3829"
            size={26}
            onPress={() => handleLogoutButton()}
          />
        )}
      </View>
    </View>
  );
}

export default AppHeader;
