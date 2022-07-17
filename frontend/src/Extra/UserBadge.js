import { CloseIcon } from "@chakra-ui/icons";
import { Box } from "@chakra-ui/react";
import React from "react";

const UserBadge = ({ user, handleFunction }) => {
  return (
    <Box
      px={2}
      py={1}
      borderRadius="lg"
      m={1}
      mb={2}
      variant="solid"
      cursor="pointer"
      fontSize={12}
      bg="purple"
      color="white"
    >
      {user.name}
      <CloseIcon pl={1} onClick={handleFunction} />
    </Box>
  );
};

export default UserBadge;
