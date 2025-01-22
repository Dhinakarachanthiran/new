import React, { useState, useEffect } from 'react';
import { fetchTeamManagementData , addTeams,EditTeam, deleteTeam} from 'utils/api';
import Dropdown from 'components/Dropdown/Dropdown';

import {
  Box,
  Heading,
  Button,
  Tag,
  Select,
  Input,
  InputGroup,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './TeamManagement.css';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import TeamMembers from './TeamMembers';
import { useToast, Tooltip } from '@chakra-ui/react';
import { MdGroups } from 'react-icons/md';

const TeamManagement = () => {
  const [activeView, setActiveView] = useState('TeamManagement');
  const [selectedTeam, setSelectedTeam] = useState({
    teamName: 'Mavericks',
    manager: 'Sridhar Seshan',
    members: [
      { name: 'Praveen', role: 'Developer' },
      { name: 'Nandhini', role: 'Developer' },
      { name: 'Rithika', role: 'Designer' },
      { name: 'Ranjini', role: 'Developer' },
      { name: 'Dhinakaran', role: 'QA' },
    ],
  });

  const [teams, setTeams] = useState([]);
  const [filters, setFilters] = useState({ department: '', status: '', search: '' });
  const toast = useToast();
  const [isAddModalOpen, setIsAddModalOpen] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); 
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); 
  const [teamToDelete, setTeamToDelete] = useState(null); 
  const [teamToEdit, setTeamToEdit] = useState(null); 
  const [newTeam, setNewTeam] = useState({
    team_name: '',
    manager_id: '',
    project_id: '',
    department_Id: '',
    status_Id: '',
  });

  // Filter logic
  const filteredTeams = teams.filter((team) => {
    const matchesDepartment =
      !filters.department || team.departmentName === filters.department;
    const matchesStatus =
      !filters.status ||
      team.teamStatus.toLowerCase() === filters.status.toLowerCase();
    const matchesSearch =
      !filters.search ||
      team.managerName.toLowerCase().includes(filters.search.toLowerCase()) ||
      team.teamName.toLowerCase().includes(filters.search.toLowerCase());
    return matchesDepartment && matchesStatus && matchesSearch;
  });

  // const [accessRights, setAccessRights] = useState(null);

  // useEffect(() => {
  //   const storedAccessRights = JSON.parse(localStorage.getItem('accessDetails'));
  //   if (storedAccessRights) {
  //     const accessMap = {};
  //     storedAccessRights.forEach((screen) => {
  //       accessMap[screen.screenId] = screen;
  //     });
  //     setAccessRights(accessMap);
  //   }
  // }, []);

  // const screenId = menuConficJson.find((screen) => screen.name === 'Team Management')?.screenId;
  // const currentAccess = accessRights?.[screenId] || {};

  // const hasFullAccess = currentAccess?.fullAccess === 1;
  // const canAdd = hasFullAccess;
  // const canEdit = hasFullAccess;
  // const canDelete = hasFullAccess;

  // Fetch data from the GET API
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const data = await fetchTeamManagementData(); 
        setTeams(data); 
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

    fetchTeams();
  }, [toast]);

  //Add Team by the POST API
  const handleAddTeam = async () => {
    if (!newTeam.manager_id || !newTeam.team_name || !newTeam.project_id || !newTeam.department_Id) {
      toast({
        title: 'Please fill all the required fields',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-end',
      });
      return;
    }
    try{
      const addedTeam = await addTeams(newTeam);
      setTeams((prevTeams) => [addedTeam, ...prevTeams]);
      toast({
        title: 'Team Added',
        description: `${newTeam.team_name} has been added successfully.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-end',
      });
      setIsAddModalOpen(false);
    } catch (error){
      toast({
        title: 'Error Adding Team',
        description: error.response?.data?.message || 'Unable to add the Team. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-end',
      });
    }
  };

  //Edit Team by the PUT API

  const handleEditUser = (team) => {
    setTeamToEdit({
      teamId: team.teamId,
      teamName: team.teamName,
      manager_id: team.manager_id,
      project_id: team.project_id,
      department_Id: team.department_Id,
      status_Id: team.status_Id,
      teamStatus: team.teamStatus, 
    });
    setIsEditModalOpen(true);
  };

  const handleEditSave = async () => {
    try {
      const payload = {
        team_Id: teamToEdit.teamId,
        team_name: teamToEdit.teamName,
        manager_id: teamToEdit.manager_id,
        project_id: teamToEdit.project_id,
        department_Id: teamToEdit.department_Id,
        status_Id: teamToEdit.status_Id,
        isDelete: false,
      };  
      const updatedTeam = await EditTeam(payload.team_Id, payload);
      setTeams((prevTeams) =>
        prevTeams.map((team) => (team.teamId === updatedTeam.teamId ? updatedTeam : team))
      );
      setIsEditModalOpen(false);
      toast({
        title: 'Team Updated',
        description: `Team "${teamToEdit.teamName}" has been updated successfully.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-end',
      });
    } catch (error) {
      toast({
        title: 'Error Updating Team',
        description: error.response?.data?.message || 'Unable to update the team.',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-end',
      });
    }
  };

  const handleDeleteTeam = (teamId) => {
    setIsDeleteModalOpen(true);
    setTeamToDelete(teamId);
  };

  const handleTeamDelete = async () => {
    try {
      const response = await deleteTeam(teamToDelete);
      
      toast({
        title: "Team Deleted",
        description: 'The Team has been deleted successfully',
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-end",
      });
        setIsDeleteModalOpen(false);
        fetchTeamManagementData(); 
      
    } catch (error) {
      console.error("Error deleting Team:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete Team. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-end",
      });
    }
  };

  const onAddModalClose = () => {
    setIsAddModalOpen(false);
  };

  const handleBackToManagement = () => {
    setActiveView('TeamManagement');
  };

  const handleTeamClick = (team) => {
    setSelectedTeam(team);
    setActiveView('TeamMembers');
  };

  
  
  const onDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
  };

  const onEditModalClose = () => {
    setIsEditModalOpen(false);
    setTeamToEdit(null);
  };

  return (
    <div>
      {activeView === 'TeamManagement' && (
        <Box p={8} bg="white" minH="94vh">
          <Heading mb={5} padding="10px" marginTop="-3.5">
            Team Management
          </Heading>

          {/* Filters */}
          <Box display="flex" gap={4} mb={6}>
            <Select
              placeholder="All Departments"
              focusBorderColor="blue.500"
              onChange={(e) =>
                setFilters({ ...filters, department: e.target.value })
              }
              bg="white"
              size="sm"
              width="150px"
              fontSize="14px"
            >
              <option value="Development">Development</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
            </Select>
            <Select
              placeholder="All Status"
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
              bg="white"
              focusBorderColor="blue.500"
              size="sm"
              width="150px"
              fontSize="14px"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </Select>
            <Input
              placeholder="🔍Search Teams..."
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
              bg="white"
              focusBorderColor="blue.500"
              size="sm"
              width="180px"
              fontSize="14px"
            />
            <Button
              onClick={() => setIsAddModalOpen(true)}
              leftIcon={<MdGroups style={{ width: '25px', height: 'auto' }} />}
              colorScheme="black"
              variant="outline"
              top="-1px"
              fontSize="12px"
              height="32px"
              padding="6px 12px"
              _hover={{ bg: 'gray.200' }}
              display="flex"
              alignItems="center"
              // disabled={!canAdd}
            >
              Add Team
            </Button>
          </Box>
          {/* AG Grid */}
          <div
            className="ag-theme-alpine"
            style={{ height: 500, width: '100%' }}
          >
            <AgGridReact
              rowData={filteredTeams}
              columnDefs={[
                {
                  headerName: 'Manager Name',
                  field: 'managerName',
                  filter: true,
                  sortable: true,
                },
                {
                  headerName: 'Team Id', field: 'teamId'
                },
                { headerName: 'Project Name', field: 'projectName' },
                {
                  headerName: 'Team Name',
                  field: 'teamName',
                  filter: true,
                  sortable: true,
                },
                { headerName: 'Department', field: 'departmentName' },
                {
                  headerName: 'Status',
                  field: 'teamStatus',
                  cellRenderer: (params) => (
                    <Tag
                      className="Badge-lables"
                      colorScheme={params.value === 'Active' ? 'green' : 'red'}
                    >
                      {params.value}
                    </Tag>
                  ),
                },
                {
                  headerName: 'Actions',
                  cellRenderer: (params) => (
                    <Box display="flex" justifyContent="left">
                      <Tooltip label="View Team Details" placement="top">
                        <button
                          className="icon-button"
                          onClick={() => handleTeamClick(params.data)}
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                      </Tooltip>
                      <Tooltip label="Edit Team" placement="top">
                        <button
                          className="icon-button"
                          // disabled={!canEdit}
                          onClick={() => handleEditUser(params.data)}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                      </Tooltip>
                      <Tooltip label="Delete Team" placement="top">
                        <button
                          className="icon-button"
                          // disabled={!canDelete}
                          onClick={() => handleDeleteTeam(params.data.teamId)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </Tooltip>
                    </Box>
                  ),
                },
              ]}
              defaultColDef={{
                flex: 1,
                minWidth: 100,
                resizable: true,
              }}
              pagination={true}
              paginationPageSize={10}
            />
          </div>
          {/* Delete Team Modal */}
          <Modal isOpen={isDeleteModalOpen} onClose={onDeleteModalClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Delete Team</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <p>Are you sure you want to delete this team?</p>
              </ModalBody>
              <ModalFooter>
                <Button
                  bg="red.500"
                  color="white"
                  _hover={{ bg: 'red.700' }}
                  onClick={() => handleTeamDelete(teamToDelete)}
                >
                  Confirm Delete
                </Button>
                <Button colorScheme="gray" onClick={onDeleteModalClose} ml={3}>
                  Cancel
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          {/* Add Team Modal */}
          <Modal isOpen={isAddModalOpen} onClose={onAddModalClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Add Team</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <FormControl position="relative" mb={4}>
                  <FormLabel
                    position="absolute"
                    top={newTeam.team_name ? '-10px' : '5px'}
                    left="10px"
                    fontSize={newTeam.team_name ? '12px' : 'sm'}
                    color={newTeam.team_name ? 'gray.500' : 'gray.500'}
                    pointerEvents="none"
                    transition="all 0.2s ease"
                    zIndex={1}
                    bg="white"
                  >
                    Team Name
                  </FormLabel>
                  <InputGroup>
                    <Input
                      value={newTeam.team_name}
                      onChange={(e) =>
                        setNewTeam({ ...newTeam, team_name: e.target.value })
                      }
                      size="sm"
                      focusBorderColor="blue.500"
                      borderRadius="5px"
                      zIndex={2}
                    />
                  </InputGroup>
                </FormControl>
                <Dropdown
                  type="managers"
                  placeholder="Select Manager"
                  selectedValue={newTeam.manager_id}
                  setSelectedValue={(value) =>
                    setNewTeam({ ...newTeam, manager_id: value })
                  }
                />
                <Dropdown
                  type="projects"
                  placeholder="Select Project"
                  selectedValue={newTeam.project_id}
                  setSelectedValue={(value) =>
                    setNewTeam({ ...newTeam, project_id: value })
                  }
                />
                <Dropdown
                  type="departments"
                  placeholder="Select Department"
                  selectedValue={newTeam.department_Id}
                  setSelectedValue={(value) =>
                    setNewTeam({ ...newTeam, department_Id: value })
                  }
                />
                <Dropdown
                  type="status"
                  placeholder="Select status"
                  selectedValue={newTeam.status_Id}
                  setSelectedValue={(value) =>
                    setNewTeam({ ...newTeam, status_Id: value })
                  }
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  colorScheme="blue"
                  onClick={() => handleAddTeam(newTeam)}
                >
                  Add Team
                </Button>
                <Button colorScheme="gray" onClick={onAddModalClose} ml={3}>
                  Cancel
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          {/* Edit Project Modal */}
          <Modal isOpen={isEditModalOpen} onClose={onEditModalClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Edit Team</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <FormControl mb={4}>
                  <FormLabel>Team Name</FormLabel>
                  <Input
                    value={teamToEdit?.teamName || ''}
                    onChange={(e) =>
                      setTeamToEdit({ ...teamToEdit, teamName: e.target.value })
                    }
                  />
                </FormControl>
                <Dropdown
                  type="managers"
                  placeholder="Select Manager"
                  selectedValue={teamToEdit?.manager_id || ''}
                  setSelectedValue={(value) =>
                    setTeamToEdit({ ...teamToEdit, manager_id: value })
                  }
                />
                <Dropdown
                  type="projects"
                  placeholder="Select Project"
                  selectedValue={teamToEdit?.project_id || ''}
                  setSelectedValue={(value) =>
                    setTeamToEdit({ ...teamToEdit, project_id: value })
                  }
                />
                <Dropdown
                  type="departments"
                  placeholder="Select Department"
                  selectedValue={teamToEdit?.department_Id || ''}
                  setSelectedValue={(value) =>
                    setTeamToEdit({ ...teamToEdit, department_Id: value })
                  }
                />
                <Dropdown
                  type="status"
                  placeholder="Select Status"
                  selectedValue={teamToEdit?.status_Id || ''}
                  setSelectedValue={(value) =>
                    setTeamToEdit({ ...teamToEdit, status_Id: value })
                  }
                />
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" onClick={handleEditSave}>
                  Save Changes
                </Button>
                <Button colorScheme="gray" onClick={onEditModalClose} ml={3}>
                  Cancel
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Box>
      )}
      {activeView === 'TeamMembers' && (
        <TeamMembers team={selectedTeam} onBack={handleBackToManagement} />
      )}
    </div>
  );
};

export default TeamManagement;
