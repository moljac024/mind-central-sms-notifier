import * as React from 'react';
import {StyleSheet} from 'react-native';
import {Modal, Portal, Button, IconButton, useTheme} from 'react-native-paper';

import {DB} from '../modules/db';

const styles = StyleSheet.create({
  button: {
    marginBottom: 8,
  },
});

export const DevHelper = () => {
  const [visible, setVisible] = React.useState(false);
  const theme = useTheme();

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const containerStyle = {backgroundColor: 'white', padding: 20};

  if (__DEV__ === false) {
    return null;
  }

  return (
    <>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={containerStyle}>
          <>
            <Button
              style={styles.button}
              mode="contained"
              onPress={async () => {
                DB.getDatabaseVersion();
              }}>
              Get db version
            </Button>

            <Button
              style={styles.button}
              mode="contained"
              onPress={async () => {
                DB.initializeDatabase();
              }}>
              Run migrations
            </Button>

            <Button
              style={styles.button}
              mode="contained"
              onPress={async () => {
                DB.resetDatabaseForDevelopment();
              }}>
              Reset database
            </Button>
          </>
        </Modal>
      </Portal>

      <IconButton
        icon="developer-board"
        iconColor={theme.colors.secondary}
        size={20}
        onPress={showModal}
      />
    </>
  );
};
