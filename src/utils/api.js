import axios from "axios";

const BASE_URL = "http://localhost:5074/api";

// ** User Management API Methods **/

export const fetchUserManagementDatas = async () => {
  const response = await axios.get(`${BASE_URL}/UserManagement`);
  return response.data;
};

export const addUsers = async (userToAdd) => {
  try {
    const response = await axios.post(`${BASE_URL}/UserManagement`, userToAdd);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Failed to add Task." };
  }
};

export const updateUsers = async (updateRequest) => {
  try {
    const response = await axios.put(`${BASE_URL}/UserManagement/${updateRequest.emp_code}`,updateRequest);
    return response.data;
  } catch (error) {
    throw error.response? error.response.data : { message: "Failed to update User." };
  }
};

export const deleteUser = async (empCode) => {
  try {
    const response = await axios.delete(`${BASE_URL}/UserManagement/${empCode}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Failed to delete User." };
  }
};
 

//Team management API Methods **/
export const fetchTeamManagementData = async () => {
  try {
  const response = await axios.get(`${BASE_URL}/TeamManagement`);
  return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Failed to fetch Teams." };
  }
};

export const addTeams = async (newTeam) => {
  try {
    const response = await axios.post(`${BASE_URL}/TeamManagement`, newTeam);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Failed to add Team." };
  }
};

export const EditTeam = async (id, updatedTeam) => {
  try {
    const response = await axios.put(`${BASE_URL}/TeamManagement/${id}`, updatedTeam);
    return response.data;
  }catch(error){
    throw error.response ? error.response.data : { message: "Failed to update Team."};
  }
};

export const deleteTeam = async (TeamId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/TeamManagement/${TeamId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Failed to delete Team." };
  }
};

// ** Team members screen API methods

export const deleteTeamMember = async (empCode) => {
  try {
    const response = await axios.delete(`${BASE_URL}/TeamMembers/${empCode}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
 
    if (response.status !== 200) {
      throw new Error('Error deleting team member');
    }
 
    return response.data; // Return the API response data
  } catch (error) {
    throw new Error(error.message); // Throw the error message to be caught in the component
  }
};
export const addTeamMember = async (teamMember) => {
  try {
    const response = await axios.post(`${BASE_URL}/TeamMembers`, teamMember);
 
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Failed to add team member." };
  }
};
export const fetchUserDetailsByRoleId = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/TeamMembers/role`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Failed to fetch user details.' };
  }
};
 
export const fetchTeamMembersByTeamId = async (teamId) => {
  try {
    const response = await fetch(`${BASE_URL}/teammembers/${teamId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch team members');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

// ** Project management API Methods **/
export const fetchProjectManagementDatas = async () => {
  const response = await axios.get(`${BASE_URL}/ProjectView`);
  return response.data;
};

export const fetchTeamsByManager = async (managerId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/ProjectView/GetTeamsByManager/${managerId}`
    );
    return response.data; 
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};
 

export const addProject = async (newProject) => {
  try {
    const response = await axios.post(`${BASE_URL}/ProjectView`, newProject);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Failed to add Project." };
  }
};

export const deleteProject = async (ProjectId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/ProjectView/${ProjectId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Failed to delete Project." };
  }
};

// ** Project management API Methods **/
export const fetchEditProjectDatas = async (projectId) => {
  const response = await axios.get(`${BASE_URL}/EditProject/${projectId}`);
  return response.data;
};
 

export const fetchAssignTasks = async (newtask) => {
  try {
    const response = await axios.post(`${BASE_URL}/EditProject`, newtask);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Failed to add Project." };
  }
};


export const fetchTeamNamesByProject = async (projectId) => {
  const response = await axios.get(`${BASE_URL}/EditProject/GetTeamNamesByProject/${projectId}`);
  return response.data;
};
 
export const updateProjectTask = async (indexId, updatedTask) => {
  try {
    const response = await axios.put(`${BASE_URL}/EditProject/${indexId}`, updatedTask);
    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : { message: "Failed to update the task." };
  }
};

export const deleteTaskByIndexId = async (indexId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/EditProject/${indexId}`);
    return response.data; // Assuming the API responds with a success message or task data
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};
 
 
// ** Task management API Methods **/
export const fetchTasks = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/Tasks`);
    return response.data; 
  } catch (error) {
    throw error.response ? error.response.data : { message: "Failed to fetch Tasks." };
  }
};

export const addTasks = async (newTask) => {
  try {
    const response = await axios.post(`${BASE_URL}/Tasks`, newTask);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Failed to add Task." };
  }
};

export const EditTasks = async (id, updatedTask) => {
  try {
    const response = await axios.put(`${BASE_URL}/Tasks/id/${id}`, updatedTask);
    return response.data;
  }catch(error){
    throw error.response ? error.response.data : { message: "Failed to update Task."};
  }
};

export const deleteTask = async (Id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/Tasks/id/${Id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Failed to delete client." };
  }
};

// ** Clients API Methods **
export const fetchClients = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/Settings/clients`);
    return response.data; 
  } catch (error) {
    throw error.response ? error.response.data : { message: "Failed to fetch clients." };
  }
};

export const addClient = async (clientData) => {
  try {
    const response = await axios.post(`${BASE_URL}/Settings/clients`, clientData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Failed to add client." };
  }
};

export const deleteClient = async (clientId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/settings/clients/${clientId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Failed to delete client." };
  }
};

// ** Departments API Methods **
export const fetchDepartments = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/Settings/departments`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Failed to fetch departments." };
  }
};

export const addDepartment = async (departmentData) => {
  try {
    const response = await axios.post(`${BASE_URL}/Settings/departments`, departmentData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Failed to add client." };
  }
};

export const deleteDepartment = async (departmentId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/Settings/departments/${departmentId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Failed to delete category." };
  }
};

// ** categories API Methods **
export const fetchCategories = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/Settings/categories`);
    return response.data; // Return the fetched data
  } catch (error) {
    throw error.response ? error.response.data : { message: "Failed to fetch categories." };
  }
};

export const addCategories = async (categoryData) => {
  try {
    const response = await axios.post(`${BASE_URL}/Settings/categories`, categoryData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Failed to add client." };
  }
};

export const deleteCategory = async (categoryId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/Settings/categories/${categoryId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Failed to delete category." };
  }
};

// ** Roles API Methods **
export const fetchRoles = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/Settings/roles`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Failed to fetch roles." };
  }
};

export const addRole = async (roleData) => {
  try {
    const response = await axios.post(`${BASE_URL}/Settings/roles`, roleData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Failed to add client." };
  }
};

export const deleteRole = async (roleId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/Settings/roles/${roleId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Failed to delete Role." };
  }
};

// ** Access Rights API Methods **
export const fetchAccessRights = async (role) => {
  try {
    const response = await axios.get(`${BASE_URL}/Users/get-access-by-role/${role}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Failed to fetch access rights." };
  }
};

export const saveAccessRights = async (payload) => {
  try {
    const response = await axios.post(`${BASE_URL}/Users/save-access-by-role`, payload);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Failed to save access rights." };
  }
};


// ** login API methods **
export const loginUser = async (username, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/Users/login`, { username, password });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Login failed" };
  }
};

export const fetchDropdownData = async (type) => {
  try {
    const response = await axios.get(`${BASE_URL}/DropDown/dropdown?type=${type}`); // Replace with your API URL  
    return response.data;
  } catch (error) {  
    throw error.response ? error.response.data : { message: "Failed to fetch dropdowns" };
 
  }
}
 
