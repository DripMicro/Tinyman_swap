import React from 'react';
import List from '@material-ui/core/List';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import { blue } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';

const useStyles = makeStyles((theme) => ({
  avatar: {
    backgroundColor: blue[100],
    color: blue[600]
  }
}));

const tokenlist = [
  { tokenName: 'Algorand', tokenNumber: 0, tokenImage: 'https://asa-list.tinyman.org/assets/0/icon.png' },
  { tokenName: 'USDC', tokenNumber: 31566704, tokenImage: 'https://asa-list.tinyman.org/assets/31566704/icon.png' }
];

export interface SelectTokenDialogProps {
  open: boolean;
  selectedAssetTokenName: string;
  selectedAssetTokenNumber: number;
  selectedAssetTokenImage: string;
  onClose: (name: string, num: number, image: string) => void;
}

export default function SelectTokenDialog(props: SelectTokenDialogProps) {
  const classes = useStyles();
  const { onClose, selectedAssetTokenName, selectedAssetTokenNumber, selectedAssetTokenImage, open } = props;

  const handleClose = () => {
    onClose(selectedAssetTokenName, selectedAssetTokenNumber, selectedAssetTokenImage);
  };

  const handleListItemClick = (name: string, num: number, image: string) => {
    onClose(name, num, image);
  };

  return (
    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
      <DialogTitle id="simple-dialog-title">Select an asset</DialogTitle>
      <List>
        {tokenlist.map((email) => (
          <ListItem
            button
            onClick={() => handleListItemClick(email.tokenName, email.tokenNumber, email.tokenImage)}
            key={email.tokenName}
          >
            <ListItemAvatar>
              <Avatar className={classes.avatar}>
                <img src={email.tokenImage} alt={email.tokenName} />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={email.tokenName} />
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
}
