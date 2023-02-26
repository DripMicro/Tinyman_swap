/* eslint-disable prettier/prettier */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import { red } from '@material-ui/core/colors';
import useSettings from '../hooks/useSettings';
import Swap from './Swap';

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
  avatar: {
    backgroundColor: red[500]
  }
}));


export default function CardSwap(props) {
  const { themeMode } = useSettings();
  const classes = useStyles();
  return (
    <Card className={classes.root} style={{ background: themeMode === 'dark' ? '#232323' : '#fff' }}>
      <div className="widget_parent">
        <Swap pera={props.pera} address={props.address} setAddress={props.setAddress} />
      </div>
    </Card>
  );
}
