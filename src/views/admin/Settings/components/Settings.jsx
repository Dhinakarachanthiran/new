import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, Flex, Heading, VStack, Tab, TabList, TabPanel, TabPanels,
  Tabs, useToast, useDisclosure, Input, FormLabel, Tooltip, Table, Tbody,
  Td, Th, Thead, Tr, Select, Switch, AlertDialog, AlertDialogBody, AlertDialogFooter,
  AlertDialogHeader,AlertDialogContent,AlertDialogOverlay,
} from '@chakra-ui/react';
import { AgGridReact } from 'ag-grid-react';
import { MdGroups } from 'react-icons/md';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './Settings.css';

import { 
  fetchRoles,
  addRole,
  deleteRole,
  fetchAccessRights,
  saveAccessRights,
  fetchDepartments,
  addDepartment,
  deleteDepartment,
  fetchCategories,
  addCategories,
  deleteCategory
} from 'utils/api';

export default function SettingsScreen() {

  const [searchQuery, setSearchQuery] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const cancelRef = useRef();

  //department
  const [departmentList, setDepartmentList] = useState([]);
  const departmentDisclosure = useDisclosure();
  const [departmentData, setDepartmentData] = useState({
    departmentName: '',
    departmentDescription: '',
  });
  const [selectedDepartmentIndex, setSelectedDepartmentIndex] = useState(null);
  // Fetch departments data from the API
  useEffect(() => {
    const fetchDepartmentsData = async () => {
      try {
        const data = await fetchDepartments();
        setDepartmentList(data);
      } catch (error) {
        toast({
          title: 'Error',
          description:
            error.message || 'There was an error fetching department data.',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top-end',
        });
      }
    };
 
    fetchDepartmentsData();
  }, []);
  
  const handleAddDepartment = async() =>{
    if(!departmentData.departmentName || !departmentData.departmentDescription){
      toast({
        title: "Validation Error",
        description: "All fields are required.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: 'top-end',
      });
      return;
    }
    try {
      await addDepartment(departmentData);
      const UpdatedDepartmentList = await fetchDepartments();
      setDepartmentList(UpdatedDepartmentList);
      toast({
        title: "Department Added",
        description: "The Department has been added successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: 'top-end',
      });
      setDepartmentData({ departmentName:" ", departmentDescription:" " });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to add Department.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: 'top-end',
      });
    }
  };
  
  const handleDeleteDepartment = async () => {
    if(selectedDepartmentIndex !== null) {
      try {
        const departmentToDelete = departmentList[selectedDepartmentIndex];
        await deleteDepartment(departmentToDelete.departmentId);
        const updatedDepartmentList = await fetchDepartments();
        setDepartmentList(updatedDepartmentList);

        toast({
          title: 'Department Deleted',
          description: 'The department has been successfully deleted.',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top-end',
        });
      } catch(error){
        toast({
          title: 'Error',
          description: error.message || 'Failed to delete Department.',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top-end',
        });
      }
      setSelectedDepartmentIndex(null);
    }
    departmentDisclosure.onClose();
  };

  const handleDeptDeleteButtonClick = (index) => {
    setSelectedDepartmentIndex(index);
    departmentDisclosure.onOpen();
  }
  
  //category
  const [categoryList, setCategoryList] = useState([]);
  const categoryDisclosure = useDisclosure();
  const [categoryData, setCategoryData] = useState({
    categoryName: '',
    categoryDescription: '',
  });
  const [selectedCategoryIndex, setselectedCategoryIndex] = useState(null);
   // Fetch categories data from the API
   useEffect(() => {
    const fetchCategorieData = async () => {
      try {
        const data = await fetchCategories();
        setCategoryList(data);
      } catch (error) {
        toast({
          title: 'Error fetching categories',
          description: 'There was an error fetching category data.',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top-end',
        });
      }
    };
    fetchCategorieData();
  }, []);
  
  const handleAddCategory = async() =>{
    if(!categoryData.categoryName || !categoryData.categoryDescription){
      toast({
        title: "Validation Error",
        description: "All fields are required.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: 'top-end',
      });
      return;
    }
    try {
      await addCategories(categoryData);
      const UpdatedCategoryList = await fetchCategories();
      setCategoryList(UpdatedCategoryList);
      toast({
        title: "Category Added",
        description: "The Category has been added successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: 'top-end',
      });
      setDepartmentData({ categoryName:" ", categoryDescription:" " });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to add Category.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: 'top-end',
      });
    }
  };

  const handleDeleteCategory = async() => {
    if(selectedCategoryIndex !== null){
      try{
        const categoryToDelete = categoryList[selectedCategoryIndex];
        await deleteCategory(categoryToDelete.categoryId);
        const UpdatedCategoryList = await fetchCategories();
        setCategoryList(UpdatedCategoryList);

        toast({
          title: 'Category Deleted',
          description: 'The Category has been successfully deleted.',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top-end',
        });
      }catch (error){
        toast({
          title: 'Error',
          description: error.message || 'Failed to delete Category.',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top-end',
        });
      }
      setselectedCategoryIndex(null);
    }
    categoryDisclosure.onClose();
  };

  const handleDeleteButtonClick = (index) => {
    setselectedCategoryIndex(index);
    categoryDisclosure.onOpen();
  }


  //role
  const [roleList, setRoleList] = useState([]);
  const rolesDisclosure = useDisclosure();
  const [roleData, setRoleData] = useState({
    roleTitle: '',
    rolePermissions: '',
  });
  const [selectedRoleIndex, setSelectedRoleIndex] = useState(null);

  useEffect(() => {
    const fetchRoleData = async () => {
      try {
        const data = await fetchRoles();
        setRoleList(data);
      } catch (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to fetch roles.",
          status: "error",
          duration: 3000,
          isClosable: true,
          position:'top-end',
        });
      }
    };

    fetchRoleData();
  }, []);

  const handleAddRole = async() =>{
    if(!roleData.roleTitle || !roleData.rolePermissions){
      toast({
        title: "Validation Error",
        description: "All fields are required.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: 'top-end',
      });
      return;
    }
    try {
      await addRole(roleData);
      const UpdatedRoleList = await fetchRoles();
      setRoleList(UpdatedRoleList);
      toast({
        title: "Role Added",
        description: "The Role has been added successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: 'top-end',
      });
      setDepartmentData({ roleTitle:" ", rolePermissions:" " });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to add Role.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: 'top-end',
      });
    }
  };
 
  const handleDeleteRole = async() => {
    if ( selectedRoleIndex !== null) {
      try {
        const roleToDelete = roleList[selectedRoleIndex];
        await deleteRole(roleToDelete.roleId);

        const UpdatedRoleList = await fetchRoles();
        setRoleList(UpdatedRoleList);

        toast({
          title: 'Role Deleted',
          description: 'The Role has been successfully deleted.',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top-end',
        });
      } catch(error){
        toast({
          title: 'Error',
          description: error.message || 'Failed to delete Role.',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top-end',
        });
      }
      setSelectedRoleIndex(null);
    }
    rolesDisclosure.onClose();
  };

  const handleRoleDeleteButtonClick = (index) => {
    setSelectedRoleIndex(index);
    rolesDisclosure.onOpen();
  };

  //access rights
  const [role, setRole] = useState(null);
  const [accessData, setAccessData] = useState([
    {
      screenName: 'Dashboard',
      screenId: 101,
      hideShow: false,
      fullAccess: false,
      readOnly: false,
    },
    {
      screenName: 'Timesheet',
      screenId: 102,
      hideShow: false,
      fullAccess: false,
      readOnly: false,
    },
    {
      screenName: 'Project Managment',
      screenId: 103,
      hideShow: false,
      fullAccess: false,
      readOnly: false,
    },
    {
      screenName: 'User Managment',
      screenId: 104,
      hideShow: false,
      fullAccess: false,
      readOnly: false,
    },
    {
      screenName: 'Team Management',
      screenId: 105,
      hideShow: false,
      fullAccess: false,
      readOnly: false,
    },
    {
      screenName: 'Task Managment',
      screenId: 106,
      hideShow: false,
      fullAccess: false,
      readOnly: false,
    },
    {
      screenName: 'Settings',
      screenId: 107,
      hideShow: false,
      fullAccess: false,
      readOnly: false,
    },
    {
      screenName: 'Client Management',
      screenId: 108,
      hideShow: false,
      fullAccess: false,
      readOnly: false,
    },
    {
      screenName: 'Reports',
      screenId: 109,
      hideShow: false,
      fullAccess: false,
      readOnly: false,
    },
  ]);

  // Fetch Access Data from API
  useEffect(() => {
    const fetchAccess = async () => {
      if (role) {
        try {
          const data = await fetchAccessRights(role);
          setAccessData(data);
          console.log(fetchAccessRights);
        } catch (error) {
          toast({
            title: "Error",
            description: error.message || "Failed to fetch access rights.",
            status: "error",
            duration: 3000,
            isClosable: true,
            position:'top-end',
          });
        }
      }
    };

    fetchAccess();
  }, [role]);

  const payload = {
    role: role,
    accessData: accessData.map((item) => {
      return {
        screenName: item.screenName,
        screenId: item.screenId,
        hideShow: item.hideShow,
        fullAccess: item.fullAccess,
        readOnly: item.readOnly,
      };
    }),
  };

  console.log('Sending payload:', payload);

  const handleSaveAccessRights = async () => {
    const payload = {
      role,
      accessData :accessData.map((item) => ({
        screenName: item.screenName,
        screenId: item.screenId ? item.screenId.toString() : null,
        hideShow: item.hideShow,
        fullAccess: item.fullAccess,
        readOnly: item.readOnly,
      })),
    };

    try {
      await saveAccessRights(payload);
      toast({
        title: "Access Rights Saved",
        description: "Access rights saved successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position:'top-end',
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to save access rights.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position:'top-end',
      });
    }
  };

  // Handle Toggle Change for Switches
  const handleToggleChange = (index, field, value) => {
    const updatedData = [...accessData];
    updatedData[index][field] = value;
    setAccessData(updatedData);
  };

  return (
    <Box p={8} bg="white" minH="94vh" minW="100vh">
      <Heading mb={5} padding="10px" marginTop="-3.5">
        Settings
      </Heading>

      <Tabs variant="line" colorScheme="gray" mt={4} px={6}>
        <TabList>
          <Tab
            _selected={{
              borderBottomColor: 'gray.600',
              color: 'gray.800',
              fontWeight: 'semibold',
            }}
          >
            Department
          </Tab>
          <Tab
            _selected={{
              borderBottomColor: 'gray.600',
              color: 'gray.800',
              fontWeight: 'semibold',
            }}
          >
            Category
          </Tab>
          <Tab
            _selected={{
              borderBottomColor: 'gray.600',
              color: 'gray.800',
              fontWeight: 'semibold',
            }}
          >
            Roles
          </Tab>
          <Tab
            _selected={{
              borderBottomColor: 'gray.600',
              color: 'gray.800',
              fontWeight: 'semibold',
            }}
          >
            Access Rights
          </Tab>
        </TabList>

        <TabPanels>
          {/* Department tab */}
          <TabPanel>
            <VStack spacing={5} align="stretch">
              <div>
                <div>
                  <Flex align="center" wrap="wrap" gap={4} marginBottom="10px">
                    {/* Department Input */}
                    <Box>
                      <FormLabel htmlFor="department-name">Name</FormLabel>
                      <Input
                        id="department-name"
                        placeholder="Enter Department name"
                        size="sm"
                        value={departmentData.departmentName}
                        onChange={(e) =>
                          setDepartmentData({
                            ...departmentData,
                            departmentName: e.target.value,
                          })
                        }
                      />
                    </Box>

                    {/* description Input */}
                    <Box>
                      <FormLabel htmlFor="department-description">
                        Description
                      </FormLabel>
                      <Input
                        id="department-description"
                        placeholder="Enter description"
                        size="sm"
                        value={departmentData.departmentDescription}
                        onChange={(e) =>
                          setDepartmentData({
                            ...departmentData,
                            departmentDescription: e.target.value,
                          })
                        }
                      />
                    </Box>

                    {/* Search Input */}
                    <Box>
                      <FormLabel htmlFor="search-Department-id">
                        Search by ID
                      </FormLabel>
                      <Input
                        id="search-Department-id"
                        placeholder="🔍 Search "
                        size="sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </Box>

                    {/* Add Department Button */}
                    <Box alignSelf="flex-end">
                      <Button
                        leftIcon={
                          <MdGroups style={{ width: '20px', height: 'auto' }} />
                        }
                        colorScheme="black"
                        variant="outline"
                        fontSize="12px"
                        height="32px"
                        padding="6px 12px"
                        _hover={{ bg: 'gray.200' }}
                        onClick={handleAddDepartment}
                      >
                        Add Department
                      </Button>
                    </Box>
                  </Flex>
                </div>
              </div>

              <div
                className="ag-theme-alpine"
                style={{ height: 350, width: '100%' }}
              >
                <AgGridReact
                  rowData={
                    searchQuery
                      ? departmentList.filter((departmentData) =>
                          departmentData.id.includes(searchQuery),
                        )
                      : departmentList
                  }
                  columnDefs={[
                    {
                      headerName: 'Department ID',
                      field: 'departmentId',
                      filter: true,
                      sortable: true,
                      resizable: true,
                      flex: 1,
                    },
                    {
                      headerName: 'Department Name',
                      field: 'departmentName',
                      filter: true,
                      sortable: true,
                      resizable: true,
                      flex: 1,
                    },
                    {
                      headerName: 'Description',
                      field: 'departmentDescription',
                      filter: true,
                      sortable: true,
                      resizable: true,
                      flex: 1,
                    },
                    {
                      headerName: 'Actions',
                      cellRenderer: (params) => (
                        <Box display="flex" justifyContent="left">
                          <Tooltip label="Delete Department" placement="top">
                            <button
                              className="icon-button"
                              onClick={() => 
                                handleDeptDeleteButtonClick(params.node.rowIndex)
                              }
                              style={{
                                padding: '4px',
                                fontSize: '12px',
                                width: '24px',
                                height: '24px',
                                backgroundColor: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                alignItems: 'flex-start',
                              }}
                            >
                              <i
                                className="fas fa-trash"
                              ></i>
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
                  paginationPageSize={7}
                />
              </div>
              </VStack>
              <AlertDialog 
                isOpen={departmentDisclosure.isOpen}
                leastDestructiveRef={cancelRef}
                onClose={departmentDisclosure.onClose}
                >
                  <AlertDialogOverlay>
                    <AlertDialogContent>
                      <AlertDialogHeader fontSize="lg" fontWeight="bold">
                        Delete Department
                      </AlertDialogHeader>
                      <AlertDialogBody>
                        {selectedDepartmentIndex !==null ? (
                          `Are you sure you want to delete the department "${departmentList[selectedDepartmentIndex]?.departmentName}"? This action cannot be undone.`
                        ) : (
                          "Are you sure you want to delete this department?"
                        )}
                      </AlertDialogBody>
                      <AlertDialogFooter>
                        <Button ref ={cancelRef} onClick={departmentDisclosure.onClose}>
                          Cancel
                        </Button>
                        <Button
                          colorScheme="red"
                          onClick={handleDeleteDepartment}
                          ml={3}
                          >
                            Delete
                          </Button>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialogOverlay>
                </AlertDialog>
          </TabPanel>

          {/* Category Tab */}
          <TabPanel>
            <VStack spacing={5} align="stretch">
              <div>
                <div>
                  <Flex align="center" wrap="wrap" gap={4} marginBottom="10px">
                    {/* Name Input */}
                    <Box marginRight="10px">
                      <FormLabel htmlFor="category-name">Category</FormLabel>
                      <Input
                        id="category-name"
                        placeholder="Enter Category name"
                        size="sm"
                        value={categoryData.categoryName}
                        onChange={(e) =>
                          setCategoryData({
                            ...categoryData,
                            categoryName: e.target.value,
                          })
                        }
                      />
                    </Box>

                    {/* description Input */}
                    <Box>
                      <FormLabel htmlFor="category-description">
                        Description
                      </FormLabel>
                      <Input
                        id="category-description"
                        placeholder="description"
                        size="sm"
                        value={categoryData.categoryDescription}
                        onChange={(e) =>
                          setCategoryData({
                            ...categoryData,
                            categoryDescription: e.target.value,
                          })
                        }
                      />
                    </Box>

                    {/* Search Input */}
                    <Box>
                      <FormLabel htmlFor="search-Category-id">
                        Search by ID
                      </FormLabel>
                      <Input
                        id="search-Category-id"
                        placeholder="🔍 Search "
                        size="sm"
                        // width="-moz-min-content"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </Box>

                    {/* Add Category Button */}
                    <Box alignSelf="flex-end">
                      <Button
                        leftIcon={
                          <MdGroups style={{ width: '20px', height: 'auto' }} />
                        }
                        colorScheme="black"
                        variant="outline"
                        fontSize="12px"
                        height="32px"
                        padding="6px 12px"
                        _hover={{ bg: 'gray.200' }}
                        onClick={handleAddCategory}
                      >
                        Add Category
                      </Button>
                    </Box>
                  </Flex>
                </div>
              </div>

              <div
                className="ag-theme-alpine"
                style={{ height: 350, width: '100%' }}
              >
                <AgGridReact
                  rowData={
                    searchQuery
                      ? categoryList.filter((categoryData) =>
                          categoryData.id.includes(searchQuery),
                        )
                      : categoryList
                  }
                  columnDefs={[
                    {
                      headerName: 'Category ID',
                      field: 'categoryId',
                      filter: true,
                      sortable: true,
                      resizable: true,
                      flex: 1,
                    },
                    {
                      headerName: 'Category Name',
                      field: 'categoryName',
                      filter: true,
                      sortable: true,
                      resizable: true,
                      flex: 1,
                    },
                    {
                      headerName: 'Description',
                      field: 'categoryDescription',
                      filter: true,
                      sortable: true,
                      resizable: true,
                      flex: 1,
                    },
                    {
                      headerName: 'Actions',
                      cellRenderer: (params) => (
                        <Box display="flex" justifyContent="center">
                          <Tooltip label="Delete Category" placement="top">
                            <button
                              className="icon-button"
                              onClick={() =>
                                handleDeleteButtonClick(params.node.rowIndex)
                              }
                              style={{
                                padding: '4px',
                                fontSize: '12px',
                                width: '24px',
                                height: '24px',
                                backgroundColor: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                              }}
                            >
                              <i
                                className="fas fa-trash"
                                style={{ color: 'black' }}
                              ></i>
                            </button>
                          </Tooltip>
                        </Box>
                      ),
                      resizable: true,
                      flex: 1,
                    },
                  ]}
                  defaultColDef={{
                    flex: 1,
                    minWidth: 100,
                    resizable: true,
                  }}
                  pagination={true}
                  paginationPageSize={7}
                />
              </div>
            </VStack>
            <AlertDialog
              isOpen={categoryDisclosure.isOpen}
              leastDestructiveRef={cancelRef}
              onClose={categoryDisclosure.onClose}
              >
                <AlertDialogOverlay>
                  <AlertDialogContent>
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                      Delete Category
                    </AlertDialogHeader>
                    <AlertDialogBody>
                      {selectedCategoryIndex !== null ?(
                        `Are you sure you want to delet the Category"${categoryList[selectedCategoryIndex]?.categoryName}"?.`
                      ) : (
                        "Are you sure you want to delete the Category?"
                      )}
                    </AlertDialogBody>
                    <AlertDialogFooter>
                    <Button ref={cancelRef} onClick={categoryDisclosure.onClose}  >
                      Cancel
                    </Button>
                    <Button
                      colorScheme="red"
                      onClick={handleDeleteCategory}
                      ml={3}
                    
                    >
                      Delete
                    </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
          </TabPanel>

          {/* Role Tab */}
          <TabPanel>
            <VStack spacing={5} align="stretch">
              <div>
                <div>
                  <Flex align="center" wrap="wrap" gap={4} marginBottom="10px">
                    {/* Role Input */}
                    <Box>
                      <FormLabel htmlFor="role-title">Role</FormLabel>
                      <Input
                        id="role-title"
                        placeholder="Enter role title"
                        size="sm"
                        value={roleData.roleTitle}
                        onChange={(e) =>
                          setRoleData({ ...roleData, roleTitle: e.target.value })
                        }
                      />
                    </Box>

                    {/* Permission Input */}
                    <Box>
                      <FormLabel htmlFor="role-permissions">
                        Permission
                      </FormLabel>
                      <Input
                        id="role-permissions"
                        placeholder="Enter permissions"
                        size="sm"
                        value={roleData.rolePermissions}
                        onChange={(e) =>
                          setRoleData({
                            ...roleData,
                            rolePermissions: e.target.value,
                          })
                        }
                      />
                    </Box>

                    {/* Search Input */}
                    <Box>
                      <FormLabel htmlFor="search-Role-id">
                        Search by ID
                      </FormLabel>
                      <Input
                        id="search-Role-id"
                        placeholder="🔍 Search"
                        size="sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </Box>

                    {/* Add Role Button */}
                    <Box alignSelf="flex-end">
                      <Button
                        leftIcon={
                          <MdGroups style={{ width: '20px', height: 'auto' }} />
                        }
                        colorScheme="black"
                        variant="outline"
                        fontSize="12px"
                        height="32px"
                        padding="6px 12px"
                        _hover={{ bg: 'gray.200' }}
                        onClick={handleAddRole}
                      >
                        Add Role
                      </Button>
                    </Box>
                  </Flex>
                </div>
              </div>

              <div
                className="ag-theme-alpine"
                style={{ height: 350, width: '100%' }}
              >
                <AgGridReact
                  rowData={
                    searchQuery
                      ? roleList.filter((roleDataData) =>
                          roleDataData.id.includes(searchQuery),
                        )
                      : roleList
                  }
                  columnDefs={[
                    {
                      headerName: 'Role ID',
                      field: 'roleId',
                      filter: true,
                      sortable: true,
                      resizable: true,
                      flex: 1,
                    },
                    {
                      headerName: 'Role Title',
                      field: 'roleTitle',
                      filter: true,
                      sortable: true,
                      resizable: true,
                      flex: 1,
                    },
                    {
                      headerName: 'Permissions',
                      field: 'rolePermissions',
                      filter: true,
                      sortable: true,
                      resizable: true,
                      flex: 1,
                    },
                    {
                      headerName: 'Actions',
                      cellRenderer: (params) => (
                        <Box display="flex" justifyContent="center">
                          <Tooltip label="Delete Role" placement="top">
                            <button
                              className="icon-button"
                              onClick={() =>
                                handleRoleDeleteButtonClick(params.node.rowIndex)
                              }
                              style={{
                                padding: '4px',
                                fontSize: '12px',
                                width: '24px',
                                height: '24px',
                                backgroundColor: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                              }}
                            >
                              <i
                                className="fas fa-trash"
                                style={{ color: 'black' }}
                              ></i>
                            </button>
                          </Tooltip>
                        </Box>
                      ),
                      resizable: true,
                      flex: 1,
                    },
                  ]}
                  defaultColDef={{
                    flex: 1,
                    minWidth: 100,
                    resizable: true,
                  }}
                  pagination={true}
                  paginationPageSize={7}
                />
              </div>
            </VStack>
            <AlertDialog
            isOpen ={rolesDisclosure.isOpen}
            leastDestructiveRef={cancelRef}
            onClose={rolesDisclosure.onClose}
            >
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  Delete Role
                </AlertDialogHeader>
                <AlertDialogBody>
                  {selectedRoleIndex !== null ? (
                    `Are you sure you want to delete the role "${roleList[selectedRoleIndex]?.roleTitle}"?This action cannot be undone.`
                  ):(
                    "Are you sure you want to delete this Role?"
                  )}
                </AlertDialogBody>
                <AlertDialogFooter>
                  <Button ref={cancelRef} onClick={rolesDisclosure.onClose}>
                    Cancel
                  </Button>
                  <Button
                  colorScheme="red"
                  onClick={handleDeleteRole}
                  ml={3}>
                    Delete
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
            </AlertDialog>
          </TabPanel>

          <TabPanel>
            <VStack spacing={5} align="stretch">
              <Flex align="center" wrap="wrap" gap={4} marginBottom="10px">
                {/* Role Selection */}
                <Box>
                  <FormLabel htmlFor="role-title">Role</FormLabel>
                  <Select
                    id="role-title"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    size="sm"
                  >
                    <option value="superadmin">SuperAdmin</option>
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="employee">Employee</option>
                  </Select>
                </Box>

                {/* Save Button */}
                <Box alignSelf="flex-end">
                  <Button
                    colorScheme="blue"
                    variant="solid"
                    fontSize="12px"
                    height="32px"
                    padding="6px 12px"
                    onClick={handleSaveAccessRights}
                  >
                    Save
                  </Button>
                </Box>
              </Flex>

              {/* Access Rights Table */}
              <Box overflowX="auto">
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Screen Name</Th>
                      <Th textAlign="center">Hide/Show</Th>
                      <Th textAlign="center">Full Access</Th>
                      <Th textAlign="center">Read</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {accessData.map((item, index) => (
                      <Tr key={index}>
                        <Td>{item.screenName}</Td>
                        <Td textAlign="center">
                          <Switch
                            isChecked={item.hideShow}
                            onChange={(e) =>
                              handleToggleChange(
                                index,
                                'hideShow',
                                e.target.checked,
                              )
                            }
                          />
                        </Td>
                        <Td textAlign="center">
                          <Switch
                            isChecked={item.fullAccess}
                            onChange={(e) =>
                              handleToggleChange(
                                index,
                                'fullAccess',
                                e.target.checked,
                              )
                            }
                          />
                        </Td>
                        <Td textAlign="center">
                          <Switch
                            isChecked={item.read}
                            onChange={(e) =>
                              handleToggleChange(
                                index,
                                'read',
                                e.target.checked,
                              )
                            }
                          />
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
