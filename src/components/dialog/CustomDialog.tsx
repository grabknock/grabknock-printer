import React from 'react';
import {View} from 'react-native';
import {ActivityIndicator, Button, Dialog, Portal, Text} from 'react-native-paper';


interface DialogProp {
    visible: boolean;
    hideDialog: () => void;
    title?: string;
    handleConfirm: (parameters: any) => void;
}

function CustomDialog({visible, hideDialog, title, handleConfirm} : DialogProp) {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={hideDialog}>
        {title && (<Dialog.Title>{title}</Dialog.Title>)}
        <Dialog.Actions>
          <Button onPress={() => hideDialog()}>Cancel</Button>
          <Button onPress={handleConfirm}>Ok</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

export default CustomDialog;
