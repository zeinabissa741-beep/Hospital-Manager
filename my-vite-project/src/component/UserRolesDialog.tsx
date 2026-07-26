import { useEffect, useState } from "react";
import { DeleteRoleForUser, EmployUser, FetchRole, fetchRolesForUser, type Role } from "../ApiServices";
import { Box, Button, Chip, FormControl, InputLabel, MenuItem, OutlinedInput, Select, Stack } from "@mui/material";
import { type Theme, useTheme } from '@mui/material/styles';

interface UserRolesDialogProps{
    userId:number;
    onClose: () => void;
}

export const UserRolesDialog: React.FC<UserRolesDialogProps> = ({userId, onClose}) => {
    const [AssignedRoles, setAssignedRoles] = useState<number[]>([]);
    const [allRoles, setAllRoles] = useState<Role[]>([]);
    const [roles, setRoles] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    };
    const theme = useTheme();
    const getRoleName = (id: number) => allRoles.find(r => r.id === id)?.roleName || `Role ${id}`;

    useEffect(() => {
        loadRoles();
        FetchRole()
        .then(data => setAllRoles(data))
        .catch(console.error);
    }, [userId]);

    const loadRoles = async () => {
        try {
            setLoading(true);
            const res = await fetchRolesForUser(userId);
            const roleIds = res.map((r: Role) => r.id);
            setAssignedRoles(roleIds);
            setRoles(roleIds);
        }
        catch(error) {
            console.error("Failed to fetch roles", error);
        }
        finally{
            setLoading(false);
        }
    }
    
    const handleDeleteRole = async(roleId : number) => {
        try{
            await DeleteRoleForUser(userId, roleId);
            setAssignedRoles((prev) => prev.filter((id) => id!= roleId));
        }
        catch (error){
            console.error("Failed to remove role", error);
        }
    }

    const handleAddRole = async () => {
        if (!AssignedRoles) return;
        try {
          setLoading(true);
          const newRoles = AssignedRoles.filter(id => !roles.includes(id));
          for (const roleId of newRoles) {
          await EmployUser(userId, roleId);
        }
        setAssignedRoles([]);
        await loadRoles();
        } catch (error) {
          console.error("Failed to add role", error);
        } finally {
          setLoading(false);
        }
    };

    function getStyles(roleId: number, selectedIds: readonly number[], theme: Theme) {
        return {
            fontWeight: selectedIds.includes(roleId)
            ? theme.typography.fontWeightMedium
            : theme.typography.fontWeightRegular,
        };
    }

    return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-chip-label">Roles</InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          value={AssignedRoles}
          onChange={(e) => {
            const selectedIds = e.target.value as number[];
            const removedRoles = AssignedRoles.filter(id => !selectedIds.includes(id));
            removedRoles.forEach(id => handleDeleteRole(id));
            setAssignedRoles(selectedIds);
          }}
          input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Stack direction = "row" spacing={1} key={value} >
                <Chip label={getRoleName(value)}/>
                </Stack>
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {allRoles.map((role) => (
            <MenuItem
              key={role.id}
              value={role.id}
              style={getStyles(role.id, AssignedRoles, theme)}
              >
              {role.roleName}
            </MenuItem>
          ))}
        </Select>
        <Button onClick={handleAddRole} disabled={loading || AssignedRoles.length === 0}>
           Save
        </Button>
      </FormControl>
    </div>
  );
}