import { useState, useEffect, ChangeEvent, MouseEvent } from 'react';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import { blue } from '@material-ui/core/colors';
import SwapVertIcon from '@material-ui/icons/SwapVert';
import IconButton from '@material-ui/core/IconButton';
import useSettings from '../hooks/useSettings';
// import { fixedInput } from '../operation/swap/fixedInput';
import Account from './Account';

const tokenlist = [
  { tokenName: 'Algorand', tokenNumber: 0, tokenImage: 'https://asa-list.tinyman.org/assets/0/icon.png' },
  { tokenName: 'USDC', tokenNumber: 31566704, tokenImage: 'https://asa-list.tinyman.org/assets/31566704/icon.png' }
];

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary
  },
  avatar: {
    backgroundColor: blue[100],
    color: blue[600]
  },
  label: {
    padding: theme.spacing(3)
  },
  assets: {
    padding: theme.spacing(1)
  },
  assetInput: {
    textAlign: 'right',
    fontSize: '20px',
    width: '200px',
    padding: '10px',
    background: 'none',
    border: 'none',
    marginTop: '6px'
  },
  smallIcon: {
    textAlign: 'center',
    paddingTop: '0px'
  },
  connectButton: {
    marginTop: '30px'
  }
}));

export default function PeraWalletConnection() {
  const classes = useStyles();
  const { themeMode } = useSettings();
  const [openAsset1, setOpenAsset1] = useState(false);
  const [openAsset2, setOpenAsset2] = useState(false);
  const [selectedAsset1TokenName, setSelectedAsset1TokenName] = useState(tokenlist[0].tokenName);
  const [selectedAsset1TokenNumber, setSelectedAsset1TokenNumber] = useState(tokenlist[0].tokenNumber);
  const [selectedAsset1TokenImage, setSelectedAsset1TokenImage] = useState(tokenlist[0].tokenImage);

  const [selectedAsset2TokenName, setSelectedAsset2TokenName] = useState(tokenlist[1].tokenName);
  const [selectedAsset2TokenNumber, setSelectedAsset2TokenNumber] = useState(tokenlist[1].tokenNumber);
  const [selectedAsset2TokenImage, setSelectedAsset2TokenImage] = useState(tokenlist[1].tokenImage);
  const [assetAmount1, setAssetAmount1] = useState('');
  const [assetAmount2, setAssetAmount2] = useState('');

  //   const [accountAddress, setAccountAddress] = useState<string | null>(null);
  //   const [inputValue, setInputValue] = useState('');

  const handleClickOpenAsset1 = () => {
    setOpenAsset1(true);
  };

  const handleClickOpenAsset2 = () => {
    setOpenAsset2(true);
  };

  const asset1HandleClose = (name: string, num: number, image: string) => {
    setOpenAsset1(false);
    setSelectedAsset1TokenName(name);
    setSelectedAsset1TokenNumber(num);
    setSelectedAsset1TokenImage(image);
  };

  const asset2HandleClose = (name: string, num: number, image: string) => {
    setOpenAsset2(false);
    setSelectedAsset2TokenName(name);
    setSelectedAsset2TokenNumber(num);
    setSelectedAsset2TokenImage(image);
  };

  const handleAsset1AmountChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setAssetAmount1(event.target.value);
    console.log(selectedAsset1TokenNumber);
    console.log(selectedAsset2TokenNumber);
    // await fixedInput({ asset_1: selectedAsset1TokenNumber, asset_2: selectedAsset2TokenNumber });
  };

  const handleAsset2AmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAssetAmount2(event.target.value);
  };

  //   const isConnectedToPeraWallet = !!accountAddress;
  //   const handleInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
  //     setInputValue(event.target.value);
  //     console.log(event.target.value);
  //     const account: string = accountAddress as string;
  //     const asset1 = '0';
  //     const asset2 = '523683256';
  //     // await fixedInputSwap({ account, asset_1: asset1, asset_2: asset2 });
  //   };

  //   const handleClick = (event: MouseEvent) => {
  //     console.log('Submit button clicked!');
  //   };

  return (
    <div className={classes.root}>
      <Grid container className={classes.label} spacing={3}>
        <Grid item xs>
          From
        </Grid>
      </Grid>
      {/* Asset1 */}
      <Grid container className={classes.assets} spacing={3}>
        <Grid item xs>
          <Button
            onClick={handleClickOpenAsset1}
            variant="contained"
            sx={{
              fontFamily: 'Poppins',
              width: { xs: 'auto', md: 'auto' },
              fontWeight: 500,
              borderRadius: '8px',
              boxShadow: 'none',
              background: themeMode === 'dark' ? '#232323' : 'white',
              color: themeMode === 'dark' ? 'white' : '#232323',
              padding: '0px',
              '&:hover': {
                background: themeMode === 'dark' ? '#232323' : 'white',
                opacity: '90%'
              }
            }}
          >
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <img src={selectedAsset1TokenImage} alt={selectedAsset1TokenName} />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={selectedAsset1TokenName} />
            </ListItem>
          </Button>
          <SimpleDialog
            selectedAssetTokenName={selectedAsset1TokenName}
            selectedAssetTokenNumber={selectedAsset1TokenNumber}
            selectedAssetTokenImage={selectedAsset1TokenImage}
            open={openAsset1}
            onClose={asset1HandleClose}
          />
        </Grid>
        <Grid item xs>
          <input
            type="number"
            pattern="[0-9]*"
            className={classes.assetInput}
            placeholder="0.00"
            value={assetAmount1}
            onChange={handleAsset1AmountChange}
            style={{ color: themeMode === 'dark' ? 'white' : '#232323' }}
          />
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs className={classes.smallIcon}>
          <IconButton aria-label="swap">
            <SwapVertIcon fontSize="medium" />
          </IconButton>
        </Grid>
      </Grid>

      {/* Asset2 */}
      <Grid container className={classes.assets} spacing={3}>
        <Grid item xs>
          <Button
            onClick={handleClickOpenAsset2}
            variant="contained"
            sx={{
              fontFamily: 'Poppins',
              width: { xs: 'auto', md: 'auto' },
              fontWeight: 500,
              borderRadius: '8px',
              boxShadow: 'none',
              background: themeMode === 'dark' ? '#232323' : 'white',
              color: themeMode === 'dark' ? 'white' : '#232323',
              padding: '0px',
              '&:hover': {
                background: themeMode === 'dark' ? '#232323' : 'white',
                opacity: '90%'
              }
            }}
          >
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <img src={selectedAsset2TokenImage} alt={selectedAsset2TokenName} />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={selectedAsset2TokenName} />
            </ListItem>
          </Button>
          <SimpleDialog
            selectedAssetTokenName={selectedAsset2TokenName}
            selectedAssetTokenNumber={selectedAsset2TokenNumber}
            selectedAssetTokenImage={selectedAsset2TokenImage}
            open={openAsset2}
            onClose={asset2HandleClose}
          />
        </Grid>
        <Grid item xs>
          <input
            type="number"
            pattern="[0-9]*"
            className={classes.assetInput}
            placeholder="0.00"
            value={assetAmount2}
            onChange={handleAsset2AmountChange}
            style={{ color: themeMode === 'dark' ? 'white' : '#232323' }}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs className={classes.connectButton}>
          <Account width="100%" />
        </Grid>
      </Grid>
    </div>
  );
}

export interface SimpleDialogProps {
  open: boolean;
  selectedAssetTokenName: string;
  selectedAssetTokenNumber: number;
  selectedAssetTokenImage: string;
  onClose: (name: string, num: number, image: string) => void;
}

function SimpleDialog(props: SimpleDialogProps) {
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
