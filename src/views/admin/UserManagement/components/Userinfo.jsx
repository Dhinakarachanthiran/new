import React, { useState , useRef ,useEffect} from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  VStack,
  Avatar,
  Tab,
  toast,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Icon,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  HStack,
  FormLabel,
  useToast,
  ModalCloseButton,
  Grid,
  GridItem,
  Select,
} from '@chakra-ui/react';
import {
  FaEnvelope,
  FaPhone,
  FaTransgender,
  FaMapMarkerAlt,
  FaNetworkWired,
  FaUserEdit,
  FaBirthdayCake,
  FaHeart,
  FaCalendar,
  FaUserTie,
  FaUsers,
  FaTrash,
  FaIdBadge,
  FaCamera,
  FaHeartbeat,
  FaBarcode, // Added for employee code
} from 'react-icons/fa';
import Usermanagement from "./Usermanagement";
import { MdPhone,MdPhotoCamera } from "react-icons/md"; // Sleeker icon alternative
 
export default function UserDetailsPage({emp_code, onBack }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [activeTab, setActiveTab] = useState(0);
  const [userDetails, setUserDetails] = useState(null);


  const [isProfilePhotoModalOpen, setProfilePhotoModalOpen] = useState(false);

const handleOpenProfilePhotoModal = () => setProfilePhotoModalOpen(true);
const handleCloseProfilePhotoModal = () => setProfilePhotoModalOpen(false);

const deleteProfilePhoto = () => {
  setUserDetails(prev => ({
    ...prev,
    profilePhoto: "/path/to/profile/image", // Reset to default photo
  }));
  toast({
    title: "Profile Photo Removed",
    description: "Your profile photo has been reset to the default image.",
    status: "warning",
    duration: 3000,
    position: "top-end",
    isClosable: true,
  });
  handleCloseProfilePhotoModal();
};

useEffect(() => {
  const fetchUserDetails = async () => {
    if (!emp_code) return; // Ensure emp_code is available
    
    try {
      const response = await fetch(`http://localhost:5074/api/EmployeeDetails/${emp_code}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user details');
      }
      const data = await response.json();
      setUserDetails({
        name: data.username,
        emailId: data.email_id,
        phoneNo: data.phoneNo,
        location: data.location,
        dateOfBirth: data.dateofbirth,
        gender: data.gender,
        maritalStatus: data.maritalStatus,
        emgContactName: data.emg_ContactName,
        emgContactPhoneNo: data.emg_ContactPhoneNo,
        emgContactRelation: data.emg_ContactRelation,
        designation: data.designation,
        isBillable: data.isBillable,
        employmentType:data.employmentType,
        departmentName: data.departmentName,
        teamName: data.teamName,
        teamManagerName: data.teamManagerName,
        joiningDate: data.joiningDate,
        emp_code: data.emp_code
      });
    }catch (error) {
      console.error('Error fetching user details:', error);
      toast({
        title: 'Error',
        description: 'Unable to load user details. Please try again later.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  fetchUserDetails();
}, [emp_code]); // Ensure it listens for emp_code changes


function Userinfo({ emp_code, onBack }) {
  return (
      <UserDetailsPage emp_code={emp_code} onBack={onBack} />
  );
}
 

  // Add these new functions
const fileInputRef = useRef(null);

const uploadProfilePhoto = (event) => {
  const file = event.target.files[0];
  // Check if a file was actually selected
  if (!file) {
    toast({
      title: "No File Selected",
      description: "Please choose an image to upload.",
      status: "warning",
      duration: 3000,
      position: "top-end",
      isClosable: true,
    });
    return;
  }
  
  // Check file size (limit to 5MB)
  if (file.size > 5 * 1024 * 1024) {
    toast({
      title: "File Too Large",
      description: "Please upload an image smaller than 5MB.",
      status: "error",
      duration: 3000,
      position: "top-end",
      isClosable: true,
    });
    return;
  }

  // Check file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    toast({
      title: "Invalid File Type",
      description: "Please upload a JPEG, PNG, or GIF image.",
      status: "error",
      duration: 3000,
      position: "top-end",
      isClosable: true,
    });
    return;
  }

  // Create a file reader to generate preview
  const reader = new FileReader();
  reader.onloadend = () => {
    setUserDetails(prev => ({
      ...prev,
      profilePhoto: reader.result
    }));

    // Clear the file input to allow re-uploading the same file
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    // Show success toast
    toast({
      title: "Profile Photo Updated",
      description: "Your profile photo has been successfully uploaded.",
      status: "success",
      duration: 3000,
      position: "top-end",
      isClosable: true,
    });
  };

  // Read the file
  reader.readAsDataURL(file);
};

// Function to trigger file input
const openFileInput = () => {
  fileInputRef.current.click();
};
  const toast = useToast();
 // Temporary state to hold changes during editing
 const handleSave = () => {
  // Directly call the update API without validating fields
  updateUserDetails();

  // Show success toast
  toast({
    title: "Profile Updated",
    description: "Your profile details have been successfully updated.",
    status: "success",
    duration: 3000,
    position: "top-end",
    isClosable: true,
  });

  // Close the modal
  onClose();
};

  const InfoRow = ({ icon: IconComponent, label, value, children }) => (
    <Flex
      align="center"
      py={3}
      borderBottom="1px solid"
      borderColor="gray.200"
      textAlign="left"
    >
      <Icon as={IconComponent} color="gray.500" mr={4} boxSize={5} />
      <Flex
        width="full"
        flexDirection="column"
        align="flex-start"
      >
        <Text fontWeight="medium" color="gray.600" mb={1}>
          {label}
        </Text>
        {value ? (
          <Text fontWeight="semibold" color="gray.800">
            {value}
          </Text>
        ) : (
          children
        )}
      </Flex>
    </Flex>
  );
  const updateUserDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5074/api/EmployeeDetails/${userDetails.emp_code}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Emp_code: userDetails.emp_code,
          Username: userDetails.name,
          email_id: userDetails.emailId,
          PhoneNo: userDetails.phoneNo,
          location: userDetails.location,
          dateofbirth: userDetails.dateOfBirth,
          Gender: userDetails.gender,
          MaritalStatus: userDetails.maritalStatus,
          Emg_ContactName: userDetails.emgContactName,
          Emg_ContactPhoneNo: userDetails.emgContactPhoneNo,
          Emg_ContactRelation: userDetails.emgContactRelation,
          Designation: userDetails.designation,
          isBillable: userDetails.isBillable === true || userDetails.isBillable === "Billable",
          employmentType: userDetails.employmentType || "Permanent", // Add default value
          DepartmentName: userDetails.departmentName, // Sent as name
          TeamName: userDetails.teamName, // Sent as name
          TeamManagerName: userDetails.teamManagerName,
          JoiningDate: userDetails.joiningDate,
        }),
      });
  
      if (response.ok) {
        toast({
          title: 'Profile Updated',
          description: 'User details updated successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top-end',
        });
        onClose(); // Close the modal
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user details.');
      }
    } catch (error) {
      console.error('Error updating user details:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update user details.',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-end',
      });
    }
  };
  
  return (
    <Flex
      width="100%"
      height="94vh"
      bg="white"
      align="center"
      justify="center"
      p={6}
      overflow="hidden"  // This prevents scrolling on the page
    >
      <Box
        width="100%"
        minH="94vh"
        maxWidth="1000px"
        bg="white"
        border="1px solid"
        borderColor="gray.100"
        borderRadius="lg"
      >
        {/* Header Section */}
        <Flex bg="gray.100" color="gray.900" p={6} align="center" borderBottom="1px solid" borderColor="gray.100">
        <Box position="relative" width="fit-content">
  <Avatar 
    size="xl" 
    src={userDetails?.profilePhoto || "/default/path/to/image"} 
    mr={6} 
    borderWidth={2} 
    borderColor="gray.600" 
    cursor="pointer" 
  />
  {/* Improved Pencil Icon Styling */}
  <Icon 
    as={MdPhotoCamera} 
    position="absolute" 
    bottom={-2} 
    right={4} 
    borderRadius="full" 
    bg="gray.100" 
    color="gray.700" 
    p={2} 
    boxSize={8} 
    cursor="pointer" 
    onClick={handleOpenProfilePhotoModal}
    boxShadow="md"
    _hover={{
      bg: "gray.200",
      color: "gray.900"
    }}
    transition="all 0.2s"
  />
  <Input 
    type="file" 
    ref={fileInputRef} 
    style={{ display: 'none' }} 
    accept="image/jpeg,image/png,image/gif" 
    onChange={uploadProfilePhoto} 
  />
</Box>


          <VStack align="flex-start" spacing={1} flex={1}>
          <Heading size="lg" color="gray.800">
  {userDetails?.name || "Loading..."}
</Heading>

            <Text color="gray.600">{userDetails?.jobTitle}</Text>
            </VStack>
<Button
  colorScheme="black"
  variant="outline"
  _hover={{ bg: "gray.200" }}
  onClick={onOpen}
>
  <FaUserEdit />
  &nbsp; Edit Profile
</Button>
<Button
  colorScheme="black"
  variant="outline"
  _hover={{ bg: "gray.200" }}
  onClick={onBack}
  ml={4} /* Adds margin to the left of this button */
>
  Back
</Button>

        </Flex>
 
        {/* Tab Section */}
        <Tabs
          variant="line"
          colorScheme="gray"
          mt={4}
          px={6}
          onChange={(index) => setActiveTab(index)}
        >
          <TabList>
            <Tab
              _selected={{
                borderBottomColor: "gray.600",
                color: "gray.800",
                fontWeight: "semibold"
              }}
            >
              Personal Info
            </Tab>
            <Tab
              _selected={{
                borderBottomColor: "gray.600",
                color: "gray.800",
                fontWeight: "semibold"
              }}
            >
              Professional Details
            </Tab>
          </TabList>
          <TabPanels>
            {/* Personal Info Tab */}
            <TabPanel>
              <Grid
                templateColumns="repeat(2, 1fr)"
                gap={4}
                mt={4}
                alignItems="stretch"
              >
                 
                 <GridItem>
  <InfoRow icon={FaEnvelope} label="Email" value={userDetails?.emailId} />
</GridItem>
<GridItem>
  <InfoRow icon={MdPhone} label="Phone" value={userDetails?.phoneNo} />
</GridItem>
<GridItem>
  <InfoRow icon={FaMapMarkerAlt} label="Location" value={userDetails?.location} />
</GridItem>
<GridItem>
  <InfoRow icon={FaBirthdayCake} label="Date of Birth" value={userDetails?.dateOfBirth} />
</GridItem>
<GridItem>
  <InfoRow icon={FaTransgender} label="Gender" value={userDetails?.gender} />
</GridItem>
<GridItem>
  <InfoRow icon={FaHeart} label="Marital Status" value={userDetails?.maritalStatus} />
</GridItem>
<GridItem>
  <InfoRow
    icon={FaHeartbeat}
    label="Emergency Contact"
    value={`${userDetails?.emgContactName} (${userDetails?.emgContactRelation}) ${userDetails?.emgContactPhoneNo}`}
  />
</GridItem>

              </Grid>
            </TabPanel>
 
            {/* Professional Details Tab */}
            <TabPanel>
              <Grid
                templateColumns="repeat(2, 1fr)"
                gap={4}
                mt={4}
                alignItems="stretch"
              >
               <GridItem>
  <InfoRow icon={FaBarcode} label="Employee Code" value={userDetails?.emp_code} />
</GridItem>
<GridItem>
  <InfoRow icon={FaIdBadge} label="Designation" value={userDetails?.designation} />
</GridItem>
<GridItem>
    <InfoRow icon={FaHeartbeat} label="Billable" value={userDetails?.isBillable ? "Yes" : "No"} />
</GridItem>
<GridItem>
    <InfoRow icon={FaUserTie} label="Employment Type" value={userDetails?.employmentType} />
</GridItem>

<GridItem>
  <InfoRow icon={FaNetworkWired} label="Department" value={userDetails?.departmentName} />
</GridItem>
<GridItem>
  <InfoRow icon={FaUsers} label="Team" value={userDetails?.teamName} />
</GridItem>
<GridItem>
  <InfoRow icon={FaUserTie} label="Team Manager" value={userDetails?.teamManagerName} />
</GridItem>
<GridItem>
  <InfoRow icon={FaCalendar} label="Joining Date" value={userDetails?.joiningDate} />
</GridItem>

              </Grid>
            </TabPanel>
          </TabPanels>
        </Tabs>
 
        {/* Footer */}
        <Flex
          justify="flex-end"
          p={6}
          borderTop="1px solid"
          borderColor="gray.100"
        >
          
        </Flex>
      </Box>
      <Modal isOpen={isProfilePhotoModalOpen}closeOnOverlayClick={false} onClose={handleCloseProfilePhotoModal}>
  <ModalOverlay />
  <ModalContent  borderRadius="xl">
    <ModalHeader>Profile Picture</ModalHeader>
    <ModalCloseButton color="black.700" />
    <ModalBody>
      <VStack spacing={4}>
        {/* Display Current Profile Photo */}
        <Avatar
          size="xl"
          src={userDetails?.profilePhoto || "/default/path/to/image"}

          borderWidth={2}
          borderColor="gray.600"
        />
        {/* Display Name and Email Below Profile Photo */}
        <Text   fontWeight="bold">
          {userDetails?.name || "Your Name"}
        </Text>
        <Text   color="gray.500">
          {userDetails?.email || "your.email@example.com"}
        </Text>

        {/* Options for Add and Remove on the Same Line */}
        <HStack spacing={4} justifyContent="center">
          <Button
            colorScheme="black"
            variant="outline"
            _hover={{ bg: "gray.200" }}
            onClick={() => {
              openFileInput(); // Open file input for Add Photo
              handleCloseProfilePhotoModal(); // Close the modal
            }}
            leftIcon={<FaCamera />}
          >
            Change  
          </Button>
          <Button
            colorScheme="black"
            variant="outline"
            _hover={{ bg: "gray.200" }}
            onClick={deleteProfilePhoto}
            leftIcon={<FaTrash />}
          >
            Remove 
          </Button>
        </HStack>
      </VStack>
    </ModalBody>
    <ModalFooter>
      <Button variant="ghost" onClick={handleCloseProfilePhotoModal}>
        Close
      </Button>
    </ModalFooter>
  </ModalContent>
</Modal>
 
{/* Modal for Editing */}
<Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false} size="xl">
  <ModalOverlay />
  <ModalContent
    borderRadius="lg"
    maxHeight="82vh"  // Set maximum height to 90% of the viewport height
    boxShadow="lg"
    p={0}
    overflow="hidden"  // Prevent overflow and scroll
  >
    <ModalHeader textAlign="center" p={2} fontWeight="bold" fontSize="lg">
      Edit User Details
    </ModalHeader>
    <ModalCloseButton color="black.700" />
    <ModalBody paddingY={0}> {/* Remove vertical padding to optimize space */}
      <Tabs isFitted variant="enclosed">
        <TabList>
          <Tab
            _selected={{
              borderBottomColor: "blue.500",
              color: "blue.600",
              fontWeight: "semibold",
            }}
          >
            Personal Info
          </Tab>
          <Tab
            _selected={{
              borderBottomColor: "blue.500",
              color: "blue.600",
              fontWeight: "semibold",
            }}
          >
            Professional Details
          </Tab>
        </TabList>
        <TabPanels>
          {/* Personal Info Tab */}
          <TabPanel>
            <VStack spacing={4} align="stretch">
              {/* Name and Email in the same line */}
              <Flex gap={4}>
                <Box flex={1}>
                  <FormLabel>Name</FormLabel>
                  <Input isReadOnly variant="filled" value={userDetails?.name} />
                </Box>
                <Box flex={1}>
                <FormLabel>Email</FormLabel>
                  <Input isReadOnly
                    placeholder="Enter email"
                    value={userDetails?.emailId || ''}
                    onChange={(e) =>
                      setUserDetails({ ...userDetails, emailId: e.target.value })
                    }
                  />
                </Box>
              </Flex>
              {/* Date of Birth and Gender in the same line */}
              <Flex gap={4}>
                <Box flex={1}>
                  <FormLabel>Date of Birth</FormLabel>
                  <Input isReadOnly variant="filled" type="date" value={userDetails?.dateOfBirth} />
                </Box>
                <Box flex={1}>
                  <FormLabel>Gender</FormLabel>
                  <Input isReadOnly variant="filled" value={userDetails?.gender} />
                </Box>
              </Flex>
              {/* Phone and Location in the same line */}
              <Flex gap={4}>
                <Box flex={1}>
                <FormLabel>Phone</FormLabel>
<Input
  placeholder="Enter phone number"
  type="tel"
  value={userDetails?.phoneNo || ''}
  onChange={(e) =>
    setUserDetails({ ...userDetails, phoneNo: e.target.value })
  }
/>

                </Box>
                <Box flex={1}>
                  <FormLabel>Location</FormLabel>
                  <Input
                    placeholder="Enter location"
                    value={userDetails?.location}
                    onChange={(e) => setUserDetails({ ...userDetails, location: e.target.value })}
                  />
                </Box>
              </Flex>

              {/* Marital Status replaced the previous Location line */}
              <Flex gap={4}>
                <Box flex={1}>
                  <FormLabel>Marital Status</FormLabel>
                  <Select
                    placeholder="Select marital status"
                    value={userDetails?.maritalStatus}
                    onChange={(e) => setUserDetails({ ...userDetails, maritalStatus: e.target.value })}
                  >
                    <option value="Single">UnMarried</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </Select>
                </Box>
                <Box flex={1}>
                <FormLabel>Emergency Contact Name</FormLabel>
<Input
  placeholder="Enter emergency contact name"
  value={userDetails?.emgContactName || ''}
  onChange={(e) =>
    setUserDetails({ ...userDetails, emgContactName: e.target.value })
  }
/>

                </Box>
              </Flex>

              <Flex gap={4}>
                {/* Emergency Contact Relation */}
                <Box flex={1}>
                <FormLabel>Emergency Contact Relation</FormLabel>
<Input
  placeholder="Enter emergency contact relation"
  value={userDetails?.emgContactRelation || ''}
  onChange={(e) =>
    setUserDetails({ ...userDetails, emgContactRelation: e.target.value })
  }
/>

                </Box>

                {/* Emergency Contact Phone */}
                <Box flex={1}>
                <FormLabel>Emergency Contact Phone</FormLabel>
<Input
  placeholder="Enter emergency contact phone"
  value={userDetails?.emgContactPhoneNo || ''}
  onChange={(e) =>
    setUserDetails({ ...userDetails, emgContactPhoneNo: e.target.value })
  }
/>

                </Box>
              </Flex>
            </VStack>
          </TabPanel>
          {/* Professional Details Tab */}
          <TabPanel>
            <VStack spacing={4} align="stretch">
              {/* Employee Code and Joining Date in the same line */}
              <Flex gap={4}>
                <Box flex={1}>
                <FormLabel>Employee Code</FormLabel>
<Input isReadOnly
  placeholder="Enter employee code"
  
  value={userDetails?.emp_code || ''}
/>

                </Box>
                <Box flex={1}>
                  <FormLabel>Joining Date</FormLabel>
                  <Input isReadOnly variant="filled" type="date" value={userDetails?.joiningDate} />
                </Box>
              </Flex>
              <FormLabel>
  <FormLabel fontWeight="medium">Resource Type</FormLabel>
  <Select
    placeholder="Select Resource Type"
    value={userDetails?.isBillable ? "Billable" : "Non-Billable"}
    onChange={(e) => setUserDetails({ ...userDetails, isBillable: e.target.value })}
  >
    <option value="Billable">Billable</option>
    <option value="Non-Billable">Non-Billable</option>
  </Select>
</FormLabel>

<FormLabel>
  <FormLabel fontWeight="medium">Type of Employment</FormLabel>
  <Select
    placeholder="Select type"
    size="md"
    value={userDetails?.employmentType || ""}
    onChange={(e) => setUserDetails({ ...userDetails, employmentType: e.target.value })}
  >
    <option value="Intern">Intern</option>
    <option value="Probation Period">Probation Period</option>
    <option value="Permanent">Permanent</option>
  </Select>
</FormLabel>

              {/* Designation and Department in the same line */}
              <Flex gap={4}>
                <Box flex={1}>
                  <FormLabel>Designation</FormLabel>
                  <Input isReadOnly
                    placeholder="Enter designation"
                    value={userDetails?.designation}
                    onChange={(e) => setUserDetails({ ...userDetails, designation: e.target.value })}
                  />
                </Box>
                <Box flex={1}>
                <FormLabel>Department</FormLabel>
<Input isReadOnly
  placeholder="Enter department"
  value={userDetails?.departmentName || ''}
  onChange={(e) =>
    setUserDetails({ ...userDetails, departmentName: e.target.value })
  }
/>

                </Box>
              </Flex>

              {/* Team Name and Team Manager Name in the same line */}
              <Flex gap={4}>
                <Box flex={1}>
                <FormLabel>Team</FormLabel>
<Input isReadOnly
  placeholder="Enter team name"
  value={userDetails?.teamName || ''}
  onChange={(e) =>
    setUserDetails({ ...userDetails, teamName: e.target.value })
  }
/>

                </Box>
                <Box flex={1}>
                <FormLabel>Team Manager</FormLabel>
                <Input isReadOnly
                  placeholder="Enter team manager name"
                  value={userDetails?.teamManagerName || ''}
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, teamManagerName: e.target.value })
                  }
                />

                </Box>
              </Flex>
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </ModalBody>
    <ModalFooter>
      <Button colorScheme="blue" variant="solid"   mr={3} onClick={handleSave}>
        Save
      </Button>
      <Button variant="outline"   onClick={onClose}>
        Cancel
      </Button>
    </ModalFooter>
  </ModalContent>
</Modal>

</Flex>

  );
}