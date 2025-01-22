import React, { useState, useCallback, useEffect } from 'react';
import {
  fetchEditProjectDatas,
  fetchAssignTasks,
  fetchTeamNamesByProject,
  updateProjectTask,
  deleteTaskByIndexId,
} from 'utils/api';
import Dropdown from 'components/Dropdown/Dropdown';
import {
  Box,
  Badge,
  HStack,
  Button,
  Text as ChakraText,
  Tag,
  Flex,
  Tooltip,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  useDisclosure,
  useToast,
  Heading,
  VStack,
  SimpleGrid,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from '@chakra-ui/react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const EditprojectGrid = ({ projectId, onBack }) => {

  const toast = useToast();
  const [tasks, setTasks] = useState([]);
  const deleteDisclosure = useDisclosure();
  const cancelRef = React.useRef();
  const [teamNames, setTeamNames] = useState([]);
  const handleTeamSelection = (team) => console.log(`Selected Team: ${team}`);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('Mavericks');
  const [taskToEdit, setTaskToEdit] = useState([]);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState([]);
  const handleFilterChange = (status) => setFilter(status);
  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  
  const [newTask, setNewTask] = useState({
    project_Id: '',
    task_Id: '',
    estimated_hours: '',
    actual_hours: '-',
    override_hours: '-',
    status_id: '',
    TaskId: '',
    TaskName: '',
    status_Name: '',
    status_Id: '',
  });

  const {
    isOpen: isAddOpen,
    onOpen: onAddOpen,
    onClose: onAddClose,
  } = useDisclosure();
 
  const statuses = ['Completed', 'In Process', 'Hold'];
  const statusColors = {
    Completed: 'green',
    'In Process': 'blue',
    Hold: 'red',
  };
  const [taskStatusCounts, setTaskStatusCounts] = useState({
    Completed: 0,
    'In Process': 0,
    Hold: 0,
  });

  useEffect(() => {
    const counts = tasks.reduce(
      (acc, task) => {
        acc[task.statusName] = (acc[task.statusName] || 0) + 1;
        return acc;
      },
      { Completed: 0, 'In Process': 0, Hold: 0 }
    );
    setTaskStatusCounts(counts);
  }, [tasks]);

  const handleNewTask = () => {
    setNewTask((prev) => ({
      ...prev,
      project_Id: projectId, 
    }));
    onAddOpen(); 
  };

  useEffect(() => {
    const fetchEditProjects = async () => {
      try {
        const data = await fetchEditProjectDatas(projectId);
        if (Array.isArray(data) && data.length > 0) {
          setTasks(data);
        } else {
          setTasks([]);
        }
      } catch (error) {
        toast({
          title: 'Error',
          description: error.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };
    const fetchTeamNames = async () => {
      try {
        const teams = await fetchTeamNamesByProject(projectId);
        setTeamNames(teams);
      } catch (error) {
        toast({
          title: 'Error',
          description: error.message || 'Failed to fetch team names.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchEditProjects();
    fetchTeamNames();
  }, [projectId, toast , fetchEditProjectDatas]);

  const handleAssignTask = async () => {
    const taskPayload = {
      Project_Id: newTask.project_Id,
      Task_Id: newTask.task_Id,
      Estimated_hours: newTask.estimated_hours,
      Actual_hours: newTask.actual_hours,
      Override_hours: newTask.override_hours,
      Status_id: newTask.status_id,
    };

    try {
      const response = await fetchAssignTasks(taskPayload);
        setTasks((prevTasks) => [{...response.data, taskName: newTask.TaskName, statusName: newTask.status_Name,}, ...prevTasks,]);
        toast({
          title: 'Task Added',
          description: `The task "${newTask.TaskName}" has been added successfully.`,
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top-end',
        });
        setNewTask({
          project_Id: '',
          task_Id: '',
          estimated_hours: '',
          actual_hours: '',
          override_hours: '',
          status_id: '',
          TaskId: '',
          TaskName: '',
          status_Name: '',
          status_Id: '',
        });
        onAddClose(true);
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error.message || 'Failed to add the task. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-end',
      });
    }
  };

  const handleEditTask = (task) => {
    setTaskToEdit({
      index_id: task.indexId, 
      taskName: task.taskName,
      estimatedHours: task.estimatedHoures, 
      statusId: task.statusId || "", 
    });
    setIsEditOpen(true);
  };

  const handleSaveTask = async () => {
    const updatedTask = {
      estimated_hours: taskToEdit.estimatedHours,
      status_id: taskToEdit.statusId,
    };
    try{
      await updateProjectTask(taskToEdit.index_id,updatedTask);
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.index_id === taskToEdit.index_id
            ? { ...t, ...updatedTask, updated_at: new Date().toISOString() }
            : t
        )
      );
      toast({
        title: "Task Updated",
        description: `The task "${taskToEdit.taskName}" has been updated successfully.`,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-end",
      });
      setIsEditOpen(false);
    } catch(error){
      toast({
        title: "Error",
        description:
          error.message || "Failed to update the task. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-end",
      });
    }
  };

  const handleDeleteTask = (task) => {
    console.log('Task to delete:', task); // Check the data structure
    setTaskToDelete({
      index_id: task.indexId,
      taskName: task.taskName,
      statusId: task.statusId || '',
    });
    deleteDisclosure.onOpen();
  };

  const confirmDelete = async () => {
    try {
      if (taskToDelete.status_id) {
        toast({
          title: 'Delete Failed',
          description: 'Only tasks with Status_id = 5 can be deleted.',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top-end',
        });
        deleteDisclosure.onClose();
        return;
      }
      await deleteTaskByIndexId(taskToDelete.index_id);
      setTasks((prevTasks) =>
        prevTasks.filter((task) => task.index_id !== taskToDelete.index_id),
      );
 
      toast({
        title: 'Task Deleted',
        description: 'The task has been successfully deleted.',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-end',
      });
      deleteDisclosure.onClose();
    } catch (error) {
      toast({
        title: 'Delete Failed',
        description:
          error.message || 'An error occurred while deleting the task.',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-end',
      });
    } finally {
      setTaskToDelete(null);
    }
  };
 
  const columnDefs = [
    {
      headerName: 'Task Name',
      field: 'taskName',
      sortable: true,
      filter: true,
      flex: 2,
    },
    {
      headerName: 'Estimated Hours',
      field: 'estimatedHoures',
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: 'Actual Hours',
      field: 'actualHours',
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: 'Override Hours',
      field: 'overrideHours',
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: 'Status',
      field: 'statusName',
      sortable: true,
      filter: true,
      flex: 1,
      cellRenderer: (params) => {
        const color =
          params.value === 'Completed'
            ? 'green'
            : params.value === 'In Process'
              ? 'blue'
              : 'red';
        return (
          <Tag className="Badge-lables" colorScheme={color}>
            {params.value}
          </Tag>
        );
      },
    },
    {
      headerName: 'Actions',
      field: 'actions',
      flex: 1,
      cellRenderer: (params) => (
        <Box display="flex" justifyContent="left">
          <Tooltip label="Edit Task" placement="top">
            <button
              className="icon-button"
              onClick={() => handleEditTask(params.data)}
            >
              <i className="fas fa-edit"></i>
            </button>
          </Tooltip>
          <Tooltip label="Delete Task" placement="top">
            <button
              className="icon-button"
              onClick={() => handleDeleteTask(params.data)}
            >
              <i className="fas fa-trash"></i>
            </button>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box className="edit-project-container" p={8} bg="white" minH="90vh">
      <Flex direction="column" mb={6}>
        <Flex justifyContent="space-between" alignItems="center" mb={0}>
          <Flex alignItems="center" gap={1}>
            <Heading>
              {tasks.length > 0 ? tasks[0].projectName : 'No Project Available'}
            </Heading>
            <Tag colorScheme="green" size="md">
              Active
            </Tag>
          </Flex>
          <HStack spacing={4}>
            <Button
              colorScheme="black"
              variant="outline"
              top="-1px"
              fontSize="12px"
              height="32px"
              padding="8px 14px"
              _hover={{ bg: 'gray.200' }}
              display="flex"
              alignItems="center"
              onClick={onBack}
            >
              Back
            </Button>
          </HStack>
        </Flex>
      </Flex>

      {/* Team Names and Task Status Summary */}
      <Flex mt={4} justifyContent="space-between" alignItems="center">
        <HStack spacing={4}>
          <ChakraText fontWeight="bold" fontSize="2xl">
            Team Names:
          </ChakraText>
          {teamNames.map((teamName, index) => (
            <Badge
              key={index}
              px={2}
              py={2}
              fontSize="sm"
              borderRadius="2xl"
              cursor="pointer"
              onClick={() => handleTeamSelection(teamName)}
              textTransform="capitalize"
            >
              <ChakraText as="span" mr={2} fontSize="lg">
                👤
              </ChakraText>
              {teamName}
            </Badge>
          ))}
        </HStack>

        {/* Task Status Summary */}
        <SimpleGrid columns={3} spacing={2} w="35%" maxW="350px">
          {statuses.map((status) => (
          <Box
            key={status}
            p={1}
            borderWidth={1}
            borderRadius="lg"
            textAlign="center"
            boxShadow="sm"
            transition="all 0.2s ease"
            bg={`${statusColors[status]}.50`}
            borderColor={`${statusColors[status]}.200`}
            _hover={{
              transform: 'scale(1.03)',
              boxShadow: 'md',
              borderColor: `${statusColors[status]}.400`,
            }}
          >
          <VStack spacing={1}>
            <ChakraText
              fontSize="xs"
              fontWeight="semibold"
              textTransform="uppercase"
              letterSpacing="tight"
              color={`${statusColors[status]}.700`}
            >
            {status}
            </ChakraText>
            <ChakraText
              fontSize="md"
              fontWeight="bold"
              color={`${statusColors[status]}.800`}
            >
              {taskStatusCounts[status] || 0}
            </ChakraText>
          </VStack>
        </Box>
        ))}
      </SimpleGrid>
      </Flex>

      {/* Task Controls */}
      <Flex mt={6} justifyContent="space-between" alignItems="center">
        <HStack spacing={4}>
          <ChakraText fontWeight="bold">Filter Tasks:</ChakraText>
          <Select
            bg="white"
            size="sm"
            width="170px"
            variant="outline"
            borderColor="gray.300"
            focusBorderColor="blue.500"
            borderRadius="md"
            // onChange={(e) => handleFilterChange(e.target.value)}
            value={filter}
            w="200px"
          >
            <option value="">All Status</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </Select>
          <Input
            placeholder="🔍 Search Task..."
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
        </HStack>
        <Button
          colorScheme="black"
          variant="outline"
          top="-1px"
          fontSize="12px"
          height="32px"
          padding="8px 14px"
          _hover={{ bg: 'gray.200' }}
          onClick={handleNewTask}
        >
          + Asign Task
        </Button>
      </Flex>

      {/* Data Grid */}
      <Box mt={6} className="ag-theme-alpine" width="100%">
        <AgGridReact
          columnDefs={columnDefs}
          rowData={tasks}
          pagination={true}
          paginationPageSize={10}
          domLayout="autoHeight"
        />
      </Box>

      {/* Modal: Add New Task */}
      <Modal isOpen={isAddOpen} onClose={onAddClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Task</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              {/* Task Name Dropdown */}
              <FormControl isRequired>
                <FormLabel>Task Name</FormLabel>
                <Dropdown
                  type="tasks"
                  placeholder="Select Task"
                  selectedValue={newTask.task_Id}
                  setSelectedValue={(value) =>
                    setNewTask({ ...newTask, task_Id: value })
                  }
                />
              </FormControl>

              {/* Estimated Hours Field */}
              <FormControl isRequired>
                <FormLabel>Estimated Hours</FormLabel>
                <Input
                  type="number"
                  value={newTask.estimated_hours || ''}
                  onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      estimated_hours: e.target.value,
                    })
                  }
                  placeholder="Enter estimated hours"
                />
              </FormControl>

              {/* Status Dropdown */}
              <FormControl isRequired>
                <FormLabel>Status</FormLabel>

                <Dropdown
                  type="status"
                  placeholder="Select status"
                  selectedValue={newTask.status_id}
                  setSelectedValue={(value) =>
                    setNewTask({ ...newTask, status_id: value })
                  }
                />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="outline" mr={3} onClick={onAddClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleAssignTask}>
              Save Task
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal: Edit Task */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Task</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              {/* Team Name (Read-Only) */}
              <FormControl>
                <FormLabel>Task Name</FormLabel>
                <Input
                  type="text"
                  value={taskToEdit?.taskName || ""}
                  isReadOnly
                />
              </FormControl>
              {/* Estimated Hours Field */}
              <FormControl isRequired>
                <FormLabel>Estimated Hours</FormLabel>
                <Input
                  type="text"
                  value={taskToEdit?.estimatedHours || ""}
                  onChange={(e) =>
                    setTaskToEdit({
                      ...taskToEdit,
                      estimatedHours: e.target.value,
                    })
                  }
                  placeholder="Enter estimated hours"
                />
              </FormControl>

              {/* Status Dropdown */}
              <FormControl isRequired>
                <FormLabel>Status</FormLabel>
                <Dropdown
                  type="status"
                  placeholder="Select status"
                  selectedValue={taskToEdit.statusId || ""} 
                  setSelectedValue={(value) =>
                    setTaskToEdit({
                      ...taskToEdit,
                      statusId: value,
                    })
                  }
                />
 
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
          <Button variant="outline" mr={3} onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleSaveTask}>
              Save Task
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <AlertDialog
        isOpen={deleteDisclosure.isOpen}
        leastDestructiveRef={cancelRef}
        onClose={deleteDisclosure.onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Task
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete "{taskToDelete?.taskName}"
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={deleteDisclosure.onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default EditprojectGrid;
