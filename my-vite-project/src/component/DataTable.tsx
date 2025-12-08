import * as React from 'react';
import { useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import { createTheme, ThemeProvider} from '@mui/material/styles';
import '../grid.css';
import {GridRowEditStopReasons, GridRowModes,DataGrid, GridActionsCellItem,} from '@mui/x-data-grid';
import type{
  GridRowModesModel,
  GridColDef,
  GridEventListener,
  GridRowId,
  GridRowModel,
  GridValidRowModel,
} from '@mui/x-data-grid';
import { Box, Button } from '@mui/material';
//import { create } from 'domain';


//https://www.youtube.com/watch?v=5sEXClpvL34

interface DataTableProps<T extends GridValidRowModel> {
  row: T[];
  columns: GridColDef[];
  loading: boolean;
  sx?: object;
  onAddClick?: () => void;
  onSaveClick?: (id: GridRowId) => () => void;
  onDeleteClick?: (id: GridRowId) => () => void;
  onCancelClick?: (id: GridRowId) => () => void;
  onEditClick?: (id: GridRowId) => () => void;
  processRowUpdate?: (newRow: GridRowModel, oldRow: GridRowModel) => Promise<GridRowModel> | GridRowModel;
  addButtonLabel?: string;
  showAddButton?: boolean; 
}

const DataTable = <T extends GridValidRowModel>({
  row,
  columns,
  loading,
  sx,
  onAddClick = () => {},
  onEditClick = (id:GridRowId) => () => {},
  onSaveClick = (id: GridRowId) => () => {},
  onDeleteClick = (id: GridRowId) => () => {},
  onCancelClick = (id: GridRowId) => () => {},
  processRowUpdate = (newRow: GridRowModel) => newRow,
  addButtonLabel= "Add new",
  showAddButton = false,
}: DataTableProps<T>) => {

  const [internalRows, setInternalRows] = React.useState<GridValidRowModel[]>([]);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 11 });
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});

React.useEffect(() => {
    setInternalRows(row);
  }, [row]);


  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) =>{
    if(params.reason === GridRowEditStopReasons.rowFocusOut){
      event.defaultMuiPrevented = true;
    }
  }

  
  const handleEditClick = onEditClick;
  const handleSaveClick = onSaveClick;
  const handleDeleteClick = onDeleteClick;
  const handleCancelClick = onCancelClick;
    
  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  }

  const columnsWithActions: GridColDef[] = [
    ...columns,
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 120,
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              onClick={handleSaveClick(id)}
              key="save"
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              onClick={handleCancelClick(id)}
              key="cancel"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            onClick={handleEditClick(id)}
            key="edit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            key="delete"
          />,
        ];
      },
    },
  ];

const theme = createTheme({
  palette: {
    primary: {
      light: '#bb5097',
      main: '#AB257E',
      dark:'#771958',
      contrastText: '#fff',
    }
  }
})

  return(
    <Box className="Box" sx={{ height: '600px', overflowY: 'auto' }}>
      <ThemeProvider theme={theme}>
      {
        showAddButton&&(
          
          <Button className= "AddButton" disableRipple variant="text"
          startIcon={<AddIcon/>}
          onClick={onAddClick}
          >
          {addButtonLabel}
          </Button>         
        )}</ThemeProvider>
    <DataGrid className="DataGrid"
    rows={internalRows}
    columns={columnsWithActions}
    loading={loading}
    pagination
    paginationModel={paginationModel}
    onPaginationModelChange={(model) => setPaginationModel(model)}
    pageSizeOptions={[2,5,10]}
    editMode='row'
    rowModesModel={rowModesModel}
    onRowModesModelChange={handleRowModesModelChange}
    onRowEditStop={handleRowEditStop}
    processRowUpdate={processRowUpdate}
  />
   </Box>
  )
}
export default DataTable;