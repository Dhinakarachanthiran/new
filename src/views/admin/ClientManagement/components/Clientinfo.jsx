import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, Flex, Heading, VStack,useToast, useDisclosure, Input, FormLabel, Tooltip,
   AlertDialog, AlertDialogBody, AlertDialogFooter,
  AlertDialogHeader,AlertDialogContent,AlertDialogOverlay,
} from '@chakra-ui/react';
import { AgGridReact } from 'ag-grid-react';
import { MdGroups } from 'react-icons/md';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { fetchClients,addClient,deleteClient } from "utils/api";

export default function ClientInfo() {
  const [searchQuery, setSearchQuery] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const toast = useToast();

  // client
  const [clientList, setClientList] = useState([]);
  const [clientData, setClientData] = useState({
    clientName: '',
    clientLocation: '',
  });
  const [selectedClientIndex, setSelectedClientIndex] = useState(null);
  
  // Fetch client data from API
  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const data = await fetchClients();
        setClientList(data);
      } catch (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to fetch clients.",
          status: "error",
          duration: 3000,
          isClosable: true,
          position:'top-end',
        });
      }
    };

    fetchClientData();
  }, []);

   // Handle Add Client
   const handleAddClient = async () => {
    if (!clientData.clientName || !clientData.clientLocation) {
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
      await addClient(clientData);
      const UpdatedClientList = await fetchClients();
      setClientList(UpdatedClientList);
      toast({
        title: "Client Added",
        description: "The client has been added successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: 'top-end',
      });
      setClientData({ clientName:" ", clientLocation:" " });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to add client.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: 'top-end',
      });
    }
  };

  const handleDeleteClient = async () => {
    if (selectedClientIndex !== null) {
      try {
        const clientToDelete = clientList[selectedClientIndex];
        await deleteClient(clientToDelete.clientId); // Call the delete API
        
        // Refresh the client list after deletion
        const updatedClientList = await fetchClients();
        setClientList(updatedClientList);
  
        toast({
          title: 'Client Deleted',
          description: 'The client has been successfully deleted.',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top-end',
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: error.message || 'Failed to delete client.',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top-end',
        });
      }
      setSelectedClientIndex(null);
    }
    onClose();
  };
  
const handleDeleteButtonClick = (index) => {
  setSelectedClientIndex(index);
  onOpen();
};

    return(
        <Box p={8} bg="white" minH="94vh">
            <Heading mb={5}>Client Management
            </Heading>
            <VStack spacing={5} align="stretch">
              <div>
                <div>
                  <Flex align="center" wrap="wrap" gap={4} marginBottom="10px">
                    {/* Name Input */}
                    <Box>
                      <FormLabel htmlFor="client-name">Name</FormLabel>
                      <Input
                        id="client-name"
                        placeholder="Enter client name"
                        size="sm"
                        value={clientData.clientName}
                        onChange={(e) =>
                          setClientData({
                            ...clientData,
                            clientName: e.target.value,
                          })
                        }
                      />
                    </Box>

                    {/* Location Input */}
                    <Box>
                      <FormLabel htmlFor="client-location">Location</FormLabel>
                      <Input
                        id="client-location"
                        placeholder="Enter client location"
                        size="sm"
                        value={clientData.clientLocation}
                        onChange={(e) =>
                          setClientData({
                            ...clientData,
                            clientLocation: e.target.value,
                          })
                        }
                      />
                    </Box>

                    {/* Search Input */}
                    <Box>
                      <FormLabel htmlFor="search-client-id">
                        Search by ID
                      </FormLabel>
                      <Input
                        id="search-client-id"
                        placeholder="🔍 Search "
                        size="sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </Box>

                    {/* Add Client Button */}
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
                        onClick={handleAddClient}
                      >
                        Add Client
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
                      ? clientList.filter((client) =>
                          client.id.includes(searchQuery),
                        )
                      : clientList
                  }
                  columnDefs={[
                    {
                      headerName: 'Client Id',
                      field: 'clientId',
                      filter: true,
                      sortable: true,
                    },
                    {
                      headerName: 'Client Name',
                      field: 'clientName',
                      filter: true,
                      sortable: true,
                    },
                    {
                      headerName: 'Client Location',
                      field: 'clientLocation',
                      filter: true,
                      sortable: true,
                    },
                    {
                      headerName: 'Actions',
                      cellRenderer: (params) => (
                        <Box display="flex" justifyContent="center">
                          <Tooltip label="Delete Client" placement="top">
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
                              }}
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
                  paginationPageSize={7}
                />
              </div>
            </VStack>

            {/* Confirmation Dialog */}
            <AlertDialog
              isOpen={isOpen}
              leastDestructiveRef={cancelRef}
              onClose={onClose}
            >
              <AlertDialogOverlay>
                <AlertDialogContent>
                  <AlertDialogHeader fontSize="lg" fontWeight="bold">
                    Delete Client
                  </AlertDialogHeader>

                  <AlertDialogBody>
                    {selectedClientIndex !== null ? (
                      `Are you sure you want to delete the client "${clientList[selectedClientIndex]?.clientName}"? This action cannot be undone.`
                    ) : (
                      "Are you sure you want to delete this client?"
                    )}
                  </AlertDialogBody>

                  <AlertDialogFooter>
                    <Button ref={cancelRef} onClick={onClose}  >
                      Cancel
                    </Button>
                    <Button
                      colorScheme="red"
                      onClick={handleDeleteClient}
                      ml={3}
                    
                    >
                      Delete
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialogOverlay>
            </AlertDialog>
        </Box>
    );
};