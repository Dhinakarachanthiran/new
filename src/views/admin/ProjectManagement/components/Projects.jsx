import React, { useState, useEffect } from 'react';
import {
  fetchProjectManagementDatas,
  addProject,
  fetchTeamsByManager,
} from 'utils/api';
import Dropdown from 'components/Dropdown/Dropdown';
import './Project.css';
// import menuConficJson from 'menuConfig.json';
import {
  Button,
  Flex,
  Heading,
  Input,
  Select,
  Tag,
  Box,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useToast,
  Text,
  InputGroup,
  FormControl,
  FormLabel,
  HStack,
  Tooltip,
  SimpleGrid,
} from '@chakra-ui/react';
import EditprojectGrid from './Editproject';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import Editproject from './Editproject';
import { FaUsers } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Projects = () => {
  const {
    isOpen: isAddModalOpen,
    onOpen: onAddModalOpen,
    onClose: onAddModalClose,
  } = useDisclosure();
  const {
    isOpen: isViewModalOpen,
    onOpen: onViewmodalOpen,
    onClose: onViewModalClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onClose: onDeleteModalClose,
  } = useDisclosure();

  const toast = useToast();

  const [activeView, setActiveView] = useState('Projects');
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [newProject, setNewProject] = useState({
    name: '',
    clientId: '',
    categoryId: '',
    departmentId: '',
    managerId: '',
    status: 5,
    progress: 0,
    startDate: '',
    dueDate: '',
    team_name: '',
    team_id: '',
  });

  // Fetch data from the GET API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await fetchProjectManagementDatas(); 
        setProjects(data);
        console.log(data); 
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
    fetchProjects();
  }, [toast]);

  const handleFetchTeams = async (managerId) => {
    try {
      const teams = await fetchTeamsByManager(managerId);
      setNewProject((prevState) => ({
        ...prevState,
        availableTeams: teams.map((team) => ({
          team_id: team.team_id,
          team_name: team.team_name,
        })), 
        selectedTeams: [], 
      }));
    } catch (error) {
      console.error('Failed to fetch teams:', error);
    }
  };

  const projectData = {
    projectName: 'Sage 300',
    teamName1: 'Mavericks',
    teamName: 'CodeMates',
    tasks: [
      { task: 'UI/UX Design', status: 'InProgress', progress: 80 },
      { task: 'Analysis', status: 'InProgress', progress: 10 },
      { task: 'Rithika', status: 'Developer', progress: '70' },
      { task: 'QA 1', status: 'Done', progress: 'Done' },
      { task: 'QA 2', status: 'QA', progress: '90' },
      { task: 'QA 1', status: 'QA', progress: '80' },
      { task: 'QA 1', status: 'QA', progress: 'Done' },
      { task: 'QA 1', status: 'QA', progress: '33' },
      { task: 'QA 1', status: 'QA', progress: '63' },
      { task: 'QA 2', status: 'QA', progress: '56' },
    ],
  };

  const filteredProjects = projects
    .filter((project) =>
      selectedFilter ? project.status === selectedFilter : true,
    )
    .filter((project) =>
      selectedDepartment ? project.department === selectedDepartment : true,
    );

  const handleAddProject = async () => {
    if (!newProject.name) {
      toast({
        title: 'Please provide the project name',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-end',
      });
      return;
    }
    if (!newProject.startDate) {
      toast({
        title: 'Please provide the start date',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-end',
      });
      return;
    }
    
    const projectPayload = {
      project_name: newProject.name,
      client_Id: newProject.clientId,
      category_Id: newProject.categoryId,
      start_date: newProject.startDate,
      due_date: newProject.dueDate || null,
      department_Id: newProject.departmentId,
      status_Id: newProject.status,
      manager_id: newProject.managerId,
      team_id: newProject.selectedTeams.join('|'),
      color_Code: newProject.color || null,
    };

    try {
      const response = await addProject(projectPayload);
      setProjects([response, ...projects]);
      toast({
        title: 'Project Added',
        description: `Project "${newProject.name}" has been added successfully.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-end',
      });
      setNewProject({
        name: '',
        clientId: '',
        categoryId: '',
        startDate: '',
        dueDate: '',
        departmentId: '',
        status: '',
        managerId: '',
        color: '',
        selectedTeams: [],
        availableTeams: [],
      });
      onAddModalClose();
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error.message || 'Failed to add the project. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-end',
      });
    }
  };

  const handleDeleteProject = () => {
    setProjects(projects.filter((proj) => proj.id !== selectedProject.id));
    toast({
      title: 'Project Deleted',
      description: `${selectedProject?.name} has been removed successfully.`,
      status: 'error',
      duration: 3000,
      isClosable: true,
      position: 'top-end',
    });
    onDeleteModalClose();
  };

  const handleFilterChange = (e) => setSelectedFilter(e.target.value);
  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleDepartmentChange = (e) => setSelectedDepartment(e.target.value);

  const handleEditViewDetails = (projectId) => {
    console.log('Selected Project ID:', projectId);
    setSelectedProject(projectId);
    setActiveView('Editproject');
  };

  const handleBackToManagement = () => {
    setActiveView('Projects');
  };

  const styles = {
    container: {
      padding: '20px',
    },
    button: {
      marginRight: '7px',
      borderRadius: '5px',
      padding: '5px 10px',
      backgroundColor: '#f8f9fa',
      color: '#495057',
      fontSize: '16px',
      border: '1px solid #dee2e6',
      cursor: 'pointer',
    },
    projectHeader: {
      textAlign: 'left',
      marginBottom: '20px',
      fontSize: '20px',
      fontWeight: 'bold',
    },
    teamSection: {
      marginBottom: '20px',
      fontSize: '16px',
      display: 'flex',
      alignItems: 'center',
    },
    teamTitle: {
      fontWeight: 'bold',
      marginRight: '10px',
    },
    teamNameContainer: {
      display: 'flex',
      alignItems: 'center',
      backgroundColor: '#f9fafc',
      padding: '5px 10px',
      borderRadius: '20px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    },
    avatar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#d9e8ff',
      color: '#3578e5',
      fontSize: '14px',
      height: '30px',
      width: '30px',
      borderRadius: '50%',
      marginRight: '8px',
    },
    teamName: {
      color: '#333',
      fontWeight: 500,
    },
  };
  const columns = [
    {
      headerName: 'Project Name',
      field: 'projectName',
      sortable: true,
      filter: true,
    },
    {
      headerName: 'Department',
      field: 'departmentName',
      sortable: true,
      filter: true,
    },
    {
      headerName: 'Status',
      field: 'projectStatus',
      cellRenderer: ({ value }) => (
        <Tag
          className="Badge-lables"
          colorScheme={
            {
              Future: 'yellow',
              Active: 'green',
              'To Do': 'red',
              'In Process': 'blue',
              Completed: 'green',
            }[value]
          }
        >
          {value}
        </Tag>
      ),
    },
    {
      headerName: 'Progress',
      cellRenderer: ({ value }) => {
        const hardcodedProgressValue = 65; 
        const progressColor =
          hardcodedProgressValue === 0
            ? '#d3d3d3'
            : hardcodedProgressValue === 100
              ? 'green'
              : '#3965FF';

        return (
          <Tooltip label={`Progress: ${hardcodedProgressValue}%`}>
            <div
              style={{
                margin: '15px 0px 5px 0px',
                position: 'relative',
                width: '100%',
                height: '4px',
                backgroundColor: '#f0f0f0',
                borderRadius: '2px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${hardcodedProgressValue}%`,
                  height: '100%',
                  backgroundColor: progressColor,
                  transition: 'width 0.3s ease',
                }}
              ></div>
            </div>
          </Tooltip>
        );
      },
    },

    {
      headerName: 'Actions',
      cellRenderer: (params) => (
        <Box display="flex" justifyContent="left">
          <Tooltip label="View Team Details" placement="top">
            <button className="icon-button" onClick={onViewmodalOpen}>
              <i className="fas fa-eye"></i>
            </button>
          </Tooltip>
          <Tooltip label="Edit Team" placement="top">
            <button
              className="icon-button"
              // disabled={!canEdit}
              onClick={() => handleEditViewDetails(params.data.projectId)}
            >
              <i className="fas fa-edit"></i>
            </button>
          </Tooltip>
          <Tooltip label="Delete Team" placement="top">
            <button
              className="icon-button"
              // disabled={!canDelete}
              onClick={() => {
                setSelectedProject(params.data);
                onDeleteModalOpen();
              }}
            >
              <i className="fas fa-trash"></i>
            </button>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <div>
      {activeView === 'Projects' && (
        <Box p={8} bg="white" minH="94vh">
          <Heading mb={5} padding="10px" marginTop="-3.5">
            Project Management
          </Heading>
          <Box display="flex" gap={4} mb={6}>
            <Select
              placeholder="All Departments"
              bg="white"
              size="sm"
              width="150px"
              borderRadius="md"
              onChange={handleDepartmentChange}
            >
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
            </Select>
            <Select
              placeholder="All Status"
              bg="white"
              size="sm"
              width="150px"
              borderRadius="md"
              onChange={handleFilterChange}
            >
              <option value="Future">Future</option>
              <option value="To Do">To Do</option>
              <option value="In Process">In Process</option>
              <option value="Completed">Completed</option>
            </Select>
            <Input
              placeholder="🔍 Search projects..."
              bg="white"
              size="sm"
              width="170px"
              variant="outline"
              borderColor="gray.300"
              focusBorderColor="blue.500"
              borderRadius="md"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <Button
              colorScheme="black"
              variant="outline"
              top="-1px"
              fontSize="12px"
              height="32px"
              padding="6px 12px"
              _hover={{ bg: 'gray.200' }}
              borderRadius="2xl"
              display="flex"
              alignItems="center"
              // disabled={!canAdd}
              onClick={onAddModalOpen}
            >
              Add Project
            </Button>
          </Box>
          {/* Ag Grid */}
          <div
            className="ag-theme-alpine"
            style={{ height: 500, width: '100%' }}
          >
            <AgGridReact
              rowData={filteredProjects}
              columnDefs={columns}
              defaultColDef={{
                flex: 1,
                minWidth: 100,
                resizable: true,
              }}
              pagination={true}
              paginationPageSize={10}
            />
          </div>
        </Box>
      )}
      {activeView === 'Editproject' && (
       <EditprojectGrid projectId={selectedProject} onBack={handleBackToManagement} />
      )}
      {/* Add Project Modal */}
      <Modal isOpen={isAddModalOpen} onClose={onAddModalClose}>
        <ModalOverlay />
        <ModalContent borderRadius="md" p={4} maxWidth="500px">
          <ModalHeader textAlign="left" fontSize="2xl" fontWeight="bold">
            {' '}
            Create Project{' '}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl position="relative" maxWidth="250px" mb={5}>
              <FormLabel
                position="absolute"
                top={newProject.name ? '-10px' : '5px'}
                left="10px"
                fontSize={newProject.name ? '12px' : 'sm'}
                color="gray.500"
                pointerEvents="none"
                transition="all 0.2s ease"
                zIndex={1}
                bg="white"
              >
                Project Name
                <span style={{ color: 'red', fontSize: '14px' }}> * </span>
              </FormLabel>
              <InputGroup>
                <Input
                  value={newProject.name}
                  onChange={(e) =>
                    setNewProject({ ...newProject, name: e.target.value })
                  }
                  size="sm"
                  borderRadius="5px"
                  focusBorderColor="gray.500"
                  zIndex={2}
                />
              </InputGroup>
            </FormControl>
            {/* Client and Category in One Line */}
            <Flex mb={5} gap={4}>
              <Dropdown
                type="clients"
                placeholder="Select Client"
                selectedValue={newProject.clientId}
                setSelectedValue={(value) =>
                  setNewProject({ ...newProject, clientId: value })
                }
              />

              <Dropdown
                type="Categories"
                placeholder="Select Categorie"
                selectedValue={newProject.categoryId}
                setSelectedValue={(value) =>
                  setNewProject({ ...newProject, categoryId: value })
                }
              />
            </Flex>
            {/* Dates */}
            <HStack alignItems="flex-start" mb={5}>
              <FormControl position="relative" maxWidth="200px">
                <FormLabel
                  position="absolute"
                  top={newProject.startDate ? '-10px' : '5px'}
                  left="10px"
                  fontSize={newProject.startDate ? '12px' : 'sm'}
                  color="gray.500"
                  pointerEvents="none"
                  transition="all 0.2s ease"
                  zIndex={1}
                  bg="white"
                >
                  Start Date{' '}
                  <span style={{ color: 'red', fontSize: '14px' }}> * </span>
                </FormLabel>
                {/* <InputGroup> */}
                <DatePicker
                  selected={newProject.startDate}
                  onChange={(date) =>
                    setNewProject({ ...newProject, startDate: date })
                  }
                  dateFormat="dd-MM-yyyy"
                  className="react-datepicker-input"
                  customInput={
                    <Input
                      width="100%"
                      focusBorderColor="gray.200"
                      size="sm"
                      borderRadius="5px"
                    />
                  }
                />
                {/* </InputGroup> */}
              </FormControl>
              {/* Due Date Field */}
              <FormControl position="relative" maxWidth="200px">
                <FormLabel
                  position="absolute"
                  top={newProject.dueDate ? '-10px' : '5px'}
                  left="10px"
                  fontSize={newProject.dueDate ? '12px' : 'sm'}
                  color="gray.500"
                  pointerEvents="none"
                  transition="all 0.2s ease"
                  zIndex={1}
                  bg="white"
                >
                  Due Date
                </FormLabel>
                <DatePicker
                  selected={newProject.dueDate}
                  onChange={(date) =>
                    setNewProject({ ...newProject, dueDate: date })
                  }
                  dateFormat="dd-MM-yyyy"
                  className="react-datepicker-input"
                  customInput={
                    <Input
                      width="100%"
                      focusBorderColor="gray.200"
                      size="sm"
                      borderRadius="5px"
                    />
                  }
                />
              </FormControl>
            </HStack>

            {/* Choose Color Code */}
            <FormControl mb={5}>
              <FormLabel fontSize="sm" fontWeight="bold">
                Choose Color Code
                <span style={{ color: 'red', fontSize: '14px' }}> * </span>
              </FormLabel>
              <Flex align="center" gap={4}>
                <Input
                  type="color"
                  value={newProject.color}
                  onChange={(e) =>
                    setNewProject({ ...newProject, color: e.target.value })
                  }
                  size="sm"
                  borderRadius="5px"
                  width="50px"
                  p={0}
                  cursor="pointer"
                />
              </Flex>
            </FormControl>
            {/* Department and Status in One Line */}
            <Flex mb={5} gap={4}>
              <Dropdown
                type="departments"
                placeholder="Select Department"
                selectedValue={newProject.departmentId}
                setSelectedValue={(value) =>
                  setNewProject({ ...newProject, departmentId: value })
                }
              />
            </Flex>
            <Dropdown
              type="managers"
              placeholder="Select Manager"
              selectedValue={newProject.managerId}
              setSelectedValue={(managerId) => {
                setNewProject((prevState) => ({
                  ...prevState,
                  managerId: managerId,
                  availableTeams: [],
                  selectedTeams: [],
                }));
                handleFetchTeams(managerId);
              }}
            />
            {/* Only show Teams after selecting a Manager */}
            {newProject.managerId && newProject.availableTeams.length > 0 && (
              <>
                <Text fontSize="md" fontWeight="bold" mb={2}>
                  Teams:
                </Text>
                <SimpleGrid columns={[2, 3]} spacing={4} mb={3}>
                  {newProject.availableTeams.map((team) => {
                    const isTeamSelected = newProject.selectedTeams.includes(
                      team.team_id,
                    );
                    const isTeamAssigned =
                      newProject.assignedTeams &&
                      newProject.assignedTeams.includes(team.team_id); // Check if team is assigned

                    return (
                      <Box
                        key={team.team_id}
                        p={3}
                        borderRadius="md"
                        borderWidth="1px"
                        borderColor={
                          isTeamSelected
                            ? 'green.400'
                            : isTeamAssigned
                              ? 'gray.400'
                              : 'gray.300'
                        }
                        bg={
                          isTeamSelected
                            ? 'green.50'
                            : isTeamAssigned
                              ? 'gray.100'
                              : 'white'
                        }
                        _hover={{
                          borderColor: isTeamAssigned ? 'gray.400' : 'teal.500',
                          cursor: isTeamAssigned ? 'not-allowed' : 'pointer',
                        }}
                        onClick={() => {
                          if (isTeamAssigned) return; 
                          const updatedTeams = isTeamSelected
                            ? newProject.selectedTeams.filter(
                                (t) => t !== team.team_id,
                              )
                            : [...newProject.selectedTeams, team.team_id];
                          setNewProject({
                            ...newProject,
                            selectedTeams: updatedTeams,
                          });
                        }}
                      >
                        <Flex justify="start" align="center">
                          <FaUsers
                            style={{
                              marginRight: '5px',
                              color: isTeamAssigned ? 'gray' : 'teal',
                            }}
                          />
                          <Text fontSize="sm" fontWeight="semibold">
                            {team.team_name}
                          </Text>
                        </Flex>
                      </Box>
                    );
                  })}
                </SimpleGrid>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleAddProject} colorScheme="blue" size="md">
              Add project
            </Button>
            <Button onClick={onAddModalClose} ml={3} variant="ghost" size="md">
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* View Model */}
      <Modal isOpen={isViewModalOpen} onClose={onViewModalClose}>
        <ModalOverlay />
        <ModalContent borderRadius="md" p={4} maxWidth="700px" height="550px">
          <ModalHeader
            textAlign="left"
            fontSize="20px"
            fontWeight="bold"
            borderBottom="1px solid #e1e4e8"
          >
            Project Details
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div style={styles.projectHeader}>
              <h1>Project Name : {projectData.projectName}</h1>
            </div>

            <div style={styles.teamSection}>
              <span style={styles.teamTitle}>Team Names :</span>
              <div style={styles.teamNameContainer}>
                <div style={styles.avatar}>
                  <i className="fas fa-user"></i>
                </div>
                <span style={styles.teamName}>{projectData.teamName1}</span>
              </div>
              <div style={styles.teamNameContainer}>
                <div style={styles.avatar}>
                  <i className="fas fa-user"></i>
                </div>
                <span style={styles.teamName}>{projectData.teamName}</span>
              </div>
            </div>
            <div
              className="ag-theme-alpine"
              style={{ height: '300px', width: '100%' }}
            >
              <AgGridReact
                rowData={projectData.tasks}
                columnDefs={[
                  {
                    headerName: 'Task',
                    field: 'task',
                    sortable: true,
                    filter: true,
                  },
                  {
                    headerName: 'Status',
                    field: 'status',
                    sortable: true,
                    filter: true,
                  },
                  {
                    headerName: 'Progress',
                    field: 'progress',
                    cellRenderer: ({ value }) => {
                      const progress =
                        value === 'Done' ? 100 : parseInt(value, 10) || 0;
                      const progressColor =
                        progress === 100 ? 'green' : '#3965FF';
                      return (
                        <Tooltip
                          label={`Progress: ${progress}%`}
                          aria-label="Progress Tooltip"
                        >
                          <div
                            style={{
                              margin: '15px 0px 5px 0px',
                              position: 'relative',
                              width: '100%',
                              height: '4px',
                              backgroundColor: '#f0f0f0',
                              borderRadius: '2px',
                              overflow: 'hidden',
                            }}
                          >
                            <div
                              style={{
                                width: `${progress}%`,
                                height: '100%',
                                backgroundColor: progressColor,
                                transition: 'width 0.3s ease',
                              }}
                            ></div>
                          </div>
                        </Tooltip>
                      );
                    },
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
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={onDeleteModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Project</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p>Are you sure you want to delete {selectedProject?.name}?</p>
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleDeleteProject} colorScheme="red">
              Delete
            </Button>
            <Button onClick={onDeleteModalClose} ml={3}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Projects;
