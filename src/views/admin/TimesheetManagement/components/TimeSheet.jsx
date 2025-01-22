import React, { useState, useEffect, useRef } from 'react';
import './Timesheet.css';
import { FaCalendarAlt } from 'react-icons/fa';
import Select from 'react-select';
import {
  Box,
  Tooltip,
  Button,
  ModalFooter,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Input,
  useDisclosure,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  VStack,
} from '@chakra-ui/react';
import { AgGridReact } from 'ag-grid-react'; 
import 'ag-grid-community/styles/ag-grid.css'; 
import 'ag-grid-community/styles/ag-theme-alpine.css'; 
const taskData = [
  { id: 1, TaskName: 'Develop Login Module', description: 'Design and implement login functionality.',hours: [0, 0, 0, 0, 0, 0, 0] },
  { id: 2, TaskName: 'Optimize Database Queries', description: 'Improve database performance.' ,hours: [0, 0, 0, 0, 0, 0, 0]},
  { id: 3, TaskName: 'Bug Fixing - API Errors', description: 'Fix issues with API endpoints.' ,hours: [0, 0, 0, 0, 0, 0, 0]},
  { id: 4, TaskName: 'Update API Documentation', description: 'Add new endpoints and update the API documentation to reflect recent changes.',hours: [0, 0, 0, 0, 0, 0, 0] },
  { id: 5, TaskName: 'Implement User Role Management', description: 'Develop functionality to manage user roles and permissions.',hours: [0, 0, 0, 0, 0, 0, 0] },
  { id: 6, TaskName: 'Code Review for Payment Module', description: 'Conduct code reviews for the payment module to ensure best practices.',hours: [0, 0, 0, 0, 0, 0, 0] },
  { id: 7, TaskName: 'Fix UI Issues', description: 'Investigate and resolve alignment and responsiveness issues in the UI.',hours: [0, 0, 0, 0, 0, 0, 0] },
  { id: 8, TaskName: 'Write Unit Tests', description: 'Create and execute unit tests for critical application components.',hours: [0, 0, 0, 0, 0, 0, 0] },
  { id: 9, TaskName: 'Set Up CI/CD Pipeline', description: 'Configure a CI/CD pipeline for automated deployment and testing.' ,hours: [0, 0, 0, 0, 0, 0, 0]},
  { id: 10, TaskName: 'Refactor Authentication Code', description: 'Improve code structure and readability for the authentication module.',hours: [0, 0, 0, 0, 0, 0, 0] },
  { id: 11, TaskName: 'Integrate Third-party APIs', description: 'Integrate external APIs for real-time data synchronization.',hours: [0, 0, 0, 0, 0, 0, 0] },
];

const projectOptions = [
  { value: 'project1', label: 'Sage300', color: 'blue' },
  { value: 'project2', label: 'YellowStone', color: 'pink' },
  { value: 'project3', label: 'RubyCube', color: 'red' },
  { value: 'project4', label: 'SilverGreeks', color: 'green' },
  { value: 'project5', label: 'SageHRMS', color: 'purple' },
];

const customStyles = {
  option: (provided, state) => ({
    ...provided,
    color: state.data.color,
    backgroundColor: state.isSelected ? 'lightgray' : 'white',
  }),
  singleValue: (provided, state) => ({
    ...provided,
    color: state.data.color,
  }),
};

const Timesheet = () => {
  const getWeekKey = (date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1);
    return startOfWeek.toISOString().slice(0, 10);
  };
  
   // Add new state for time off modal
   const [isTimeOffModalOpen, setIsTimeOffModalOpen] = useState(false);
   const [timeOffData, setTimeOffData] = useState({
     type: 'Vacation',
     startDate: '',
     endDate: '',
     duration: 'All day',
   });

   // Add new types for time off dropdown
  const timeOffTypes = [
    'Vacation',
    'Sick Leave',
    'Personal Leave',
    'Work From Home',
    'Other'
  ];

  // Add new durations for dropdown
  const durationTypes = [
    'All day',
    'No. of hours'
  ];
 // Handle time off form changes
 const handleTimeOffChange = (field, value) => {
  setTimeOffData(prev => ({
    ...prev,
    [field]: value
  }));

  // Reset hours when switching duration type
  if (field === 'duration' && value === 'All day') {
    setTimeOffData(prev => ({
      ...prev,
      hours: ''
    }));
  }
};
const handleTimeOffSubmit = () => {
  // Add your time off submission logic here
  console.log('Time off submitted:', timeOffData);
  setIsTimeOffModalOpen(false);
  showToast('Time off request submitted successfully!', 'success');
};

  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasksByWeek')) || {};
    const currentWeekKey = getWeekKey(new Date());
    return savedTasks[currentWeekKey] || [];
  });
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('');
  const [newTaskName, setNewTaskName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [hoveredTaskId, setHoveredTaskId] = useState(null);
  const [showWeekends, setShowWeekends] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState([]); 
  const [searchTerm, setSearchTerm] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [filteredRowData, setFilteredRowData] = useState(taskData);
  const [selectedProjectValue, setSelectedProjectValue] = useState(null);
  // const [rowData, setRowData] = useState(taskData);
  // Modal handling functions
  const closeAddtaskModal = () => {
    setSearchTerm(''); // Reset search on close
    setFilteredRowData(taskData);
    setSelectedTasks([]); // Clear selected tasks
    onClose();
  };

  const handleSearchChange = (e) => {
    // Get the search value and convert to lowercase for case-insensitive search
    const searchValue = e.target.value.toLowerCase();
    // Update the search term state
    setSearchTerm(searchValue);
    // Filter the taskData based on search value
    const filtered = taskData.filter(task => 
        task.TaskName.toLowerCase().includes(searchValue) ||
        task.description.toLowerCase().includes(searchValue)
    );
    // Update the filtered data state
    setFilteredRowData(filtered);
  };

  let toastTimeout;
  const showToast = (message, type = '') => {
    clearTimeout(toastTimeout);
    setToastMessage(message);
    setToastType(type);
    toastTimeout = setTimeout(() => {
      setToastMessage('');
      setToastType('');
    }, 3000);
  };

  const dateInputRef = useRef(null);

  const handleDateChange = (e) => {
    const selected = new Date(e.target.value);
    setCurrentDate(selected);
    setSelectedDate(e.target.value);
  };

  useEffect(() => {
    const currentWeekKey = getWeekKey(currentDate);
    const savedTasksByWeek =
      JSON.parse(localStorage.getItem('tasksByWeek')) || {};
    setTasks(savedTasksByWeek[currentWeekKey] || []);
  }, [currentDate]);

  useEffect(() => {
    const currentWeekKey = getWeekKey(currentDate);
    const savedTasksByWeek =
      JSON.parse(localStorage.getItem('tasksByWeek')) || {};
    savedTasksByWeek[currentWeekKey] = tasks;
    localStorage.setItem('tasksByWeek', JSON.stringify(savedTasksByWeek));
  }, [tasks, currentDate]);

  const handleTaskNameChange = (e) => {
    setNewTaskName(e.target.value);
  };

  const addTask = () => {
    // Step 1: Validate task selection
    if (selectedTasks.length === 0) {
        alert('Please select at least one task!');
        return;
    }

    // Step 2: Filter valid tasks
    const validTasks = selectedTasks.filter(
        (task) => task && task.TaskName && task.description
    );
    if (validTasks.length === 0) {
        alert('Selected tasks are invalid!');
        return;
    }

    // Step 3: Validate project selection
    const selectedProject = projectOptions.find(
        (project) => project.value === selectedProjectValue
    );
    if (!selectedProject) {
        alert('Please select a valid project!');
        return;
    }

    // Step 4: Prepare tasks with initial data
    const enhancedTasks = validTasks.map((task) => ({
        ...task,
        hours: Array(7).fill(0),  // Initialize week hours to zero
        project: selectedProject,  // Add project information
    }));

    // Step 5: Add tasks to state
    setTasks((prevTasks) => [...prevTasks, ...enhancedTasks]);

    // Step 6: Clean up
    setSelectedTasks([]);
    closeAddtaskModal();

    // Step 7: Show success toast
    const taskCount = validTasks.length;
    const message = taskCount === 1 
        ? 'Task added successfully!' 
        : `${taskCount} tasks added successfully!`;
    showToast(message, 'success');
};

  const handleProjectChange = (selectedOption) => {
    if (selectedOption) {
      setSelectedProjectValue(selectedOption.value);
    }
  };
  

  const handleToggleWeekends = (state) => {
    setShowWeekends(state);
  };

  const submitWeek = () => {
    showToast('Week submitted successfully!', 'success');
  };

  const savedraft = () => {
    showToast('Draft submitted successfully!', 'success');
  };
  
  const deleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
    showToast('Task deleted successfully!', 'success');
  };

  const handleHourChange = (taskId, dayIndex, value) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        const updatedHours = [...task.hours];
        updatedHours[dayIndex] = parseFloat(value) || 0;
        return { ...task, hours: updatedHours };
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  const closeModal = () => setIsModalOpen(false);

  const weekDays = [...Array(7)].map((_, i) => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() - date.getDay() + i + 1);
    return date;
  });

  const filteredWeekDays = Array.isArray(weekDays)
    ? showWeekends
      ? weekDays
      : weekDays.filter((day) => day.getDay() !== 0 && day.getDay() !== 6)
    : [];

  // const calculateProgress = (dayIndex) => {
  //   const totalHours = tasks.reduce(
  //     (sum, task) => sum + task.hours[dayIndex],
  //     0,
  //   );
  //   const regularHours = Math.min(totalHours, 8);
  //   const overtime = Math.max(totalHours - 8, 0);
  //   return { regularHours, overtime, totalHours };
  // };

  const calculateProgress = (dayIndex) => {
    const totalHours = tasks.reduce((sum, task) => {
      // Ensure task.hours is defined and is an array with a value for dayIndex
      const hoursForTask = task.hours || Array(7).fill(0);  // Default to an array of zeros if hours is missing
      return sum + (hoursForTask[dayIndex] || 0); // Default to 0 if no hour value for that day
    }, 0);
  
    const regularHours = Math.min(totalHours, 8);
    const overtime = Math.max(totalHours - 8, 0);
    return { regularHours, overtime, totalHours };
  };

  const calculateWeeklyProgress = () => {
    const totalWeeklyHours = tasks.reduce(
      (sum, task) => sum + task.hours.reduce((subSum, h) => subSum + h, 0),
      0,
    );
    const maxWeeklyHours = 7 * 8;
    return Math.min((totalWeeklyHours / maxWeeklyHours) * 100, 100);
  };

  const getFormattedWeekRange = () => {
    const startOfWeek = weekDays[0];
    const endOfWeek = weekDays[6];

    const startFormatted = startOfWeek.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    const endFormatted = endOfWeek.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    return `${startFormatted} - ${endFormatted}`;
  };

  const columnDefs = [
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      width: 50,
    },
    { headerName: 'Task Name', field: 'TaskName', sortable: true, filter: true },
    {
      headerName: 'Description',
      field: 'description',
      sortable: true,
      filter: true,
    },
  ];
  const handleSelectionChanged = (e) => {
    const selectedNodes = e.api.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
 
    // Filter out any invalid tasks
    const validSelectedTasks = selectedData.filter(
      (task) => task && task.TaskName && task.description
    );
 
    setSelectedTasks(validSelectedTasks);
 
    // Set focus to the first selected row
    if (selectedNodes.length > 0) {
      const firstSelectedNode = selectedNodes[0];
      e.api.ensureNodeVisible(firstSelectedNode);
      e.api.setFocusedCell(firstSelectedNode.rowIndex, 'TaskName');
    }
  };
 
  
  // At the top of your component with other state declarations
const [deleteConfirmation, setDeleteConfirmation] = useState({
  isOpen: false,  // Controls whether the popup is visible
  taskId: null    // Stores which task is being deleted
});
// Function to show the delete confirmation popup
const showDeleteConfirmation = (taskId) => {
  setDeleteConfirmation({
    isOpen: true,  // Open the popup
    taskId: taskId // Store the task ID to be deleted
  });
};

// Function to handle confirmation of delete
const handleDeleteConfirm = () => {
  if (deleteConfirmation.taskId) {
    // Only delete if we have a valid taskId
    setTasks(tasks.filter((task) => task.id !== deleteConfirmation.taskId));
    showToast('Task deleted successfully!', 'success');
  }
  // Reset the confirmation state
  setDeleteConfirmation({ isOpen: false, taskId: null });
};

// Function to handle cancellation of delete
const handleDeleteCancel = () => {
  // Just reset the confirmation state
  setDeleteConfirmation({ isOpen: false, taskId: null });
};
   // Add the Time Off Modal component
   const TimeOffModal = () => (
    <Modal isOpen={isTimeOffModalOpen} onClose={() => setIsTimeOffModalOpen(false)}>
      <ModalOverlay />
      <ModalContent maxWidth="400px">
        <ModalHeader>Time Off</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div className="time-off-form">
            <div className="form-group">
              <label>Type</label>
              <select 
                value={timeOffData.type}
                onChange={(e) => handleTimeOffChange('type', e.target.value)}
                className="form-control"
              >
                {timeOffTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="form-group date-range">
              <div>
                <label>Start</label>
                <input 
                  type="date"
                  value={timeOffData.startDate}
                  onChange={(e) => handleTimeOffChange('startDate', e.target.value)}
                  className="form-control"
                />
              </div>
              <div>
                <label>End</label>
                <input 
                  type="date"
                  value={timeOffData.endDate}
                  onChange={(e) => handleTimeOffChange('endDate', e.target.value)}
                  className="form-control"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Duration</label>
              <select 
                value={timeOffData.duration}
                onChange={(e) => handleTimeOffChange('duration', e.target.value)}
                className="form-control"
              >
                {durationTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
    {/* Show hours input only when "No. of hours" is selected */}
    {timeOffData.duration === 'No. of hours' && (
              <div className="form-group">
                <label>Hours</label>
                <div className="hours-input-container" style={{ position: 'relative' }}>
                  <input
                    type="number"
                    min="0"
                    max="24"
                    value={timeOffData.hours}
                    onChange={(e) => handleTimeOffChange('hours', e.target.value)}
                    className="form-control"
                    style={{ paddingRight: '40px' }}
                  />
                  <span style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#666',
                    pointerEvents: 'none'
                  }}>
                    hrs
                  </span>
                </div>
              </div>
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setIsTimeOffModalOpen(false)}>Cancel</Button>
          <Button colorScheme="blue" onClick={handleTimeOffSubmit}>Save</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
  // AG-Grid rowData
  const rowData = taskData;

  return (
    <Box p={8} bg="white" minH="94vh" minW="100vh">
      <Heading mb={5} padding="10px" marginTop="-3.5">
        Timesheet
      </Heading>
         {/* Update the timeoff button in the task-addition div */}
         <div className="task-addition">
         <div class="left-buttons">
          </div>
          <div class="right-buttons"></div>
        {/* ... other buttons ... */}
        <div>
          {/* <button id="timeoff" onClick={() => setIsTimeOffModalOpen(true)}>Timeoff</button> */}
        </div>
        {/* ... other buttons ... */}
      </div>
        {/* Add the TimeOffModal component */}
        <TimeOffModal />
      
      {/* ... (rest of the existing JSX) */}

      <Tabs variant="line" colorScheme="gray" mt={4} px={6}>
        <TabList>
          <Tab
            _selected={{
              borderBottomColor: 'gray.600',
              color: 'gray.800',
              fontWeight: 'semibold',
            }}
          >
            My Timesheet
          </Tab>
          <Tab
            _selected={{
              borderBottomColor: 'gray.600',
              color: 'gray.800',
              fontWeight: 'semibold',
            }}
          >
            Timesheets
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <VStack spacing={10} align="stretch">
              <div>
                  <div className="timesheet-container">
                    {toastMessage && (
                      <div className={`toast ${toastType}`}>{toastMessage}</div>
                    )}
                    {/* navigation button controls   */}
                    <div className="timesheet-header">
                      <h3>{getFormattedWeekRange()}</h3>
                      <div
                        className="week-controls"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                        }}
                      >
                        <button
                          onClick={() =>
                            setCurrentDate(
                              new Date(
                                currentDate.setDate(currentDate.getDate() - 7),
                              ),
                            )
                          }
                          id="head"
                        >
                          ◀️ Previous
                        </button>
                        <input
                          ref={dateInputRef}
                          type="date"
                          value={
                            selectedDate ||
                            currentDate.toISOString().slice(0, 10)
                          }
                          onChange={handleDateChange}
                          style={{
                            position: 'absolute',
                            opacity: 0,
                            width: 0,
                            height: 0,
                            pointerEvents: 'none',
                          }}
                        />
                        {/* Calendar Icon */}
                        <FaCalendarAlt
                          size={20}
                          style={{ cursor: 'pointer', color: '#495057' }}
                          onClick={() => dateInputRef.current.showPicker()}
                        />
                        <button
                          onClick={() =>
                            setCurrentDate(
                              new Date(
                                currentDate.setDate(currentDate.getDate() + 7),
                              ),
                            )
                          }
                          id="head"
                        >
                          Next ▶️
                        </button>
                      </div>
                    </div>

                    {/* Add Task */}
                    <div className="task-addition">
                      <button onClick={onOpen}>+ Add Task</button>
                      {/* toggle slider */}
                      <div
                        style={{
                          marginLeft: '20px',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                         <div className="weekend-toggle-container"></div>
                        <label className="toggle-switch">
                          <input
                            type="checkbox"
                            checked={showWeekends}
                            onChange={(e) =>
                              handleToggleWeekends(e.target.checked)
                            }
                          />
                          <span className="slider round"></span>
                        </label>
                        <label style={{  fontSize: '12px' }}>
                          Show Weekends
                        </label>
                      </div>
                      {/* timeoff model */}
                      <div>
                      <button id="timeoff" onClick={() => setIsTimeOffModalOpen(true)}>Timeoff</button>
                      </div>
                      <div>
                        <button onClick={submitWeek}>Submit Week</button>
                      </div>
                    </div>
                    

                    {/* Timesheet table */}
                    <table className="timesheet-table">
                      <thead>
                        <tr>
                          <th style={{ textAlign: 'center' }}>Tasks</th>
                          {filteredWeekDays.map((day, index) => {
                            const { regularHours, overtime, totalHours } =
                              calculateProgress(index);
                            const progressColor =
                              totalHours < 8
                                ? '#c93434'
                                : totalHours === 8
                                  ? '#85e085'
                                  : '#85e085';

                            return (
                              <th key={index}>
                                {day.toLocaleDateString('en-US', {
                                  weekday: 'short',
                                  day: 'numeric',
                                })}
                                <div
                                  className="progress-bar"
                                  title={`Regular: ${regularHours}h, Overtime: ${overtime}h, Total: ${totalHours}h`}
                                >
                                  {/* Regular Hours */}
                                  <div
                                    className="progress regular"
                                    style={{
                                      width: `${(regularHours / 8) * 100}%`,
                                      backgroundColor: progressColor,
                                    }}
                                  ></div>

                                  {/* Overtime Hours */}
                                  {overtime > 0 && (
                                    <div
                                      className="progress overtime"
                                      style={{
                                        width: `${(overtime / 8) * 100}%`,
                                        backgroundColor: '#ffa500',
                                      }}
                                    ></div>
                                  )}
                                </div>
                              </th>
                            );
                          })}
                          <th>
                            Total
                            <div className="progress-bar">
                              <div
                                className="progress"
                                style={{
                                  width: `${calculateWeeklyProgress()}%`,
                                  backgroundColor: '#85e085',
                                }}
                              ></div>
                            </div>
                          </th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tasks.map((task) => (
                          <tr key={task.id}>
                            <td id="col1">
                              <div style={{display:'flex',alignItems: 'center', height: '40px', }}>                           
                                <div
                                  style={{
                                    width: '2px',
                                    height: '100%', 
                                    backgroundColor: task.project.color, 
                                    marginRight: '5px',
                                  }}
                                >
                                </div>
                                <span className="task-name" style={{
                                    lineHeight: '1.2',
                                    fontSize: '14px', 
                                  }}
                                >{task.TaskName || 'Untitled Task'}</span>
                              </div>
                            </td>
                            {/* Hour Inputs for Each Day */}
                            {filteredWeekDays.map((_, dayIndex) => (
                              <td key={dayIndex}>
                                <input
                                  type="number"
                                  min="0"
                                  value={task.hours[dayIndex] || 0}
                                  onChange={(e) =>
                                    handleHourChange(
                                      task.id,
                                      dayIndex,
                                      e.target.value,
                                    )
                                  }
                                  className={
                                    task.hours[dayIndex] === 0
                                      ? 'disabled-input'
                                      : 'normal-input'
                                  }
                                  onFocus={(e) =>
                                    (e.target.style.border = '1px solid gray')
                                  }
                                  onBlur={(e) =>
                                    (e.target.style.border = 'none')
                                  }
                                />
                              </td>
                            ))}
                            <td>
                              {task.hours.reduce((sum, h) => sum + h, 0)}h
                            </td>
                             <td>
                      <Tooltip label="Delete Task" placement="top">
                           <button
                      className="icon-button"
      onClick={() => showDeleteConfirmation(task.id)}  // Changed from deleteTask
    >
      <i className="fas fa-trash"></i>
    </button>
  </Tooltip>
</td>
                          </tr>
                        ))}
                      </tbody>
                     <Modal 
  isOpen={deleteConfirmation.isOpen} 
  onClose={handleDeleteCancel}
>
  <ModalOverlay />
  <ModalContent>
    <ModalHeader>Delete Task</ModalHeader>
    <ModalCloseButton />
    <ModalBody>
      Are you sure you want to delete this task?
    </ModalBody>
    <ModalFooter>
      <Button colorScheme="gray" mr={3} onClick={handleDeleteCancel}>
        Cancel
      </Button>
      <Button colorScheme="red" onClick={handleDeleteConfirm}>
        Delete
      </Button>
    </ModalFooter>
  </ModalContent>
</Modal>
                      <tfoot>
                        <tr>
                          <td id="col1">Total</td>
                          {filteredWeekDays.map((_, dayIndex) => (
                            <td key={dayIndex}>
                              {tasks.reduce(
                                (sum, task) => sum + task.hours[dayIndex],
                                0,
                              )}
                              h
                            </td>
                          ))}
                          <td>
                            {tasks.reduce(
                              (sum, task) =>
                                sum +
                                task.hours.reduce((subSum, h) => subSum + h, 0),
                              0,
                            )}
                            h
                          </td>
                          <td>
                            <button id="savedraft" onClick={savedraft}>
                              Save Draft
                            </button>
                          </td>
                        </tr>
                      </tfoot>
                      <div className="project-legend" style={{ marginTop: '20px' }}>
                        {[
                          ...new Map(
                            tasks.map((task) => [task.project.label, task.project])
                          ).values(),
                        ].map((project, index) => (
                          <div
                            key={index}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              marginRight: '15px',
                            }}
                          >
                            {/* Color Box */}
                            <div
                              style={{
                                width: '10px',
                                height: '10px',
                                borderRadius: '50px',
                                backgroundColor: project.color,
                                marginRight: '5px',
                              }}
                            ></div>
                            {/* Project Name */}
                            <span style={{ fontSize: '12px', color: '#333' }}>{project.label}</span>
                          </div>
                        ))}
                      </div>
                    </table> 
       {/* Updated Add Task Modal */}
      <Modal isOpen={isOpen} onClose={closeAddtaskModal}>
        <ModalOverlay />
        <ModalContent borderRadius="md" p={4} maxWidth="700px" maxHeight="650px">
          <ModalHeader textAlign="left" fontSize="2xl" fontWeight="bold">Add a New Task</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className='addtaskmodal'>
              {/* Removed the first search textbox, keeping only one */}
              <Input
                type="text"
                placeholder="🔍 Search Tasks..."
                value={searchTerm}
                onChange={handleSearchChange}
                bg="white"
                focusBorderColor="blue.300"
                size="sm"
                width="170px"
                fontSize="12px"
                borderRadius={"md"}
                mb={2}
              />
              <Select
                options={projectOptions}
                styles={customStyles}
                onChange={handleProjectChange}
              />
            </div>
            <div
              className="ag-theme-alpine"
              style={{
                height: '300px',
                width: '100%',
                marginTop: '10px',
              }}
            >
             <AgGridReact
               columnDefs={columnDefs}
               rowData={filteredRowData}
                rowSelection="multiple"
               suppressNavigable="true"  
                onSelectionChanged={handleSelectionChanged}
                 />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={addTask}>
              Add Task
            </Button>
            <Button
              variant="ghost"
              onClick={closeAddtaskModal}
              ml={3}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal> <Modal isOpen={isOpen} onClose={closeAddtaskModal}>
      <ModalOverlay />
      <ModalContent borderRadius="md" p={4} maxWidth="700px" maxHeight="650px">
        <ModalHeader textAlign="left" fontSize="2xl" fontWeight="bold">Add a New Task</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div className='addtaskmodal' style={{
            display: 'flex',
            gap: '16px',
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <Input
              type="text"
              placeholder="🔍 Search Tasks..."
              value={searchTerm}
              onChange={handleSearchChange}
              bg="white"
              focusBorderColor="blue.300"
              size="sm"
              width="250px"
              fontSize="12px"
              borderRadius="md"
            />
            <div style={{ width: "250px" }}>
              <Select
                options={projectOptions}
                styles={{
                  ...customStyles,
                  container: (provided) => ({
                    ...provided,
                    width: '100%'
                  }),
                  control: (provided) => ({
                    ...provided,
                    minHeight: '32px',
                    height: '32px'
                  }),
                  valueContainer: (provided) => ({
                    ...provided,
                    height: '32px',
                    padding: '0 6px'
                  }),
                  input: (provided) => ({
                    ...provided,
                    margin: '0px'
                  }),
                  indicatorsContainer: (provided) => ({
                    ...provided,
                    height: '32px'
                  })
                }}
                onChange={handleProjectChange}
                placeholder="Select Project"
              />
            </div>
          </div>
          <div
            className="ag-theme-alpine"
            style={{
              height: '300px',
              width: '100%'
            }}
          >
            <AgGridReact
              columnDefs={columnDefs}
              rowData={filteredRowData}
              rowSelection="multiple"
              onSelectionChanged={handleSelectionChanged}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={addTask}>
            Add Task
          </Button>
          <Button
            variant="ghost"
            onClick={closeAddtaskModal}
            ml={3}
          >
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
                  </div>
              </div>
            </VStack>
          </TabPanel>
          <TabPanel>
            <p>This is another tab's content.</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};
export default Timesheet;
