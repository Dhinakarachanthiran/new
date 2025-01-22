import React, { useState, useMemo, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './TeamMembers.css';
import { Box, Button, useToast } from '@chakra-ui/react';
import { fetchTeamMembersByTeamId,deleteTeamMember,addTeamMember ,fetchUserDetailsByRoleId} from 'utils/api';
 

const TeamMembers = ({ team, onBack }) => {
  const [teamData, setTeamData] = useState({
    teamName: '',
    manager: '',
    members: []
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const teamsPerPage = 7;
  const [userDetails, setUserDetails] = useState([]);

  const toast = useToast(); // Move useToast to component level
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const data = await fetchUserDetailsByRoleId();
        setUserDetails(data); // Set the fetched user details
      } catch (error) {
        toast({
          title: 'Error',
          description: error.message || 'Failed to fetch user details.',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top-end',
        });
      }
    };
  
    fetchUserDetails();
  }, [toast]);
  
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const membersData = await fetchTeamMembersByTeamId(team.teamId);
        // Map API response fields to match expected grid fields
        const formattedData = membersData.map(member => ({
          ...member,
          name: member.user_name, // Map `user_name` to `name`
          role: member.designation, // Map `designation` to `role`
        }));
        setTeamData({
          teamName: team.teamName,
          manager: team.managerName,
          members: formattedData,
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: error.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top-end',
        });
      }
    };

    if (team.teamId) {
      fetchTeamMembers();
    }
  }, [team.teamId, toast]); // Add toast to dependency array

  // AG Grid Column Definitions
  const columnDefs = useMemo(
    () => [
      {
        headerName: 'Name',
        field: 'name',
        sortable: true,
        filter: true,
      },
      {
        headerName: 'Designation',
        field: 'designation',
        sortable: true,
        filter: true,
      },
      {
        headerName: 'Actions',
        cellRenderer: (params) => (
          <button
            className="icon-button2"
            onClick={() => handleDeleteUser(params.data.emp_code)} // Using emp_code as the unique identifier
          >
            <i className="fas fa-trash"></i>
          </button>
        ),
      },
    ],
    [],
  );

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleSelectMember = (emp_code) => {
    setSelectedMembers((prev) =>
      prev.includes(emp_code)
        ? prev.filter((id) => id !== emp_code)
        : [...prev, emp_code],
    );
  };

  const handleDeleteUser = async (emp_code) => {
    try {
      // Call the delete API
      await deleteTeamMember(emp_code);
  
      // Show success toast
      toast({
        title: 'Success',
        description: 'Team member has been successfully deleted.',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-end',
      });
      
      // Re-fetch the team data to ensure sync with backend
      const membersData = await fetchTeamMembersByTeamId(team.teamId);
  
      // Map API response fields to match expected grid fields
      const formattedData = membersData.map(member => ({
        ...member,
        name: member.user_name, // Map `user_name` to `name`
        role: member.designation, // Map `designation` to `role`
      }));
  
      // Update the state with the new members data from the backend
      setTeamData((prevData) => ({
        ...prevData,
        members: formattedData,
      }));
  
    } catch (error) {
      // Show error toast in case of failure
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-end',
      });
    }
  };
  
  
  
  const handleSave = async () => {
    try {
      for (const empCode of selectedMembers) {
        const user = userDetails.find((u) => u.emp_code === empCode);
  
        if (!user) {
          toast({
            title: "Error",
            description: `User with emp_code ${empCode} not found in userDetails.`,
            status: "error",
            duration: 3000,
            isClosable: true,
            position: "top-end",
          });
          continue;
        }
  
        // Here we'll use the manager ID from the team prop
        const memberToAdd = {
          team_Id: team.teamId,
          emp_code: user.emp_code,
          user_name: user.user_name,
          manager_id: team.managerId, // Use managerId directly from team prop
          isDeleted: false,
        };
  
        await addTeamMember(memberToAdd);
      }

    // Show success toast
    toast({
      title: "Success",
      description: "Team members added successfully.",
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "top-end",
    });

    // Refresh the list after successful addition
    const membersData = await fetchTeamMembersByTeamId(team.teamId);
    const formattedData = membersData.map((member) => ({
      ...member,
      name: member.user_name,
      role: member.designation,
    }));

    setTeamData((prevData) => ({
      ...prevData,
      members: formattedData,
    }));

    // Clear selection and close dropdown
    setIsDropdownOpen(false);
    setSelectedMembers([]);
  } catch (error) {
    toast({
      title: "Error",
      description: error.response?.data?.message || error.message || "Failed to add team members.",
      status: "error",
      duration: 3000,
      isClosable: true,
      position: "top-end",
    });
  }
};

  // AG Grid Default Column Properties
  const defaultColDef = useMemo(
    () => ({
      flex: 1,
      minWidth: 100,
    }),
    [],
  );

  return (
    <Box p={8} bg="white" minH="94vh">
      <div className="team-container">
        {/* Header Section */}
        <div className="team-header">
          <h1 className="team-name">{teamData.teamName}</h1>
          <div className="header-actions">
            <button onClick={onBack} className="backbtn">
              Back
            </button>
          </div>
        </div>

        {/* Team Manager */}
        <div className="manager-section">
          <div className="manager">
            <div className="manager-title">Project Manager:</div>
            <div className="manager-label">
              <div className="manager-avatar"></div>
              <span className="manager-name">{teamData.manager}</span>
            </div>
          </div>

          <div className="multi-select-container">
            <button className="dropdown-trigger" onClick={toggleDropdown}>
              Members:{' '}
              {selectedMembers.length > 0 ? selectedMembers.length : 'All'} ▼
            </button>
            {isDropdownOpen && (
             <div className="multi-select-dropdown">
             <div className="dropdown-header">
               <input
                 type="text"
                 placeholder="Filter by Members"
                 className="dropdown-search"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
               <button className="close-button" onClick={() => setIsDropdownOpen(false)}>
                 ✖
               </button>
             </div>
             <ul className="dropdown-list">
  {userDetails
    .filter(user =>
      (user?.user_name?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) || // Safely check User_name
      (user?.email_Id?.toLowerCase() ?? '').includes(searchTerm.toLowerCase())    // Safely check Email_Id
    )
    .map((user) => (
      <li key={user.emp_code}>
        <label>
          <input
            type="checkbox"
            checked={selectedMembers.includes(user.emp_code)}
            onChange={() => handleSelectMember(user.emp_code)}
          />
          <span className="member-icon">{user?.user_name?.[0]?.toUpperCase() ?? ''}</span>
          {user?.user_name} {user?.email_Id && `(${user.email_Id})`}
        </label>
      </li>
    ))}
</ul>

             <div className="dropdown-actions">
               <button className="save-button" onClick={handleSave}>
                 Add
               </button>
               <button className="cancel-button" onClick={() => setIsDropdownOpen(false)}>
                 Cancel
               </button>
             </div>
           </div>
           
            )}
          </div>
        </div>

        {/* AG Grid Table */}
        <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
          <AgGridReact
            rowData={teamData.members}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            pagination={true}
            paginationPageSize={teamsPerPage} // Built-in pagination
          />
        </div>
      </div>
    </Box>
  );
};

export default TeamMembers;
