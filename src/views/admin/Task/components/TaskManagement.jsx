import React, { useState, useMemo, useEffect } from 'react';

import {
  Box,
  Heading,
  Button,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useToast,
  Text,
  IconButton,
  Tooltip,
  Select,
} from '@chakra-ui/react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Pencil, Trash2, Plus, Search } from 'lucide-react';
import { fetchTasks, addTasks, EditTasks, deleteTask } from 'utils/api';

const Taskmanagement = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [filters, setFilters] = useState({ search: '' });
  const [newTask, setNewTask] = useState({
    taskName: '',
    description: '',
    status: 'Not Started',
    startDate: '',
    endDate: '',
  });
  const [modalState, setModalState] = useState({
    type: null,
    isOpen: false,
  });

  const toast = useToast();

  useEffect(() => {
    const fetchTaskData = async () => {
      try {
        const data = await fetchTasks();
        setTasks(data);
      } catch (error) {
        toast({
          title: 'Error Fetching Tasks',
          description:
            error.response?.data?.message ||
            'Unable to load tasks from the server.',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top-end',
        });
      }
    };
    fetchTaskData();
  }, []);

  const filteredTask = tasks.filter((task) =>
    task.taskName?.toLowerCase().includes(filters.search.toLowerCase()),
  );

  // Add new task
  const handleAddTask = async () => {
    if (!newTask.taskName || !newTask.description) {
      toast({
        title: 'Validation Error',
        description: 'Task Name, Description',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-end',
      });
      return;
    }

    try {
      const addedTask = await addTasks(newTask);
      setTasks((prevTasks) => [addedTask, ...prevTasks]);
      toast({
        title: 'Task Added',
        description: `${newTask.taskName} has been added successfully.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-end',
      });
      closeModal();
    } catch (error) {
      toast({
        title: 'Error Adding Task',
        description:
          error.response?.data?.message ||
          'Unable to add the task. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-end',
      });
    }
  };

  // Edit existing task
  const handleEditTask = async () => {
    if (!newTask.taskName || !newTask.description) {
      toast({
        title: 'Validation Error',
        description: 'Task Name, Description ',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-end',
      });
      return;
    }

    try {
      const response = await EditTasks(newTask.id, newTask);
      setTasks(tasks.map((t) => (t.id === response.id ? response : t)));
      toast({
        title: 'Task Updated',
        description: `${newTask.taskName} has been updated successfully.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-end',
      });
      closeModal();
    } catch (error) {
      toast({
        title: 'Error Updating Task',
        description:
          error.response?.data?.message ||
          'Unable to update the task. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-end',
      });
    }
  };

  // Delete task
  const handleDeleteTask = async () => {
    try {
      await deleteTask(selectedTask.id);
      setTasks(tasks.filter((t) => t.id !== selectedTask.id));
      toast({
        title: 'Task Deleted',
        description: `${selectedTask.taskName} has been removed.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-end',
      });
      closeModal();
    } catch (error) {
      toast({
        title: 'Error Deleting Task',
        description:
          error.response?.data?.message ||
          'Unable to delete the task. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
    }
  };

  const columnDefs = useMemo(
    () => [
      {
        headerName: 'Task Name',
        field: 'taskName',
        sortable: true,
        filter: true,
        flex: 1,
      },
      { headerName: 'Description', field: 'description', flex: 2 },

      {
        headerName: 'Actions',
        field: 'actions',
        flex: 1,
        cellRenderer: (params) => (
          <Box display="flex" justifyContent="left">
            <Tooltip label="Edit Task" placement="top">
              <button
                className="icon-button"
                // disabled={!canEdit}
                onClick={() => openModal('edit', params.data)}
              >
                <i className="fas fa-edit"></i>
              </button>
            </Tooltip>
            <Tooltip label="Delete Team" placement="top">
              <button
                className="icon-button"
                // disabled={!canDelete}
                onClick={() => openModal('delete', params.data)}
              >
                <i className="fas fa-trash"></i>
              </button>
            </Tooltip>
          </Box>
        ),
      },
    ],
    [],
  );

  const openModal = (type, task = null) => {
    setModalState({ type, isOpen: true });
    if (task) {
      setSelectedTask(task);
      if (type === 'edit') {
        setNewTask(task);
      }
    }
  };

  const closeModal = () => {
    setModalState({ type: null, isOpen: false });
    setNewTask({
      taskName: '',
      description: '',
      status: 'Not Started',
      startDate: '',
      endDate: '',
    });
    setSelectedTask(null);
  };

  return (
    <Box p={8} bg="white" minH="94vh">
      <Heading mb={5}>Task Management</Heading>

      {/* Search and Add Task */}
      <Box mb={6} display="flex" gap={4}>
        <Input
          placeholder="🔍 Search Tasks..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          size="sm"
          width="250px"
        />
        <Button
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
          onClick={() => openModal('add')}
        >
          Add Task
        </Button>
      </Box>
      <div className="ag-theme-alpine" style={{ height: 500, width: '100%' }}>
        <AgGridReact
          rowData={filteredTask}
          columnDefs={columnDefs}
          defaultColDef={{ resizable: true }}
          pagination={true}
          paginationPageSize={10}
        />
      </div>

      <Modal isOpen={modalState.isOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {modalState.type === 'add'
              ? 'Add New Task'
              : modalState.type === 'edit'
                ? 'Edit Task'
                : 'Delete Task'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {modalState.type !== 'delete' ? (
              <>
                <Input
                  placeholder="Task Name"
                  value={newTask.taskName}
                  onChange={(e) =>
                    setNewTask({ ...newTask, taskName: e.target.value })
                  }
                  mb={3}
                />
                <Input
                  placeholder="Task Description"
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                  mb={3}
                />
              </>
            ) : (
              <Text>Are you sure you want to delete this task?</Text>
            )}
          </ModalBody>

          <ModalFooter>
            {modalState.type === 'delete' ? (
              <>
                <Button colorScheme="red" onClick={handleDeleteTask}>
                  Delete
                </Button>
                <Button variant="ghost" onClick={closeModal}>
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  colorScheme="blue"
                  onClick={
                    modalState.type === 'edit' ? handleEditTask : handleAddTask
                  }
                >
                  Save
                </Button>
                <Button variant="ghost" onClick={closeModal}>
                  Cancel
                </Button>
              </>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Taskmanagement;
