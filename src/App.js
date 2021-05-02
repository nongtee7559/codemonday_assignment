import React, { useState, useEffect } from 'react';
import { createMuiTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import './App.css';
import { Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel, TextField } from '@material-ui/core';
const theme = createMuiTheme({
  typography: {
    fontFamily: '"Segoe UI"',
  }
});
const useStyles = makeStyles(theme => ({
  root: {
    '& label.Mui-focused': {
      color: 'white',
    },
    '& .MuiInput-underline:after ': {
      borderBottomColor: 'white',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'white',
      },
      '&:hover fieldset': {
        borderColor: 'white',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'white',
      },
    },
  },
  title: {
    flexGrow: 1,
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#192640',
    borderRadius: '30px',
    padding: '20px'
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '30px',
    backgroundColor: '#324C7E',
    color: 'white',
    overflowY: 'auto',
  },
  table: {
    maxHeight: '50vh',
    backgroundColor: 'white',
    margin: '10px'
  },
  search: {
    color: 'white'
  }
}));

const getData = () => {
  return fetch('https://api.covid19api.com/summary')
    .then(results => results.json());
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}
function getNumber(labelValue) {
  // Nine Zeroes for Billions
  return Math.abs(Number(labelValue)) >= 1.0e+9

    ? (Math.abs(Number(labelValue)) / 1.0e+9).toFixed(2) + "B"
    // Six Zeroes for Millions 
    : Math.abs(Number(labelValue)) >= 1.0e+6

      ? (Math.abs(Number(labelValue)) / 1.0e+6).toFixed(2) + "M"
      // Three Zeroes for Thousands
      : Math.abs(Number(labelValue)) >= 1.0e+3

        ? (Math.abs(Number(labelValue)) / 1.0e+3).toFixed(2) + "K"

        : Math.abs(Number(labelValue));
}

const App = () => {
  const classes = useStyles();
  const [global, setGlobal] = useState({});
  const [countries, setCountries] = useState([]);
  const [searchCountries, setSearchCountries] = useState([]);
  const [orderBy, setOrderBy] = useState('asc');
  const [valueToOrderBy, setValueToOrderBy] = useState('TotalConfirmed');

  useEffect(() => {
    getData().then(response => {
      setGlobal(response.Global);
      setCountries(response.Countries);
      setSearchCountries(response.Countries);
    });
  }, []);

  const handleRequestSort = (property) => {
    const isAsc = valueToOrderBy === property && orderBy === 'asc';
    setOrderBy(isAsc ? 'desc' : 'asc');
    setValueToOrderBy(property);
  };

  const searchChangeHandler = (e) => {
    var filter = countries.filter((el) => el.Country.toLowerCase().includes(e.target.value));
    setSearchCountries(filter);
  }

  return (
    <div className='App'>
      <div className={classes.root}>
        <ThemeProvider theme={theme}>
          <Container className={classes.container}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography align="right" >
                  Last updated: {new Date(global?.Date).toLocaleDateString()}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper className={classes.paper}>
                  <Typography variant="h5">Confirmed</Typography>
                  <Typography variant="h3">{getNumber(global?.TotalConfirmed)}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper className={classes.paper}>
                  <Typography variant="h5">Recovered</Typography>
                  <Typography variant="h3">{getNumber(global?.TotalRecovered)}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper className={classes.paper}>
                  <Typography variant="h5">Deaths</Typography>
                  <Typography variant="h3">{getNumber(global?.TotalDeaths)}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper className={classes.paper}>
                  <TextField InputProps={{ className: classes.search }}
                    InputLabelProps={{ className: classes.search }}
                    fullWidth
                    label="Search Country"
                    onChange={searchChangeHandler} />
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <TableCell>No.</TableCell>
                        <TableCell>Country</TableCell>
                        <TableCell key='TotalConfirmed'>
                          <TableSortLabel
                            active={valueToOrderBy === 'TotalConfirmed'}
                            direction={valueToOrderBy === 'TotalConfirmed' ? orderBy : 'asc'}
                            onClick={() => handleRequestSort('TotalConfirmed')}
                          >
                            Total Confirmed Cases
                          </TableSortLabel>
                        </TableCell>
                        <TableCell key='TotalDeaths'>
                          <TableSortLabel
                            active={valueToOrderBy === 'TotalDeaths'}
                            direction={valueToOrderBy === 'TotalDeaths' ? orderBy : 'asc'}
                            onClick={() => handleRequestSort('TotalDeaths')}
                          >
                            Total Deaths Cases
                          </TableSortLabel>
                        </TableCell>
                        <TableCell key='TotalRecovered'>
                          <TableSortLabel
                            active={valueToOrderBy === 'TotalRecovered'}
                            direction={valueToOrderBy === 'TotalRecovered' ? orderBy : 'asc'}
                            onClick={() => handleRequestSort('TotalRecovered')}
                          >
                            Total Recoverd cases
                          </TableSortLabel>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {stableSort(searchCountries, getComparator(orderBy, valueToOrderBy))
                        .map((data, index) => (
                          <TableRow key={`row${index}`}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{data?.Country}</TableCell>
                            <TableCell>{data?.TotalConfirmed == 0 ? 'unreported' : data?.TotalConfirmed}</TableCell>
                            <TableCell>{data?.TotalDeaths == 0 ? 'unreported' : data?.TotalDeaths}</TableCell>
                            <TableCell>{data?.TotalRecovered == 0 ? 'unreported' : data?.TotalRecovered}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </ThemeProvider>
      </div>
    </div>
  )
}
export default App;
