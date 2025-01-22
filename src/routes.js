import React from 'react';
import { Icon, Text } from '@chakra-ui/react';
import * as MdIcons from 'react-icons/md';
import menuConfig from './menuConfig.json';

// Component Imports
import MainDashboard from 'views/admin/default';
import Timesheet from 'views/admin/TimesheetManagement';
import Usermanagement from 'views/admin/UserManagement';
import ProjectManagement from 'views/admin/ProjectManagement';
import TeamManagement from 'views/admin/TeamManagement';
import Task from 'views/admin/Task';
import ClientInfo from 'views/admin/ClientManagement/components/Clientinfo';
import Settings from 'views/admin/Settings/components/Settings';
import Reports from 'views/admin/Reports/components/Reports';

const components = {
  MainDashboard,
  Timesheet,
  Usermanagement,
  ProjectManagement,
  TeamManagement,
  Task,
  Settings,
  ClientInfo,
  Reports,
};

// Fetch `accessDetails` from localStorage
const accessDetails = JSON.parse(localStorage.getItem("accessDetails")) || [];

const visibleMenus = menuConfig.filter((menu) => {
  const access = accessDetails.find((detail) => detail.screenId === menu.screenId);
  return access ? true : false; 
});

const routes = visibleMenus.map((menu) => {
  const Component = components[menu.component];
  return {
    name: (
      <Text
        sx={{
          color: '#4A5568',
          fontWeight: 'bold',
          '&:hover': { color: 'black' },
        }}
      >
        {menu.name}
      </Text>
    ),
    layout: menu.layout,
    path: menu.path,
    icon: <Icon as={MdIcons[menu.icon]} width="20px" height="20px" color="#4A5568" />,
    component: React.createElement(Component),
  };
});

export default routes;
