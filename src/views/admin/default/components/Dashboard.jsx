import React from 'react';
import {
  Box,
  Flex,
  Heading,
  SimpleGrid,
  VStack,
  Text,
  HStack,
  Icon,
  Button,
  Checkbox,
  Progress,
  Divider,
} from '@chakra-ui/react';
import { FaClock, FaTasks, FaProjectDiagram, FaCheckCircle } from 'react-icons/fa';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Chart Data
const dailyData = [
  { day: 'Mon', 'Develop Login Module': 8, 'Bug Fixing - API Errors': 0, 'Implement User Role Management': 0, 'Refactor Authentication Code': 0 },
  { day: 'Tue', 'Develop Login Module': 2, 'Bug Fixing - API Errors': 2, 'Implement User Role Management': 2, 'Refactor Authentication Code': 2 },
  { day: 'Wed', 'Develop Login Module': 0, 'Bug Fixing - API Errors': 7, 'Implement User Role Management': 0, 'Refactor Authentication Code': 0 },
  { day: 'Thu', 'Develop Login Module': 0, 'Bug Fixing - API Errors': 0, 'Implement User Role Management': 0, 'Refactor Authentication Code': 6 },
  { day: 'Fri', 'Develop Login Module': 0, 'Bug Fixing - API Errors': 0, 'Implement User Role Management': 4, 'Refactor Authentication Code': 3 },
];

const projectChartData = {
  labels: ['Completed', 'In Progress', 'To Do'],
  datasets: [
    {
      label: 'Projects',
      data: [3, 5, 2],
      backgroundColor: ['#48bb78', '#4299e1', '#f56565'],
      hoverBackgroundColor: ['#38a169', '#3182ce', '#e53e3e'],
    },
  ],
};

const projectChartOptions = {
  plugins: {
    legend: {
      position: 'top',
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          const label = context.label || '';
          const value = context.raw || 0;
          return `${label}: ${value}`;
        },
      },
    },
  },
};

// Overview Card Component
const OverviewCard = ({ icon, title, value, bgColor }) => {
  return (
    <Flex
      direction="row"
      align="center"
      bg={bgColor}
      borderRadius="md"
      p={4}
      shadow="sm"
      color="white"
    >
      <Box mr={4} fontSize="2xl">
        <Icon as={icon} />
      </Box>
      <Box>
        <Text fontSize="sm">{title}</Text>
        <Heading as="h3" size="md">
          {value}
        </Heading>
      </Box>
    </Flex>
  );
};

// Projects and Tasks Component
const ProjectsAndTasks = () => {
  const projectData = [
    {
      title: 'Cryptadvance App',
      progress: 20,
      tasks: [
        { name: 'Responsive - dark version', time: '2h 32min', completed: true },
        { name: 'Mobile app - dark version', time: '45min', completed: false },
        { name: 'Dashboard - dark version', time: '1h 22min', completed: false },
      ],
    },
    {
      title: 'Landing Page',
      progress: 36,
      tasks: [
        { name: 'Team Member - light version', time: '4h 33min', completed: true },
        { name: 'Contact - light version', time: '12min', completed: false },
        { name: 'About Us - light version', time: '1h 15min', completed: false },
        { name: 'Home page - light version', time: '49min', completed: true },
      ],
    },
  ];

  return (
    <Box 
      borderWidth="1px" 
      borderRadius="lg" 
      p={5} 
      bg="white" 
      shadow="sm"
      height="100%"
      width="100%"
    >
      <Heading as="h3" size="md" mb={4}>
        Projects & Tasks
      </Heading>
      <VStack align="stretch" spacing={4} maxH="400px" overflowY="auto">
        {projectData.map((project, index) => (
          <Box 
            key={index} 
            borderWidth="1px" 
            borderRadius="lg" 
            p={4} 
            bg="white" 
            shadow="sm"
          >
            <Flex justify="space-between" align="center" mb={3}>
              <Text fontWeight="bold" fontSize="md">
                {project.title}
              </Text>
              <Text fontSize="sm" color="gray.600">
                {project.progress}%
              </Text>
            </Flex>
            <Progress 
              value={project.progress} 
              size="sm" 
              colorScheme="blue" 
              mb={4} 
            />
            <VStack align="stretch" spacing={2}>
              {project.tasks.map((task, taskIndex) => (
                <Flex 
                  key={taskIndex} 
                  align="center" 
                  justify="space-between"
                  p={2}
                >
                  <Flex align="center">
                    <Checkbox 
                      isChecked={task.completed} 
                      colorScheme="blue" 
                      mr={2}
                      size="sm"
                    />
                    <Text fontSize="sm">{task.name}</Text>
                  </Flex>
                  <Text fontSize="xs" color="gray.600">
                    {task.time}
                  </Text>
                </Flex>
              ))}
            </VStack>
          </Box>
        ))}
      </VStack>
    </Box>
  );
}

// Updated TimesheetDetails Component
const TimesheetDetails = () => {
  const timesheetData = [
    {
      category: 'Design',
      percentage: 62,
      color: '#8066FF'  // Updated to purple color from screenshot
    },
    {
      category: 'Meetings',
      percentage: 27,
      color: '#2E7D6F'  // Updated to teal color from screenshot
    },
    {
      category: 'Testing',
      percentage: 41,
      color: '#FF9898'  // Updated to pink color from screenshot
    },
    {
      category: 'Bug Fixing',
      percentage: 55,
      color: '#DDDDDD'  // Updated to light gray from screenshot
    }
  ];

  const categoryDetails = [
    {
      label: 'Design',
      percentage: 59,
      duration: '3 hr 44 min',
      color: '#333333',  // Darker color for percentage text
      barColor: '#333333'  // Progress bar color
    },
    {
      label: 'Video Conference',
      percentage: 12,
      duration: '45 min',
      color: '#333333',
      barColor: '#333333'
    },
    {
      label: 'Work Messaging',
      percentage: 10,
      duration: '37 min',
      color: '#333333',
      barColor: '#333333'
    }
  ];

  return (
    <Box flex="1" p={4} bg="white" borderRadius="lg" shadow="sm">
      <VStack align="stretch" spacing={8}>
        {/* Total Time Section */}
        <Box>
        <Heading as="h3" size="md" mb={4}>
            Daily Categories Percentage
          </Heading>
          <SimpleGrid columns={2} spacing={4}>
            <Box>
              <Text color="#666666" fontSize="sm">Total time worked</Text>
              <Heading size="lg">6 hr 18 min</Heading>
            </Box>
            <Box>
              <Text color="#666666" fontSize="sm">Percent of work day</Text>
              <HStack spacing={2} align="baseline">
                <Heading size="lg" color="#333333">79%</Heading>
                <Text color="#666666" fontSize="sm">of 8 hr 0 min</Text>
              </HStack>
            </Box>
          </SimpleGrid>
        </Box>

        {/* Category Circles */}
        <SimpleGrid columns={4} spacing={4}>
          {timesheetData.map((item, index) => (
            <Box key={index} textAlign="center">
              <Box position="relative" width="full" pb="4">
                <Box
                  as="svg"
                  viewBox="0 0 36 36"
                  width="100%"
                  height="100%"
                >
                   {/* Background circle */}
                   <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    stroke="#F5F5F5"  // Updated to lighter gray for background
                    strokeWidth="3"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    stroke={item.color}
                    strokeWidth="3"
                    strokeDasharray={`${item.percentage} 100`}
                    transform="rotate(-90 18 18)"
                    strokeLinecap="round"
                  />
                </Box>
                <Text fontSize="lg" fontWeight="bold">{item.percentage}%</Text>
                </Box>
              <Text color="#666666" fontSize="sm">{item.category}</Text>
            </Box>
          ))}
        </SimpleGrid>

        {/* Top Categories */}
        <Box>
          <Text color="#666666" fontSize="sm" mb={4}>Top categories</Text>
          <VStack spacing={3} align="stretch">
            {categoryDetails.map((category, index) => (
              <Box key={index}>
                <Flex justify="space-between" mb={1}>
                  <HStack spacing={2}>
                    <Text color={category.color} fontSize="sm" fontWeight="medium">
                      {category.percentage}%
                    </Text>
                    <Text fontSize="sm" color="#333333">
                      {category.label}
                    </Text>
                  </HStack>
                  <Text color="#666666" fontSize="sm">{category.duration}</Text>
                </Flex>
                <Progress 
                  value={category.percentage}
                  size="xs"
                  bg="#F5F5F5"
                  sx={{
                    '& > div': {
                      background: category.barColor
                    }
                  }}
                  borderRadius="full"
                />
              </Box>
            ))}
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  return (
    <Box p={5} bg="gray.50" minH="100vh">
      {/* Header */}
      <Heading as="h1" size="xl" mb={8} textAlign="left">
        Dashboard
      </Heading>

      {/* Overview Section */}
      <SimpleGrid columns={[1, 2, 4]} spacing={6} mb={8}>
        <OverviewCard
          icon={FaClock}
          title="Total Hours"
          value="64h"
          bgColor="blue.400"
        />
        <OverviewCard
          icon={FaTasks}
          title="Tasks Completed"
          value="10"
          bgColor="green.400"
        />
        <OverviewCard
          icon={FaProjectDiagram}
          title="Active Projects"
          value="5"
          bgColor="orange.400"
        />
        <OverviewCard
          icon={FaCheckCircle}
          title="Completed Projects"
          value="3"
          bgColor="teal.400"
        />
      </SimpleGrid>

      {/* Charts Section */}
      <SimpleGrid columns={[1, null, 2]} spacing={6} mb={8}>
        <Box borderWidth="1px" borderRadius="lg" p={5} bg="white" shadow="sm">
          <Heading as="h3" size="md" mb={4}>
            Daily Hours Task Distribution
          </Heading>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="Develop Login Module"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
              <Line
                type="monotone"
                dataKey="Bug Fixing - API Errors"
                stroke="#82ca9d"
              />
              <Line
                type="monotone"
                dataKey="Implement User Role Management"
                stroke="#ffc658"
              />
              <Line
                type="monotone"
                dataKey="Refactor Authentication Code"
                stroke="#ff8042"
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
        <Box borderWidth="1px" borderRadius="lg" p={5} bg="white" shadow="sm">
          <Heading as="h3" size="md" mb={4}>
            Project Progress
          </Heading>
          <Box width="300px" height="300px" mx="auto">
            <Pie data={projectChartData} options={projectChartOptions} />
          </Box>
        </Box>
      </SimpleGrid>

      {/* Bottom Section */}
      <SimpleGrid columns={[1, null, 2]} spacing={6}>
        <Box>
          <ProjectsAndTasks />
        </Box>
        <Box>
          <TimesheetDetails />
        </Box>
      </SimpleGrid>
    </Box>
  );
};

export default Dashboard;