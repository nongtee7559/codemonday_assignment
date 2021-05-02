import React, { useState, useEffect } from 'react';
import { createMuiTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import './App.css';
import { Table, TableBody, TableCell, TableContainer, TableRow, TextField } from '@material-ui/core';
// SVG
import { ReactComponent as VirusSvg } from "./asset/coronavirus.svg";
import { ReactComponent as DeathSvg } from "./asset/grave.svg";
import { ReactComponent as RecoverSvg } from "./asset/patient.svg";
import TableHeader from './components/TableHeader';
import CardHeader from './components/CardHeader';
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
  },
  ligthGray: {
    color: "#949EAF",
  },
  alignSelfCenter: {
    alignSelf: "center",
  },
  svgIcon: {
    height: "56px",
    width: "36px",
    transform: "scale(2)",
  },
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
  const [orderBy, setOrderBy] = useState('desc');
  const [valueToOrderBy, setValueToOrderBy] = useState('TotalConfirmed');
  const headCells = [
    { id: 'No', sortable: false, label: 'No.' },
    { id: 'Country', sortable: false, label: 'Country' },
    { id: 'TotalConfirmed', sortable: true, label: 'Total Confirmed Cases' },
    { id: 'TotalDeaths', sortable: true, label: 'Total Deaths Cases' },
    { id: 'TotalRecovered', sortable: true, label: 'Total Recovered Cases' },
  ];

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
                <Typography variant="h6" align="left">
                  <i>REPORT OF</i> {new Date(global?.Date).toLocaleDateString()}
                </Typography>
              </Grid>
              <CardHeader classes={classes} value={global?.TotalConfirmed} label='Confirmed'>
                <VirusSvg className={classes.svgIcon} />
              </CardHeader>
              <CardHeader classes={classes} value={global?.TotalDeaths} label='Deaths'>
                <DeathSvg className={classes.svgIcon} />
              </CardHeader>
              <CardHeader classes={classes} value={global?.TotalRecovered} label='Recovered'>
                <RecoverSvg className={classes.svgIcon} />
              </CardHeader>
              <Grid item xs={12}>
                <Paper className={classes.paper}>
                  <TextField InputProps={{ className: classes.search }}
                    InputLabelProps={{ className: classes.search }}
                    fullWidth
                    label="Search Country"
                    onChange={searchChangeHandler} />
                  <TableContainer className={classes.table}>
                    <Table>
                      <TableHeader
                        valueToOrderBy={valueToOrderBy}
                        orderBy={orderBy}
                        headCells={headCells}
                        handleRequestSort={handleRequestSort} />
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
                  </TableContainer>
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
