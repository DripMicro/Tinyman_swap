import { useState, useEffect, ChangeEvent, MouseEvent } from 'react';
import { PeraWalletConnect } from '@perawallet/connect';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { Box, Typography, MenuItem, Tooltip } from '@material-ui/core';
import { blue } from '@material-ui/core/colors';
import SwapVertIcon from '@material-ui/icons/SwapVert';
import IconButton from '@material-ui/core/IconButton';
import useSettings from '../hooks/useSettings';
import { fixedInput } from '../operation/swap/fixedInput';
import { fixedInputSwap } from '../operation/swap/fixedInputSwap';
import { fixedOutput } from '../operation/swap/fixedOutput';
import { getAssetByID } from '../utils/accountUtils';
import TokenTemplate from './Swap/TokenTemplate';
import Account from './Account';

const tokenlist = [
  {
    tokenNumber: 0
  },
  {
    tokenNumber: 31566704
  },
  {
    tokenNumber: 388592191
  },
  {
    tokenNumber: 793124631
  },
  {
    tokenNumber: 571576867
  },
  {
    tokenNumber: 226701642
  }
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

export default function Swap() {
  const classes = useStyles();
  const { themeMode } = useSettings();
  const [openAsset1, setOpenAsset1] = useState(false);
  const [openAsset2, setOpenAsset2] = useState(false);

  const [selectedAsset1TokenName, setSelectedAsset1TokenName] = useState('Algorand');
  const [selectedAsset1TokenNumber, setSelectedAsset1TokenNumber] = useState(tokenlist[0].tokenNumber);
  const [selectedAsset1TokenUnitName, setSelectedAsset1TokenUnitName] = useState('ALGO');
  const [selectedAsset1TokenDecimal, setSelectedAsset1TokenDecimal] = useState(6);

  const [selectedAsset2TokenName, setSelectedAsset2TokenName] = useState('USDC');
  const [selectedAsset2TokenNumber, setSelectedAsset2TokenNumber] = useState(tokenlist[1].tokenNumber);
  const [selectedAsset2TokenUnitName, setSelectedAsset2TokenUnitName] = useState('USDC');
  const [selectedAsset2TokenDecimal, setSelectedAsset2TokenDecimal] = useState(6);

  const [assetAmount1, setAssetAmount1] = useState('');
  const [assetAmount2, setAssetAmount2] = useState('');

  // const [accountAddress, setAccountAddress] = useState('');
  const pera = new PeraWalletConnect();

  const [perawallet, setPerawallet] = useState<PeraWalletConnect>(pera);

  const [accountAddress, setAccountAddress] = useState<string | null>(null);
  //   const [inputValue, setInputValue] = useState('');

  const handleClickOpenAsset1 = () => {
    setOpenAsset1(true);
  };

  const handleClickOpenAsset2 = () => {
    setOpenAsset2(true);
  };

  const handleClickExchange = () => {
    asset1HandleClose(
      selectedAsset2TokenName,
      selectedAsset2TokenNumber,
      selectedAsset2TokenUnitName,
      selectedAsset2TokenDecimal,
      true
    );
    asset2HandleClose(
      selectedAsset1TokenName,
      selectedAsset1TokenNumber,
      selectedAsset1TokenUnitName,
      selectedAsset1TokenDecimal,
      true
    );
  };

  const handleSwap = () => {
    if (accountAddress && accountAddress.length > 0 && perawallet !== undefined) {
      console.log(accountAddress);
      fixedInputSwap({
        asset_1: selectedAsset1TokenNumber,
        asset_2: selectedAsset2TokenNumber,
        amount: assetAmount1,
        assetInDecimal: selectedAsset1TokenDecimal,
        assetOutDecimal: selectedAsset2TokenDecimal,
        account: accountAddress,
        perawallet
      });
    }
  };

  const asset1HandleClose = (name: string, num: number, unit: string, decimal: number, swap: boolean) => {
    if (num !== selectedAsset2TokenNumber || swap === true) {
      setOpenAsset1(false);
      setSelectedAsset1TokenNumber(num);
      if (num === 0) {
        setSelectedAsset1TokenDecimal(6);
        setSelectedAsset1TokenName('Algorand');
        setSelectedAsset1TokenUnitName('ALGO');
      } else {
        setSelectedAsset1TokenDecimal(decimal);
        setSelectedAsset1TokenName(name);
        setSelectedAsset1TokenUnitName(unit);
      }
      setAssetAmount1('0');
      setAssetAmount2('0');
    }
  };

  const asset2HandleClose = (name: string, num: number, unit: string, decimal: number, swap: boolean) => {
    if (num !== selectedAsset1TokenNumber || swap === true) {
      setOpenAsset2(false);
      setSelectedAsset2TokenName(name);
      setSelectedAsset2TokenNumber(num);
      setSelectedAsset2TokenUnitName(unit);
      if (num === 0) {
        setSelectedAsset2TokenDecimal(6);
        setSelectedAsset2TokenName('Algorand');
      } else {
        setSelectedAsset2TokenDecimal(decimal);
        setSelectedAsset2TokenName(name);
      }
      setAssetAmount1('0');
      setAssetAmount2('0');
    }
  };

  const handleAsset1AmountChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(selectedAsset1TokenNumber);
    setAssetAmount1(event.target.value);
    const asset2Amount: bigint = await fixedInput({
      asset_1: selectedAsset1TokenNumber,
      asset_2: selectedAsset2TokenNumber,
      amount: event.target.value,
      assetInDecimal: selectedAsset1TokenDecimal,
      assetOutDecimal: selectedAsset2TokenDecimal
    });
    setAssetAmount2((Number(asset2Amount) / 10 ** selectedAsset2TokenDecimal).toString());
  };

  const handleAsset2AmountChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setAssetAmount2(event.target.value);
    const asset1Amount: bigint = await fixedOutput({
      asset_1: selectedAsset1TokenNumber,
      asset_2: selectedAsset2TokenNumber,
      amount: event.target.value,
      assetInDecimal: selectedAsset1TokenDecimal,
      assetOutDecimal: selectedAsset2TokenDecimal
    });
    setAssetAmount1((Number(asset1Amount) / 10 ** selectedAsset1TokenDecimal).toString());
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
          <MenuItem sx={{ typography: 'body2', py: 1, px: 2.5 }} onClick={handleClickOpenAsset1}>
            <Box display="flex" alignItems="center" justifyContent="space-between" flexGrow={1}>
              <Box display="flex" alignItems="center">
                <Box
                  component="img"
                  src={`https://asa-list.tinyman.org/assets/${selectedAsset1TokenNumber}/icon.png`}
                  alt="Asset logo"
                  sx={{
                    mr: 2,
                    width: 40,
                    height: 40
                  }}
                />
                <Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="subtitle1" noWrap>
                      {selectedAsset1TokenName}
                    </Typography>
                    <Tooltip title="Trusted asset by Pera" arrow>
                      <Box
                        component="img"
                        src="/static/token/trust.svg"
                        alt="Asset logo"
                        sx={{
                          width: 16,
                          height: 16
                        }}
                      />
                    </Tooltip>
                  </Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                    ${selectedAsset1TokenUnitName} - {selectedAsset1TokenNumber}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </MenuItem>
          <SelectTokenDialog
            selectedAssetTokenName={selectedAsset1TokenName}
            selectedAssetTokenNumber={selectedAsset1TokenNumber}
            selectedAssetTokenUnitName={selectedAsset1TokenUnitName}
            selectedAssetTokenDecimal={selectedAsset1TokenDecimal}
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
          <IconButton aria-label="swap" onClick={handleClickExchange}>
            <SwapVertIcon fontSize="medium" />
          </IconButton>
        </Grid>
      </Grid>

      {/* Asset2 */}
      <Grid container className={classes.assets} spacing={3}>
        <Grid item xs>
          <MenuItem sx={{ typography: 'body2', py: 1, px: 2.5 }} onClick={handleClickOpenAsset2}>
            <Box display="flex" alignItems="center" justifyContent="space-between" flexGrow={1}>
              <Box display="flex" alignItems="center">
                <Box
                  component="img"
                  src={`https://asa-list.tinyman.org/assets/${selectedAsset2TokenNumber}/icon.png`}
                  alt="Asset logo"
                  sx={{
                    mr: 2,
                    width: 40,
                    height: 40
                  }}
                />
                <Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="subtitle1" noWrap>
                      {selectedAsset2TokenName}
                    </Typography>
                    <Tooltip title="Trusted asset by Pera" arrow>
                      <Box
                        component="img"
                        src="/static/token/trust.svg"
                        alt="Asset logo"
                        sx={{
                          width: 16,
                          height: 16
                        }}
                      />
                    </Tooltip>
                  </Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                    ${selectedAsset2TokenUnitName} - {selectedAsset2TokenNumber}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </MenuItem>
          <SelectTokenDialog
            selectedAssetTokenName={selectedAsset2TokenName}
            selectedAssetTokenNumber={selectedAsset2TokenNumber}
            selectedAssetTokenUnitName={selectedAsset2TokenUnitName}
            selectedAssetTokenDecimal={selectedAsset2TokenDecimal}
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
          {accountAddress && accountAddress.length > 0 ? (
            <Button
              onClick={handleSwap}
              variant="contained"
              className="bto"
              sx={{
                fontSize: { xs: '10px', md: '12px' },
                fontFamily: 'Poppins',
                width: { xs: '100%', md: '100%' },
                fontWeight: 500,
                borderRadius: '8px',
                boxShadow: 'none',
                background: themeMode === 'dark' ? 'white' : 'black',
                color: themeMode === 'dark' ? 'black' : 'white',
                padding: '8px 10px',
                '&:hover': {
                  background: themeMode === 'dark' ? 'white' : 'black',
                  opacity: '80%'
                }
              }}
            >
              Swap
            </Button>
          ) : (
            <Account width="100%" setAccountAddress={setAccountAddress} setPerawallet={setPerawallet} />
          )}
        </Grid>
      </Grid>
    </div>
  );
}

export interface SelectTokenDialogProps {
  open: boolean;
  selectedAssetTokenName: string;
  selectedAssetTokenNumber: number;
  selectedAssetTokenUnitName: string;
  selectedAssetTokenDecimal: number;
  onClose: (name: string, num: number, unit: string, decimal: number, swap: boolean) => void;
}

function SelectTokenDialog(props: SelectTokenDialogProps) {
  const classes = useStyles();
  const {
    onClose,
    selectedAssetTokenName,
    selectedAssetTokenNumber,
    selectedAssetTokenUnitName,
    selectedAssetTokenDecimal,
    open
  } = props;
  const [balanceList, setBalanceList] = useState<Array<{ params: any; tokenName: string; tokenNumber: number }>>([]);

  const handleClose = () => {
    onClose(
      selectedAssetTokenName,
      selectedAssetTokenNumber,
      selectedAssetTokenUnitName,
      selectedAssetTokenDecimal,
      false
    );
  };

  const handleListItemClick = (name: string, num: number, unit: string, decimal: number) => {
    onClose(name, num, unit, decimal, false);
  };

  const handleAssets = async () => {
    const newArr: any = await Promise.all(
      tokenlist.map(async (item) => {
        const assetInfo = await getAssetByID(item.tokenNumber);
        return {
          ...item,
          params: assetInfo.asset.params
        };
      })
    );
    setBalanceList(newArr);
    console.log(newArr);
  };

  useEffect(() => {
    handleAssets();
  }, []);

  return (
    <Dialog onClose={handleClose} aria-labelledby="form-dialog-title" open={open}>
      <DialogTitle id="form-dialog-title">Select an asset</DialogTitle>
      <DialogContent>
        <List>
          {balanceList.map((item: any) => (
            <MenuItem
              key={item['asset-id']}
              sx={{ typography: 'body2', py: 1, px: 2.5 }}
              onClick={() =>
                handleListItemClick(item.params.name, item.tokenNumber, item.params['unit-name'], item.params.decimals)
              }
            >
              <Box display="flex" alignItems="center" justifyContent="space-between" flexGrow={1}>
                <Box display="flex" alignItems="center">
                  <Box
                    component="img"
                    src={`https://asa-list.tinyman.org/assets/${item.tokenNumber}/icon.png`}
                    alt="Asset logo"
                    sx={{
                      mr: 2,
                      width: 24,
                      height: 24
                    }}
                  />
                  <Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="subtitle1" noWrap>
                        {item.tokenNumber === 0 ? 'Algorand' : item.params.name}
                      </Typography>
                      <Tooltip title="Trusted asset by Pera" arrow>
                        <Box
                          component="img"
                          src="/static/token/trust.svg"
                          alt="Asset logo"
                          sx={{
                            width: 16,
                            height: 16
                          }}
                        />
                      </Tooltip>
                    </Box>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                      {item.tokenNumber === 0 ? 'ALGO' : item.params['unit-name']}
                    </Typography>
                  </Box>
                </Box>
                <Box display="flex" alignItems="flex-end" justifyContent="center" flexDirection="column">
                  <Typography variant="body2" sx={{ color: 'text.secondary', ml: 10 }} noWrap>
                    {item.tokenNumber}
                  </Typography>
                </Box>
              </Box>
            </MenuItem>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
}
