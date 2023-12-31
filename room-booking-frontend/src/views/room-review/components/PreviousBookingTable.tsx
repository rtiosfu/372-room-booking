import {
  TableContainer,
  Table,
  Thead,
  TableCaption,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  useDisclosure,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  CardHeader,
  Card,
  Text,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { useEffect, useState, useContext } from "react";
import RoomReviewForm from "./RoomReviewForm";
import { UserContext } from "contexts/UserContext";

const PreviousBookingTable = () => {
  const [roomBookings, setRoomBookings] = useState([]);
  const [bookingID, setBookingID] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { loggedInUser } = useContext(UserContext);

  const fetchBookings = async () => {
    if (roomBookings.length > 0) {
      setRoomBookings([]);
      return;
    }
    const response = await fetch(
      `http://localhost:8080/room-booking/${loggedInUser.u_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    const responseReview = await fetch("http://localhost:8080/room-review", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    let responseData = await response.json();
    let responseReviewData = await responseReview.json();

    //Filter only past bookings from the user with no review from user
    responseData = responseData.filter((booking: any) => {
      return Date.parse(booking.start_datetime) < Date.now();
    });
    responseData = responseData.filter((booking: any) => {
      return !responseReviewData.some(
        (review: any) => review.booking_id == booking.booking_id
      );
    });

    responseData.sort(function (a: any, b: any) {
      return Date.parse(b.start_datetime) - Date.parse(a.start_datetime);
    });
    setRoomBookings(responseData);
  };

  useEffect(() => {
    fetchBookings().catch(console.error);
  }, []);
  return roomBookings.length > 0 ? (
    <TableContainer>
      <Table variant="striped">
        <TableCaption>Past bookings that you can review</TableCaption>
        <Thead>
          <Tr>
            <Th>Building Name</Th>
            <Th>Room Number</Th>
            <Th>Date</Th>
            <Th>Time</Th>
            <Th>Duration</Th>
          </Tr>
        </Thead>
        <Tbody>
          {roomBookings.map((room: any) => (
            <Tr key={room.booking_id}>
              <Td>{room.building_name}</Td>
              <Td>{room.room_number}</Td>
              <Td>{format(new Date(room.start_datetime), "MMMM d, yyyy")}</Td>
              <Td>{format(new Date(room.start_datetime), "h:mm aaa")}</Td>
              <Td>{room.duration} minutes</Td>
              <Td>
                <Button
                  colorScheme="teal"
                  onClick={() => {
                    setBookingID(room.booking_id);
                    onOpen();
                  }}
                >
                  Create Review
                </Button>
              </Td>
              <Td>
                <Modal isOpen={isOpen} onClose={onClose} size="xl">
                  <ModalOverlay
                    bg="none"
                    backdropFilter="auto"
                    backdropBlur="2px"
                  />
                  <ModalContent>
                    <ModalHeader>Create a review</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                      <RoomReviewForm
                        bookingID={bookingID}
                        setBookingID={setBookingID}
                      />
                    </ModalBody>
                    <ModalFooter />
                  </ModalContent>
                </Modal>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  ) : (
    <Card padding={10}>
      <Text fontSize="30px">No bookings available to review</Text>
    </Card>
  );
};

export default PreviousBookingTable;
