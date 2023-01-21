/* eslint-disable prettier/prettier */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import algosdk from "algosdk";
import useSettings from '../../hooks/useSettings';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 0,
    width: '450px',
    marginBottom: 50
  },
  media: {
    height: 0,
    paddingTop: '56.25%'
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: 'rotate(180deg)'
  },
}));


export default function Main(props) {
  const { themeMode } = useSettings();
  const classes = useStyles();

  const client = new algosdk.Algodv2('','https://testnet-api.algonode.cloud','',{'user-agent':'algo-sdk'});
//   const TinymanClient = new TinymanMainnetClient(client,props.accountAddress);
  
  return (
   <div>
    {props.accountAddress}
   </div>
  );
}
