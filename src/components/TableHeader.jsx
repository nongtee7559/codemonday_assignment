import { TableCell, TableHead, TableRow, TableSortLabel } from '@material-ui/core'
import React from 'react'

const TableHeader = (props) => {
    const { valueToOrderBy, orderBy, headCells, handleRequestSort } = props;
    const createSortHandler = (property) => {
        handleRequestSort(property);
    }
    return (
        <TableHead>
            <TableRow>
                {
                    headCells.map((el) =>
                        !el.sortable
                            ? (<TableCell key={el.id}>{el.label}</TableCell>)
                            : (<TableCell key={el.id}>
                                <TableSortLabel
                                    active={valueToOrderBy === el.id}
                                    direction={valueToOrderBy === el.id ? orderBy : 'asc'}
                                    onClick={() => createSortHandler(el.id)}
                                >
                                    {el.label}
                                </TableSortLabel>
                            </TableCell>)
                    )
                }
            </TableRow>
        </TableHead>
    )
}
export default TableHeader;
