import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Tooltip } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
        color: 'white'
    },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const FullScreenDialog = ({ schemaOBJ, closeModal, save }) => {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    const keys = Object.keys(schemaOBJ)

    return (

        <Dialog fullScreen open={true} onClose={closeModal} TransitionComponent={Transition}>
            <AppBar className={classes.appBar}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={closeModal} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        This is how your schema looks like
            </Typography>
                    <Button autoFocus color="inherit" onClick={save}>
                        save
                     </Button>
                </Toolbar>
            </AppBar>
            <div style={{ padding: 50,overflow:'auto' }}>
                <TableContainer  component={Paper}>
                    <Table className={classes.table} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                {keys?.map(key => {
                                    let shortKeyName = key?.length > 30 ? key.substring(0, 15) + "..." + key.substring(key.length - 15, key.length) : key
                                    return (
                                        <TableCell align="right">
                                           <Tooltip title={key||" "} arrow >
                                                <span> {shortKeyName}</span>
                                                </Tooltip>
                                        </TableCell>
                                    )
                                })
                                }
                            </TableRow>
                        </TableHead>
                        <TableBody>

                            <TableRow>

                                {keys?.map(key =>
                                    <TableCell align="right">{schemaOBJ?.[key]}</TableCell>
                                )
                                }


                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </Dialog>

    );
}
export default FullScreenDialog